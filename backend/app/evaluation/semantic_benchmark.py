"""Live local-embedding and pgvector retrieval benchmark for synthetic text chunks."""

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.repositories.vector_repository import VectorRepository
from app.schemas.vector import TextVectorCreate
from app.services.embeddings import LocalEmbeddingService
from app.services.vector_store import VectorStoreService


DATASET_PATH = Path(__file__).resolve().parents[3] / "training" / "evaluation" / "datasets" / "v1" / "semantic_retrieval_benchmark.json"
BENCHMARK_ENTITY_TYPE = "evaluation_benchmark_v1"


class BenchmarkDatasetError(ValueError):
    """Raised when the benchmark dataset contract is invalid."""


@dataclass(frozen=True)
class BenchmarkSummary:
    """Serializable output from a live retrieval benchmark run."""

    dataset_version: str
    case_count: int
    metrics: dict[str, float]
    cases: list[dict[str, object]]

    def as_dict(self) -> dict[str, object]:
        return {"dataset_version": self.dataset_version, "case_count": self.case_count, "metrics": self.metrics, "cases": self.cases}


def load_benchmark_dataset(path: Path = DATASET_PATH) -> dict[str, object]:
    """Load and validate the checked-in synthetic retrieval benchmark."""
    dataset = json.loads(path.read_text(encoding="utf-8"))
    validate_benchmark_dataset(dataset)
    return dataset


def run_live_benchmark(
    db: Session,
    dataset: dict[str, object],
    *,
    embedding_service: LocalEmbeddingService | None = None,
    repository: VectorRepository | None = None,
) -> BenchmarkSummary:
    """Embed, index, retrieve, and measure the synthetic benchmark in an isolated namespace."""
    validate_benchmark_dataset(dataset)
    repository = repository or VectorRepository()
    embedding_service = embedding_service or LocalEmbeddingService()
    store = VectorStoreService(embedding_service, repository)
    repository.delete_entity_type(db, BENCHMARK_ENTITY_TYPE)
    chunks = {chunk["id"]: chunk for chunk in dataset["chunks"]}
    entity_ids = {}
    for chunk_id, chunk in chunks.items():
        entity_id = uuid5(NAMESPACE_URL, f"resumex-benchmark:{dataset['version']}:{chunk_id}")
        entity_ids[entity_id] = chunk_id
        store.replace_entity_texts(
            db,
            [TextVectorCreate(entity_type=BENCHMARK_ENTITY_TYPE, entity_id=entity_id, chunk_index=0, chunk_text=chunk["text"])],
        )
    db.flush()

    case_results: list[dict[str, object]] = []
    for case in dataset["cases"]:
        query_embedding = embedding_service.embed(case["requirement"])
        rows = repository.search_cosine(db, query_embedding, entity_type=BENCHMARK_ENTITY_TYPE, limit=len(chunks))
        ranked = [
            {"chunk_id": entity_ids[row.entity_id], "similarity": round(max(0.0, min(1.0, 1.0 - distance)), 6)}
            for row, distance in rows
        ]
        expected_ids = set(case["expected_relevant_chunk_ids"])
        case_results.append({"id": case["id"], "expected_relevant_chunk_ids": sorted(expected_ids), "ranked_chunks": ranked})
    return BenchmarkSummary(str(dataset["version"]), len(case_results), calculate_retrieval_metrics(case_results), case_results)


def calculate_retrieval_metrics(cases: list[dict[str, object]]) -> dict[str, float]:
    """Calculate hit accuracy, recall, and relevant/irrelevant average similarity at top k."""
    metrics: dict[str, float] = {}
    for k in (1, 3, 5):
        hits = 0
        recalls: list[float] = []
        for case in cases:
            expected = set(case["expected_relevant_chunk_ids"])
            retrieved = {row["chunk_id"] for row in case["ranked_chunks"][:k]}
            hits += bool(expected.intersection(retrieved))
            recalls.append(len(expected.intersection(retrieved)) / len(expected))
        metrics[f"top_{k}_accuracy"] = round(hits / len(cases), 4) if cases else 0.0
        metrics[f"top_{k}_recall"] = round(sum(recalls) / len(recalls), 4) if recalls else 0.0
    relevant, irrelevant = [], []
    for case in cases:
        expected = set(case["expected_relevant_chunk_ids"])
        for row in case["ranked_chunks"]:
            (relevant if row["chunk_id"] in expected else irrelevant).append(row["similarity"])
    metrics["average_relevant_similarity"] = round(sum(relevant) / len(relevant), 4) if relevant else 0.0
    metrics["average_irrelevant_similarity"] = round(sum(irrelevant) / len(irrelevant), 4) if irrelevant else 0.0
    return metrics


def write_benchmark_report(summary: BenchmarkSummary, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(summary.as_dict(), indent=2, sort_keys=True) + "\n", encoding="utf-8")


def format_benchmark_summary(summary: BenchmarkSummary) -> str:
    metrics = summary.metrics
    return (
        f"ResumeX semantic benchmark v{summary.dataset_version}: {summary.case_count} cases | "
        f"top1={metrics['top_1_accuracy']:.3f} top3={metrics['top_3_accuracy']:.3f} top5={metrics['top_5_accuracy']:.3f} "
        f"relevant_similarity={metrics['average_relevant_similarity']:.3f} "
        f"irrelevant_similarity={metrics['average_irrelevant_similarity']:.3f}"
    )


def validate_benchmark_dataset(dataset: object) -> None:
    if not isinstance(dataset, dict) or not isinstance(dataset.get("version"), str):
        raise BenchmarkDatasetError("Benchmark must define a string version.")
    chunks, cases = dataset.get("chunks"), dataset.get("cases")
    if not isinstance(chunks, list) or not chunks or not isinstance(cases, list) or not cases:
        raise BenchmarkDatasetError("Benchmark requires non-empty chunks and cases lists.")
    chunk_ids = [item.get("id") for item in chunks if isinstance(item, dict)]
    if len(chunk_ids) != len(chunks) or len(set(chunk_ids)) != len(chunk_ids) or any(not item for item in chunk_ids):
        raise BenchmarkDatasetError("Benchmark chunks need unique non-empty ids.")
    known_ids = set(chunk_ids)
    for case in cases:
        if not isinstance(case, dict) or not case.get("id") or not case.get("requirement"):
            raise BenchmarkDatasetError("Each benchmark case needs id and requirement.")
        expected = case.get("expected_relevant_chunk_ids")
        if not isinstance(expected, list) or not expected or not set(expected).issubset(known_ids):
            raise BenchmarkDatasetError("Each case needs known expected relevant chunk ids.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the live ResumeX pgvector retrieval benchmark.")
    parser.add_argument("--dataset", type=Path, default=DATASET_PATH)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    with SessionLocal() as db:
        summary = run_live_benchmark(db, load_benchmark_dataset(args.dataset))
        db.commit()
    write_benchmark_report(summary, args.output)
    print(format_benchmark_summary(summary))


if __name__ == "__main__":
    main()
