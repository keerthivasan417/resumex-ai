"""Offline integration coverage for the assembled ResumeX screening workflow.

The test intentionally replaces pgvector/model collaborators with deterministic fakes;
all resume extraction, skill evidence, matching, gap, report, and recruiter logic is real.
"""

from datetime import datetime, timezone
from types import SimpleNamespace
from uuid import uuid4

import fitz
import pytest
from fastapi.testclient import TestClient

from app.api.evaluation_report_response import build_evaluation_report_response
from app.api.routes.candidates import create_candidate, get_candidate, get_developer_intelligence
from app.api.routes.jobs import create_job, get_job
from app.main import app
from app.models.core import Candidate, Job, JobStatus, RecruiterStage, ScreeningResult, ScreeningStatus
from app.schemas.candidate import CandidateCreateRequest
from app.schemas.job import JobCreateRequest
from app.services.evaluation_report import EvaluationReport, classify_final_assessment
from app.services.job_matching import RequirementAlignment, align_requirements, persist_match_result
from app.services.recruiter_workflow import RecruiterWorkflowService
from app.services.resume_upload import UploadValidationError, persist_resume, process_upload
from app.services.semantic_matching import SemanticChunkMatch, SemanticRequirementMatch
from app.services.skill_gap import GitHubSkillContext, SkillGapService
from app.services.skill_intelligence import analyze_resume_sections, persist_skill_intelligence


class _Session:
    """Minimal unit-of-work double that preserves model aggregates offline."""

    def __init__(self) -> None:
        self.added: list[object] = []
        self.commits = 0
        self.by_id: dict[object, object] = {}
        self.scalar_result: object | None = None

    def add(self, instance: object) -> None:
        self.added.append(instance)

    def scalar(self, statement: object):
        return self.scalar_result

    def execute(self, statement: object) -> None:
        pass

    def flush(self) -> None:
        pending = list(self.added)
        seen: set[int] = set()
        while pending:
            item = pending.pop()
            if id(item) in seen:
                continue
            seen.add(id(item))
            if getattr(item, "id", None) is None:
                item.id = uuid4()
            if isinstance(item, Candidate):
                self.by_id[item.id] = item
            if isinstance(item, Job) and item.status is None:
                item.status = JobStatus.DRAFT
            for relationship in ("sections", "requirements", "skill_intelligence", "evidence"):
                related = getattr(item, relationship, None)
                if related:
                    pending.extend(related)

    def commit(self) -> None:
        self.commits += 1

    def get(self, model, identifier):
        return self.by_id.get(identifier)

    def refresh(self, instance: object) -> None:
        pass


def _resume_pdf() -> bytes:
    document = fitz.open()
    page = document.new_page()
    page.insert_text((72, 72), """Jamie Candidate
SKILLS
Python, Docker
EXPERIENCE
Built Python APIs and deployed Docker services for 2 years.
PROJECTS
Implemented a Python workflow automation project.
""")
    output = document.tobytes()
    document.close()
    return output


