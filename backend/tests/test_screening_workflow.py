"""Tests for the unified screening orchestration and endpoint presentation."""

from types import SimpleNamespace
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app
from app.models.core import RequirementImportance, SkillEvidenceStatus
from app.services.job_matching import RequirementAlignment
from app.services.screening_workflow import ScreeningWorkflowResult, ScreeningWorkflowService


def test_workflow_runs_existing_services_in_controlled_order(monkeypatch) -> None:
    """The workflow refreshes vectors before semantic matching and persists the final result."""
    job_id, resume_id, candidate_id, requirement_id = uuid4(), uuid4(), uuid4(), uuid4()
    requirement = SimpleNamespace(id=requirement_id, importance=RequirementImportance.REQUIRED, description="Python")
    job = SimpleNamespace(id=job_id, requirements=[requirement])
    resume = SimpleNamespace(id=resume_id, candidate_id=candidate_id, sections=[], skill_intelligence=[SimpleNamespace()])
    screening = SimpleNamespace(id=uuid4())
    calls: list[str] = []

    class _Index:
        def index_resume(self, db, source_resume):
            assert source_resume is resume
            calls.append("resume_index")

        def index_job(self, db, source_job):
            assert source_job is job
            calls.append("job_index")

    class _Semantic:
        def match_requirements(self, db, requirements, source_resume):
            assert calls == ["resume_index", "job_index"]
            calls.append("semantic_match")
            return []

    alignment = RequirementAlignment(requirement, "unsupported", None, (), 0.0, "No evidence.")
    monkeypatch.setattr("app.services.screening_workflow.load_job_for_matching", lambda db, value: job)
    monkeypatch.setattr("app.services.screening_workflow.load_resume_for_matching", lambda db, value: resume)
    monkeypatch.setattr("app.services.screening_workflow.align_requirements", lambda requirements, skills: [alignment])
    monkeypatch.setattr(
        "app.services.screening_workflow.persist_match_result",
        lambda db, source_job, source_resume, alignments, semantic: (screening, {requirement_id: []}),
    )

    class _Db:
        def flush(self):
            calls.append("flush")

        def commit(self):
            calls.append("commit")

    result = ScreeningWorkflowService(_Index(), _Semantic()).run(_Db(), job_id, resume_id)  # type: ignore[arg-type]

    assert result.screening_result is screening
    assert calls == ["resume_index", "job_index", "semantic_match", "commit"]
    assert result.deterministic_score == 0.0


def test_screening_endpoint_returns_unified_breakdown(monkeypatch) -> None:
    """The API exposes requirement evidence, semantic data, and importance breakdowns together."""
    job_id, resume_id, candidate_id, requirement_id = uuid4(), uuid4(), uuid4(), uuid4()
    requirement = SimpleNamespace(id=requirement_id, importance=RequirementImportance.REQUIRED, description="Python")
    job = SimpleNamespace(id=job_id)
    resume = SimpleNamespace(id=resume_id, candidate_id=candidate_id)
    skill = SimpleNamespace(name="Python")
    resume_skill = SimpleNamespace(skill=skill, status=SkillEvidenceStatus.STRONG_EVIDENCE)
    alignment = RequirementAlignment(requirement, "matched", resume_skill, (), 1.0, "Strong evidence.")
    workflow = ScreeningWorkflowResult(
        job=job,
        resume=resume,
        screening_result=SimpleNamespace(id=uuid4()),
        alignments=(alignment,),
        semantic_matches=(),
        evidence_by_requirement={requirement_id: []},
        deterministic_score=100.0,
        overall_score=100.0,
    )

    class _WorkflowService:
        def run(self, db, received_job_id, received_resume_id):
            assert received_job_id == job_id
            assert received_resume_id == resume_id
            return workflow

    monkeypatch.setattr("app.api.routes.screenings.ScreeningWorkflowService", _WorkflowService)
    client = TestClient(app)
    response = client.post(f"/api/screenings/jobs/{job_id}/resumes/{resume_id}")

    assert response.status_code == 200
    body = response.json()
    assert body["overall_score"] == 100.0
    assert body["deterministic_score"] == 100.0
    assert body["required_breakdown"] == {"total": 1, "matched": 1, "partially_supported": 0, "unsupported": 0}
    assert body["requirements"][0]["evidence_status"] == "strong_evidence"
