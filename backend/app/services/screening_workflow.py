"""End-to-end orchestration of the deterministic and semantic screening pipeline."""

from dataclasses import dataclass
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.core import Evidence, Job, Resume, ScreeningResult
from app.services.job_matching import (
    RequirementAlignment,
    align_requirements,
    calculate_combined_match_score,
    calculate_match_score,
    load_job_for_matching,
    load_resume_for_matching,
    persist_match_result,
)
from app.services.semantic_indexing import SemanticIndexService
from app.services.semantic_matching import SemanticMatchingService, SemanticRequirementMatch
from app.services.skill_intelligence import analyze_resume_sections, persist_skill_intelligence


class ScreeningWorkflowNotFound(LookupError):
    """Raised when the requested job or resume does not exist."""


@dataclass(frozen=True)
class ScreeningWorkflowResult:
    """One completed, persisted screening run and the data explaining it."""

    job: Job
    resume: Resume
    screening_result: ScreeningResult
    alignments: tuple[RequirementAlignment, ...]
    semantic_matches: tuple[SemanticRequirementMatch, ...]
    evidence_by_requirement: dict[UUID, list[Evidence]]
    deterministic_score: float
    overall_score: float


class ScreeningWorkflowService:
    """Run the ResumeX screening sequence without duplicating individual services."""

    def __init__(
        self,
        semantic_index_service: SemanticIndexService | None = None,
        semantic_matching_service: SemanticMatchingService | None = None,
    ) -> None:
        self.semantic_index_service = semantic_index_service or SemanticIndexService()
        self.semantic_matching_service = semantic_matching_service or SemanticMatchingService()

    def run(self, db: Session, job_id: UUID, resume_id: UUID) -> ScreeningWorkflowResult:
        """Refresh intelligence/vectors, match, and persist one final screening result."""
        job = load_job_for_matching(db, job_id)
        if job is None:
            raise ScreeningWorkflowNotFound("Job not found.")
        resume = load_resume_for_matching(db, resume_id)
        if resume is None:
            raise ScreeningWorkflowNotFound("Resume not found.")

        if not resume.skill_intelligence:
            persist_skill_intelligence(db, resume, analyze_resume_sections(resume.sections))
            db.flush()
            refreshed_resume = load_resume_for_matching(db, resume_id)
            if refreshed_resume is None:
                raise ScreeningWorkflowNotFound("Resume not found.")
            resume = refreshed_resume

        self.semantic_index_service.index_resume(db, resume)
        self.semantic_index_service.index_job(db, job)

        alignments = tuple(align_requirements(job.requirements, resume.skill_intelligence))
        semantic_matches = tuple(self.semantic_matching_service.match_requirements(db, job.requirements, resume))
        screening_result, evidence_by_requirement = persist_match_result(db, job, resume, alignments, semantic_matches)
        db.commit()

        return ScreeningWorkflowResult(
            job=job,
            resume=resume,
            screening_result=screening_result,
            alignments=alignments,
            semantic_matches=semantic_matches,
            evidence_by_requirement=evidence_by_requirement,
            deterministic_score=calculate_match_score(alignments),
            overall_score=calculate_combined_match_score(alignments, semantic_matches),
        )