def test_offline_happy_path_preserves_evidence_and_recruiter_state() -> None:
    """Resume through report succeeds without a hosted database, model, or GitHub call."""
    db = _Session()
    candidate_response = create_candidate(CandidateCreateRequest(full_name="Jamie Candidate"), db)  # type: ignore[arg-type]
    candidate_profile = get_candidate(candidate_response.id, db)  # type: ignore[arg-type]
    candidate = db.get(Candidate, candidate_profile.id)
    assert candidate is not None
    file_name, _, raw_text, sections = process_upload(_resume_pdf(), "jamie.pdf", "application/pdf")
    resume = persist_resume(db, candidate.id, file_name, "application/pdf", "jamie.pdf", raw_text, sections)
    resume.id = uuid4()
    for section in resume.sections:
        section.id = uuid4()
    analyses = analyze_resume_sections(resume.sections)
    persisted_skills = persist_skill_intelligence(db, resume, analyses)
    resume.skill_intelligence = persisted_skills

    created_job = create_job(
        JobCreateRequest(title="Backend Engineer", description="Required: Python\nPreferred: Docker"),
        db,  # type: ignore[arg-type]
    )
    job = next(item for item in db.added if isinstance(item, Job))
    db.scalar_result = job
    selected_job = get_job(created_job.id, db)  # type: ignore[arg-type]
    db.scalar_result = None
    assert selected_job.id == created_job.id
    assert selected_job.requirements

    alignments = tuple(align_requirements(job.requirements, resume.skill_intelligence))
    semantic_matches = tuple(
        SemanticRequirementMatch(
            requirement,
            0.9,
            (SemanticChunkMatch(SimpleNamespace(id=uuid4(), source_section_id=resume.sections[0].id, chunk_text=resume.sections[0].content), 0.9),),
        )
        for requirement in job.requirements
    )
    screening, evidence_by_requirement = persist_match_result(db, job, resume, alignments, semantic_matches)
    screening.id = screening.id or uuid4()
    screening.candidate = candidate
    screening.status = ScreeningStatus.COMPLETED
    screening.recruiter_stage = RecruiterStage.NEW
    screening.shortlisted = False

    github_context = (GitHubSkillContext(uuid4(), "github_strength", "Python", "https://github.com/jamie", None, {"repository_count": 1}),)
    skill_gap = SkillGapService().evaluate(job, resume, github_context)
    assessment = classify_final_assessment(float(screening.score), alignments, skill_gap)
    report = build_evaluation_report_response(
        EvaluationReport(job, resume, screening, alignments, skill_gap, assessment, datetime.now(timezone.utc))
    )

    original_score, original_evidence = screening.score, [(item.excerpt, item.evidence_type) for item in screening.evidence]
    db.by_id[screening.id] = screening
    RecruiterWorkflowService().update_state(db, screening.id, RecruiterStage.SHORTLISTED)

    class ListingSession:
        def scalars(self, statement):
            return [screening]

    class CandidateSession:
        def scalar(self, statement):
            return candidate

    listed = RecruiterWorkflowService().list_for_job(ListingSession(), job.id, shortlisted=True)  # type: ignore[arg-type]
    developer_context = get_developer_intelligence(candidate.id, CandidateSession())  # type: ignore[arg-type]

    assert raw_text.startswith("Jamie Candidate")
    assert {skill.skill.name for skill in resume.skill_intelligence} == {"Python", "Docker"}
    assert all(item.status in {"matched", "partially_supported"} for item in alignments)
    assert report.overall_score == float(original_score)
    assert report.skill_gap_summary.required_satisfied_count >= 1
    assert evidence_by_requirement
    assert any(item.evidence_type == "semantic_match" for item in screening.evidence)
    assert screening.shortlisted is True
    assert screening.score == original_score
    assert [(item.excerpt, item.evidence_type) for item in screening.evidence] == original_evidence
    assert listed == [screening]
    assert developer_context.signals == []
    assert developer_context.source_metadata is None


def test_invalid_resume_is_rejected_before_any_persistence() -> None:
    with pytest.raises(UploadValidationError):
        process_upload(b"not a document", "resume.txt", "text/plain")


def test_existing_routes_return_not_found_for_missing_screening_ids(monkeypatch) -> None:
    """The public contract returns 404, rather than attempting a semantic/model call."""
    from app.api.routes.screenings import EvaluationReportNotFound, ScreeningWorkflowNotFound

    class MissingWorkflow:
        def run(self, db, job_id, resume_id):
            raise ScreeningWorkflowNotFound("Job not found.")

    class MissingReport:
        def run(self, db, job_id, resume_id):
            raise EvaluationReportNotFound("Run screening before requesting an evaluation report.")

    monkeypatch.setattr("app.api.routes.screenings.ScreeningWorkflowService", MissingWorkflow)
    monkeypatch.setattr("app.api.routes.screenings.EvaluationReportService", MissingReport)
    client = TestClient(app)
    missing_id = uuid4()
    assert client.post(f"/api/screenings/jobs/{missing_id}/resumes/{missing_id}").status_code == 404
    assert client.get(f"/api/jobs/{missing_id}/resumes/{missing_id}/report").status_code == 404


def test_repeated_screening_reuses_the_same_persisted_scope() -> None:
    """A repeat replaces evidence in the existing candidate/job/resume scope."""

    class IdempotentSession(_Session):
        screening: ScreeningResult | None = None
        delete_calls = 0

        def add(self, instance: object) -> None:
            super().add(instance)
            if isinstance(instance, ScreeningResult):
                self.screening = instance

        def scalar(self, statement: object):
            return self.screening

        def execute(self, statement: object) -> None:
            self.delete_calls += 1

    db = IdempotentSession()
    requirement = SimpleNamespace(id=uuid4(), importance=SimpleNamespace(value="required"))
    job = SimpleNamespace(id=uuid4())
    resume = SimpleNamespace(id=uuid4(), candidate_id=uuid4())
    alignment = RequirementAlignment(requirement, "unsupported", None, (), 0.0, "No stored resume evidence.")

    first, _ = persist_match_result(db, job, resume, (alignment,))
    second, _ = persist_match_result(db, job, resume, (alignment,))

    assert first is second
    assert len([item for item in db.added if isinstance(item, ScreeningResult)]) == 1
    assert db.delete_calls == 1
