"""Tests for the reproducible synthetic screening evaluation framework."""

import json

import pytest

from app.evaluation.screening_evaluator import (
    DatasetValidationError,
    evaluate_dataset,
    format_console_summary,
    load_dataset,
    write_report,
)


def test_versioned_dataset_evaluates_reproducibly() -> None:
    """The checked-in synthetic cases yield a stable, perfect baseline report."""
    summary = evaluate_dataset(load_dataset())

    assert summary.case_count == 8
    assert summary.metrics == {
        "requirement_precision": 1.0,
        "requirement_recall": 1.0,
        "requirement_f1": 1.0,
        "evidence_status_accuracy": 1.0,
    }
    assert "8 cases" in format_console_summary(summary)


def test_dataset_validation_rejects_duplicate_case_ids() -> None:
    """Dataset contracts reject ambiguous case identifiers before evaluation."""
    dataset = {
        "version": "1.0",
        "cases": [
            {"id": "duplicate", "categories": ["x"], "resume_sections": [{"section_type": "skills", "content": "Python"}], "job_description": "Python", "requirements": [{"description": "Python"}], "expected": [{"requirement": "Python", "outcome": "partially_supported", "evidence_status": "weak_evidence"}]},
            {"id": "duplicate", "categories": ["x"], "resume_sections": [{"section_type": "skills", "content": "Python"}], "job_description": "Python", "requirements": [{"description": "Python"}], "expected": [{"requirement": "Python", "outcome": "partially_supported", "evidence_status": "weak_evidence"}]}
        ],
    }

    with pytest.raises(DatasetValidationError, match="unique non-empty id"):
        evaluate_dataset(dataset)


def test_json_report_is_machine_readable(tmp_path) -> None:
    """The runner writes a stable JSON object suitable for automated inspection."""
    output = tmp_path / "report.json"
    summary = evaluate_dataset(load_dataset())
    write_report(summary, output)

    report = json.loads(output.read_text(encoding="utf-8"))
    assert report["case_count"] == 8
    assert report["metrics"]["requirement_f1"] == 1.0
