"""Recruiter-owned state transitions that never alter automated screening data."""

from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import bindparam, select
from sqlalchemy.orm import Session, selectinload

from app.models.core import Candidate, RecruiterStage, Resume, ScreeningResult


class RecruiterWorkflowNotFound(LookupError):
    """Raised when a requested screening result does not exist."""


class RecruiterWorkflowService:
    """List and update recruiter review state independently of automated evidence."""

    def list_for_job(
        self, db: Session, job_id: UUID, recruiter_stage: RecruiterStage | None = None, shortlisted: bool | None = None
    ) -> list[ScreeningResult]:
        statement = (
            select(ScreeningResult)
            .where(ScreeningResult.job_id == job_id)
            .options(selectinload(ScreeningResult.candidate), selectinload(ScreeningResult.resume))
            .order_by(ScreeningResult.score.desc().nullslast(), ScreeningResult.updated_at.desc())
        )
        if recruiter_stage is not None:
            statement = statement.where(ScreeningResult.recruiter_stage == recruiter_stage)
        if shortlisted is not None:
            statement = statement.where(ScreeningResult.shortlisted == bindparam("shortlisted", shortlisted))
        # A candidate may have several historical resume screenings for a job.
        # The candidate pool is candidate-scoped, not screening-scoped, so expose
        # only the canonical (most recently updated) screening for each person.
        # Keeping this reduction in the presentation query preserves historical
        # screening records without exposing duplicate candidate-pool rows.
        canonical: list[ScreeningResult] = []
        seen_candidate_ids: set[UUID] = set()
        for screening in sorted(
            db.scalars(statement),
            key=lambda item: (
                (item.updated_at or item.created_at or datetime.min.replace(tzinfo=timezone.utc)).timestamp(),
                str(item.id),
            ),
            reverse=True,
        ):
            if screening.candidate_id not in seen_candidate_ids:
                canonical.append(screening)
                seen_candidate_ids.add(screening.candidate_id)
        return canonical

    def get_for_candidate(self, db: Session, job_id: UUID, candidate_id: UUID) -> ScreeningResult:
        statement = (
            select(ScreeningResult)
            .where(ScreeningResult.job_id == job_id, ScreeningResult.candidate_id == candidate_id)
            .options(selectinload(ScreeningResult.candidate), selectinload(ScreeningResult.resume))
            .order_by(ScreeningResult.updated_at.desc())
        )
        screening = db.scalar(statement)
        if screening is None:
            raise RecruiterWorkflowNotFound("Screening result not found for this candidate and job.")
        return screening

    def update_state(
        self,
        db: Session,
        screening_id: UUID,
        recruiter_stage: RecruiterStage | None = None,
        shortlisted: bool | None = None,
    ) -> ScreeningResult:
        screening = db.get(ScreeningResult, screening_id)
        if screening is None:
            raise RecruiterWorkflowNotFound("Screening result not found.")
        if recruiter_stage is not None:
            screening.recruiter_stage = recruiter_stage
            if recruiter_stage is RecruiterStage.SHORTLISTED:
                screening.shortlisted = True
            elif shortlisted is None:
                screening.shortlisted = False
        if shortlisted is not None:
            screening.shortlisted = shortlisted
            if not shortlisted and recruiter_stage is None and screening.recruiter_stage is RecruiterStage.SHORTLISTED:
                screening.recruiter_stage = RecruiterStage.REVIEWING
        screening.recruiter_updated_at = datetime.now(timezone.utc)
        db.flush()
        return screening
