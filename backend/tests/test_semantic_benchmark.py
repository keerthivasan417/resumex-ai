"""Tests for live-benchmark dataset validation and pure retrieval metrics."""

import pytest

from app.evaluation.semantic_benchmark import BenchmarkDatasetError, calculate_retrieval_metrics, load_benchmark_dataset, validate_benchmark_dataset


def test_benchmark_dataset_is_versioned_and_valid() -> None:
    """The checked-in benchmark has four synthetic query cases."""
    dataset = load_benchmark_dataset()

    assert dataset["version"] == "1.0"
    assert len(dataset["cases"]) == 4


def test_retrieval_metrics_calculate_top_k_and_similarity_averages() -> None:
    """Metric aggregation is independent of live embeddings and pgvector."""
    metrics = calculate_retrieval_metrics([
        {"expected_relevant_chunk_ids": ["a"], "ranked_chunks": [{"chunk_id": "a", "similarity": 0.9}, {"chunk_id": "b", "similarity": 0.2}]},
        {"expected_relevant_chunk_ids": ["b"], "ranked_chunks": [{"chunk_id": "a", "similarity": 0.8}, {"chunk_id": "b", "similarity": 0.7}]},
    ])

    assert metrics["top_1_accuracy"] == 0.5
    assert metrics["top_3_accuracy"] == 1.0
    assert metrics["top_3_recall"] == 1.0
    assert metrics["average_relevant_similarity"] == 0.8
    assert metrics["average_irrelevant_similarity"] == 0.5


def test_benchmark_validation_rejects_unknown_relevant_chunk() -> None:
    """Expected labels must only reference chunks in the same versioned dataset."""
    with pytest.raises(BenchmarkDatasetError, match="known expected"):
        validate_benchmark_dataset({
            "version": "1.0",
            "chunks": [{"id": "known", "text": "synthetic"}],
            "cases": [{"id": "case", "requirement": "test", "expected_relevant_chunk_ids": ["missing"]}],
        })
