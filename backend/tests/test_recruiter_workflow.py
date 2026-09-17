"""Tests for recruiter state isolation and evaluation-report aggregation."""

from datetime import datetime, timezone
from types import SimpleNamespace
from uuid import uuid4

from fastapi.testclient import TestClient

from app.db.session import get_db
from app.main import app
from app.api.evaluation_report_response import build_evaluation_report_response
from app.models.core import (
    Candidate, Job, JobRequirement, RecruiterStage, RequirementImportance, Resume, ScreeningResult,
    ScreeningStatus, Skill,
)
from app.services.evaluation_report import EvaluationReport, classify_final_assessment
from app.services.job_matching import RequirementAlignment
from app.services.recruiter_workflow import RecruiterWorkflowService
from app.services.skill_gap import SkillGapResult, SkillGapSummary


def _gap_result(job: Job, resume: Resume, required_gaps: int = 0, verification: int = 0) -> SkillGapResult:
    return SkillGapResult(
        job=job,
        resume=resume,
        items=(),
        summary=SkillGapSummary(0, 0, required_gaps, 0, verification, (), (), ()),
    )


def test_final_assessment_is_deterministic_and_explainable() -> None:
    skill = Skill(name="Python")
    requirement = JobRequirement(id=uuid4(), description="Python", importance=RequirementImportance.REQUIRED, skill=skill)
    alignment = RequirementAlignment(requirement, "matched", None, (), 1.0, "Supported.")
    job = Job(id=uuid4(), title="Engineer", company_name="ResumeX")
    resume = Resume(id=uuid4(), candidate_id=uuid4(), file_name="resume.pdf", status="ready")

    strong = classify_final_assessment(90, (alignment,), _gap_result(job, resume))
    low = classify_final_assessment(20, (RequirementAlignment(requirement, "unsupported", None, (), 0, "Missing."),), _gap_result(job, resume, 1))

    assert strong.classification == "strong_fit"
    assert "all_required_evidence_matched" in strong.reason_codes
    assert low.classification == "low_fit"


def test_recruiter_update_preserves_automated_screening_data() -> None:
    screening = ScreeningResult(
        id=uuid4(), candidate_id=uuid4(), job_id=uuid4(), resume_id=uuid4(), status=ScreeningStatus.COMPLETED,
        score=82.5, summary="Automated summary", recruiter_stage=RecruiterStage.NEW, shortlisted=False,
    )

    class FakeDb:
        def get(self, model, value):
            return screening if value == screening.id else None

        def flush(self):
            pass

    updated = RecruiterWorkflowService().update_state(FakeDb(), screening.id, RecruiterStage.SHORTLISTED)  # type: ignore[arg-type]

    assert updated.recruiter_stage is RecruiterStage.SHORTLISTED
    assert updated.shortlisted is True
    assert updated.status is ScreeningStatus.COMPLETED
    assert updated.score == 82.5
    assert updated.summary == "Automated summary"


def test_candidate_listing_applies_requested_recruiter_filters() -> None:
    service = RecruiterWorkflowService()
    job_id = uuid4()
    screening = SimpleNamespace(
        id=uuid4(), candidate_id=uuid4(),
        updated_at=datetime.now(timezone.utc), created_at=datetime.now(timezone.utc),
    )

    class FakeDb:
        def __init__(self):
            self.statement = None

        def scalars(self, statement):
            self.statement = statement
            return [screening]

    db = FakeDb()
    result = service.list_for_job(db, job_id, RecruiterStage.SHORTLISTED, True)  # type: ignore[arg-type]

    assert result == [screening]
    params = db.statement.compile().params
    assert RecruiterStage.SHORTLISTED in params.values()
    assert True in params.values()


