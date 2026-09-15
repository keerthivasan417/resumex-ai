"""Run the synthetic screening dataset through the deterministic evaluation adapter."""

import argparse
import json
from dataclasses import dataclass
from pathlib import Path
from types import SimpleNamespace
from uuid import NAMESPACE_URL, UUID, uuid5

from app.models.core import RequirementImportance
from app.schemas.job import JobRequirementCreate
from app.services.job_intelligence import extract_requirements
from app.services.job_matching import (
    align_requirements,
    calculate_combined_match_score,
    final_requirement_decision,
)
from app.services.semantic_matching import SemanticRequirementMatch
from app.services.skill_intelligence import analyze_resume_sections


DATASET_PATH = Path(__file__).resolve().parents[3] / "training" / "evaluation" / "datasets" / "v1" / "screening_cases.json"


class DatasetValidationError(ValueError):
    """Raised when a versioned evaluation dataset has an invalid case contract."""


@dataclass(frozen=True)
class EvaluationSummary:
    """Machine-readable evaluation outcome and aggregate metrics."""

    dataset_version: str
    case_count: int
    metrics: dict[str, float]
    cases: list[dict[str, object]]

    def as_dict(self) -> dict[str, object]:
        return {
            "dataset_version": self.dataset_version,
            "case_count": self.case_count,
            "metrics": self.metrics,
            "cases": self.cases,
        }


def load_dataset(path: Path = DATASET_PATH) -> dict[str, object]:
    """Load and validate the checked-in, synthetic evaluation dataset."""
    dataset = json.loads(path.read_text(encoding="utf-8"))
    _validate_dataset(dataset)
    return dataset


def evaluate_dataset(dataset: dict[str, object]) -> EvaluationSummary:
    """Evaluate every synthetic case using existing deterministic screening primitives."""
    _validate_dataset(dataset)
    evaluated_cases = [_evaluate_case(case) for case in dataset["cases"]]
    predictions = [requirement for case in evaluated_cases for requirement in case["requirements"]]
    metrics = _metrics(predictions)
    return EvaluationSummary(str(dataset["version"]), len(evaluated_cases), metrics, evaluated_cases)


