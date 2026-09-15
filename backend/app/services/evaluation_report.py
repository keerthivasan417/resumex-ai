"""Read-only aggregation of persisted screening evidence into recruiter reports."""

from dataclasses import dataclass
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.core import Candidate, DeveloperSignal, GitHubProfileSnapshot, Job, Resume, ScreeningResult
from app.services.job_matching import RequirementAlignment, align_requirements, calculate_match_score, load_job_for_matching, load_resume_for_matching
from app.services.skill_gap import SkillGapResult, SkillGapService


@dataclass(frozen=True)
class FinalAssessment:
    classification: str
    reason_codes: tuple[str, ...]
    explanation: str


@dataclass(frozen=True)
class EvaluationReport:
    job: Job
    resume: Resume
    screening: ScreeningResult
    alignments: tuple[RequirementAlignment, ...]
    skill_gap: SkillGapResult
    assessment: FinalAssessment
    generated_at: datetime


class EvaluationReportNotFound(LookupError):
    """Raised when a report has no corresponding persisted automated screening."""


class EvaluationReportService:
    """Aggregate existing pipeline outputs without rerunning or modifying matching."""

    def run(self, db: Session, job_id: UUID, resume_id: UUID) -> EvaluationReport:
        job = load_job_for_matching(db, job_id)
        resume = load_resume_for_matching(db, resume_id)
        if job is None:
            raise EvaluationReportNotFound("Job not found.")
        if resume is None:
            raise EvaluationReportNotFound("Resume not found.")
        screening = db.scalar(
            select(ScreeningResult)
            .where(
                ScreeningResult.job_id == job.id,
                ScreeningResult.resume_id == resume.id,
                ScreeningResult.candidate_id == resume.candidate_id,
            )
            .options(
                selectinload(ScreeningResult.evidence),
                selectinload(ScreeningResult.candidate)
                .selectinload(Candidate.github_snapshot)
                .selectinload(GitHubProfileSnapshot.signals)
                .selectinload(DeveloperSignal.skill),
            )
        )
        if screening is None:
            raise EvaluationReportNotFound("Run screening before requesting an evaluation report.")
        alignments = tuple(align_requirements(job.requirements, resume.skill_intelligence))
        skill_gap = SkillGapService().run(db, job_id, resume_id)
        assessment = classify_final_assessment(float(screening.score or 0), alignments, skill_gap)
        return EvaluationReport(job, resume, screening, alignments, skill_gap, assessment, datetime.now(timezone.utc))


def classify_final_assessment(
    overall_score: float, alignments: tuple[RequirementAlignment, ...], skill_gap: SkillGapResult
) -> FinalAssessment:
    """Classify transparent recruiter guidance from existing automated results only."""
    required = [item for item in alignments if item.requirement.importance.value == "required"]
    required_unsupported = sum(item.status == "unsupported" for item in required)
    required_partial = sum(item.status == "partially_supported" for item in required)
    if required and overall_score >= 80 and required_unsupported == 0 and required_partial == 0:
        return FinalAssessment("strong_fit", ("high_overall_score", "all_required_evidence_matched"), "High score with every required requirement backed by strong or supported resume evidence.")
    if overall_score >= 60 and required_unsupported == 0:
        return FinalAssessment("potential_fit", ("moderate_or_high_score", "required_requirements_addressed"), "Required requirements are addressed, with some evidence needing additional review.")
    if overall_score < 40 or (required and required_unsupported == len(required)):
        return FinalAssessment("low_fit", ("low_overall_score", "required_requirements_unresolved"), "Automated evidence leaves most required requirements unsupported.")
    codes = ["manual_review_recommended"]
    if skill_gap.summary.required_gap_count:
        codes.append("required_skill_gap")
    if skill_gap.summary.needs_verification_count:
        codes.append("evidence_needs_verification")
    return FinalAssessment("needs_review", tuple(codes), "Automated evidence is mixed; recruiter review is needed before a decision.")