def test_candidate_listing_returns_only_the_latest_screening_per_candidate() -> None:
    service = RecruiterWorkflowService()
    job_id, candidate_id = uuid4(), uuid4()
    earlier = SimpleNamespace(
        id=uuid4(), candidate_id=candidate_id,
        updated_at=datetime(2026, 1, 1, tzinfo=timezone.utc), created_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )
    latest = SimpleNamespace(
        id=uuid4(), candidate_id=candidate_id,
        updated_at=datetime(2026, 2, 1, tzinfo=timezone.utc), created_at=datetime(2026, 2, 1, tzinfo=timezone.utc),
    )
    another_candidate = SimpleNamespace(
        id=uuid4(), candidate_id=uuid4(),
        updated_at=datetime(2026, 1, 15, tzinfo=timezone.utc), created_at=datetime(2026, 1, 15, tzinfo=timezone.utc),
    )

    class FakeDb:
        def scalars(self, statement):
            return [earlier, another_candidate, latest]

    result = service.list_for_job(FakeDb(), job_id)  # type: ignore[arg-type]

    assert result == [latest, another_candidate]


def test_get_job_candidates_returns_one_entry_for_a_candidate_with_multiple_resumes(monkeypatch) -> None:
    job_id, candidate_id = uuid4(), uuid4()
    candidate = SimpleNamespace(full_name="Ada Candidate")
    older = SimpleNamespace(
        id=uuid4(), candidate_id=candidate_id, candidate=candidate, resume_id=uuid4(), score=71,
        status=ScreeningStatus.COMPLETED, recruiter_stage=RecruiterStage.NEW, shortlisted=False,
        recruiter_updated_at=None, updated_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
        created_at=datetime(2026, 1, 1, tzinfo=timezone.utc),
    )
    latest = SimpleNamespace(
        id=uuid4(), candidate_id=candidate_id, candidate=candidate, resume_id=uuid4(), score=88,
        status=ScreeningStatus.COMPLETED, recruiter_stage=RecruiterStage.SHORTLISTED, shortlisted=True,
        recruiter_updated_at=datetime(2026, 2, 1, tzinfo=timezone.utc), updated_at=datetime(2026, 2, 1, tzinfo=timezone.utc),
        created_at=datetime(2026, 2, 1, tzinfo=timezone.utc),
    )

    class FakeDb:
        def scalars(self, statement):
            return [older, latest]

    app.dependency_overrides[get_db] = lambda: FakeDb()
    try:
        response = TestClient(app).get(f"/api/jobs/{job_id}/candidates")
    finally:
        app.dependency_overrides.pop(get_db, None)

    assert response.status_code == 200
    body = response.json()
    assert len(body["candidates"]) == 1
    assert body["candidates"][0]["candidate_id"] == str(candidate_id)
    assert body["candidates"][0]["screening_result_id"] == str(latest.id)
    assert body["candidates"][0]["shortlisted"] is True


def test_evaluation_report_aggregates_existing_results_without_mutation() -> None:
    candidate = Candidate(id=uuid4(), full_name="Ada Candidate")
    resume = Resume(id=uuid4(), candidate_id=candidate.id, candidate=candidate, file_name="resume.pdf", status="ready")
    skill = Skill(name="Python")
    requirement = JobRequirement(id=uuid4(), description="Python", importance=RequirementImportance.REQUIRED, skill=skill)
    job = Job(id=uuid4(), title="Engineer", company_name="ResumeX", requirements=[requirement])
    screening = ScreeningResult(
        id=uuid4(), candidate_id=candidate.id, job_id=job.id, resume_id=resume.id, candidate=candidate,
        status=ScreeningStatus.COMPLETED, score=90, recruiter_stage=RecruiterStage.REVIEWING, shortlisted=False,
    )
    alignment = RequirementAlignment(requirement, "matched", None, (), 1.0, "Strong resume evidence.")
    report = EvaluationReport(
        job, resume, screening, (alignment,), _gap_result(job, resume),
        classify_final_assessment(90, (alignment,), _gap_result(job, resume)), datetime.now(timezone.utc),
    )

    response = build_evaluation_report_response(report)

    assert response.overall_score == 90
    assert response.required_alignment[0].status == "matched"
    assert response.final_assessment.classification == "strong_fit"
    assert response.recruiter_state.recruiter_stage == "reviewing"
    assert screening.score == 90