def write_report(summary: EvaluationSummary, output_path: Path) -> None:
    """Write a stable JSON report for CI or local quality tracking."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(summary.as_dict(), indent=2, sort_keys=True) + "\n", encoding="utf-8")


def format_console_summary(summary: EvaluationSummary) -> str:
    """Return a concise human-readable evaluation summary."""
    metrics = summary.metrics
    return (
        f"ResumeX screening evaluation v{summary.dataset_version}: {summary.case_count} cases | "
        f"precision={metrics['requirement_precision']:.3f} "
        f"recall={metrics['requirement_recall']:.3f} "
        f"f1={metrics['requirement_f1']:.3f} "
        f"evidence_status_accuracy={metrics['evidence_status_accuracy']:.3f}"
    )


def _evaluate_case(case: dict[str, object]) -> dict[str, object]:
    case_id = str(case["id"])
    sections = [
        SimpleNamespace(
            id=uuid5(NAMESPACE_URL, f"{case_id}:section:{index}"),
            section_type=section["section_type"],
            content=section["content"],
        )
        for index, section in enumerate(case["resume_sections"])
    ]
    analyses = analyze_resume_sections(sections)
    resume_skills = [
        SimpleNamespace(
            skill=SimpleNamespace(name=analysis.skill.name),
            status=analysis.status,
            score=analysis.score,
            evidence=[
                SimpleNamespace(
                    id=uuid5(NAMESPACE_URL, f"{case_id}:{analysis.skill.name}:{index}"),
                    resume_section_id=evidence.section_id,
                    excerpt=evidence.excerpt,
                )
                for index, evidence in enumerate(analysis.evidence)
            ],
        )
        for analysis in analyses
    ]
    explicit = [JobRequirementCreate(**item) for item in case["requirements"]]
    normalized = extract_requirements(str(case["job_description"]), explicit)
    requirements = [
        SimpleNamespace(
            id=uuid5(NAMESPACE_URL, f"{case_id}:requirement:{index}"),
            description=item.description,
            importance=item.importance,
            skill=SimpleNamespace(name=item.skill.name) if item.skill else None,
        )
        for index, item in enumerate(normalized)
    ]
    alignments = align_requirements(requirements, resume_skills)
    expected_by_requirement = {item["requirement"]: item for item in case["expected"]}
    semantic_by_requirement = {
        item["requirement"]: float(item.get("semantic_similarity", 0.0)) for item in case["expected"]
    }
    semantic_matches = [
        SemanticRequirementMatch(
            requirement=alignment.requirement,
            similarity=semantic_by_requirement.get(_requirement_key(alignment.requirement), 0.0),
            chunks=(),
        )
        for alignment in alignments
    ]
    semantic_for_id = {item.requirement.id: item for item in semantic_matches}
    requirement_results: list[dict[str, object]] = []
    for alignment in alignments:
        semantic = semantic_for_id[alignment.requirement.id]
        key = _requirement_key(alignment.requirement)
        expected = expected_by_requirement[key]
        evidence_status = alignment.supporting_skill.status.value if alignment.supporting_skill else "not_found"
        requirement_results.append(
            {
                "requirement": key,
                "importance": alignment.requirement.importance.value,
                "predicted_outcome": final_requirement_decision(alignment, semantic),
                "expected_outcome": expected["outcome"],
                "predicted_evidence_status": evidence_status,
                "expected_evidence_status": expected["evidence_status"],
                "semantic_similarity": semantic.similarity,
                "deterministic_reason": alignment.reason,
            }
        )
    return {
        "id": case_id,
        "categories": case["categories"],
        "deterministic_score": round(sum(item.credit for item in alignments) / len(alignments) * 100, 2) if alignments else 0.0,
        "combined_score": calculate_combined_match_score(alignments, semantic_matches),
        "requirements": requirement_results,
    }


def _requirement_key(requirement: object) -> str:
    skill = getattr(requirement, "skill")
    return skill.name if skill is not None else requirement.description


def _metrics(predictions: list[dict[str, object]]) -> dict[str, float]:
    expected_positive = [item["expected_outcome"] != "unsupported" for item in predictions]
    predicted_positive = [item["predicted_outcome"] != "unsupported" for item in predictions]
    true_positive = sum(expected and predicted for expected, predicted in zip(expected_positive, predicted_positive))
    false_positive = sum(not expected and predicted for expected, predicted in zip(expected_positive, predicted_positive))
    false_negative = sum(expected and not predicted for expected, predicted in zip(expected_positive, predicted_positive))
    precision = true_positive / (true_positive + false_positive) if true_positive + false_positive else 0.0
    recall = true_positive / (true_positive + false_negative) if true_positive + false_negative else 0.0
    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0
    evidence_accuracy = sum(
        item["predicted_evidence_status"] == item["expected_evidence_status"] for item in predictions
    ) / len(predictions) if predictions else 0.0
    return {
        "requirement_precision": round(precision, 4),
        "requirement_recall": round(recall, 4),
        "requirement_f1": round(f1, 4),
        "evidence_status_accuracy": round(evidence_accuracy, 4),
    }


def _validate_dataset(dataset: object) -> None:
    if not isinstance(dataset, dict) or not isinstance(dataset.get("version"), str):
        raise DatasetValidationError("Dataset must define a string version.")
    cases = dataset.get("cases")
    if not isinstance(cases, list) or not cases:
        raise DatasetValidationError("Dataset must define at least one case.")
    identifiers: set[str] = set()
    for case in cases:
        if not isinstance(case, dict):
            raise DatasetValidationError("Each dataset case must be an object.")
        case_id = case.get("id")
        if not isinstance(case_id, str) or not case_id or case_id in identifiers:
            raise DatasetValidationError("Every case requires a unique non-empty id.")
        identifiers.add(case_id)
        for key in ("categories", "resume_sections", "requirements", "expected"):
            if not isinstance(case.get(key), list) or not case[key]:
                raise DatasetValidationError(f"Case {case_id} requires a non-empty {key} list.")
        if not isinstance(case.get("job_description"), str):
            raise DatasetValidationError(f"Case {case_id} requires a job_description.")
        expected_keys = {item.get("requirement") for item in case["expected"] if isinstance(item, dict)}
        if None in expected_keys or len(expected_keys) != len(case["expected"]):
            raise DatasetValidationError(f"Case {case_id} expected labels must have unique requirement keys.")


def main() -> None:
    """Run the versioned dataset and optionally write its JSON report."""
    parser = argparse.ArgumentParser(description="Evaluate ResumeX screening quality using synthetic data.")
    parser.add_argument("--dataset", type=Path, default=DATASET_PATH)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    summary = evaluate_dataset(load_dataset(args.dataset))
    if args.output:
        write_report(summary, args.output)
    print(format_console_summary(summary))
    print(json.dumps(summary.as_dict(), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
