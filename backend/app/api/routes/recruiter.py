"""Recruiter workflow endpoints, intentionally separate from automated screening."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.core import RecruiterStage, ScreeningResult
from app.schemas.recruiter import (
    JobCandidateListResponse, JobCandidateScreeningResponse, RecruiterStateResponse, RecruiterStateUpdateRequest,
)
from app.services.recruiter_workflow import RecruiterWorkflowNotFound, RecruiterWorkflowService


router = APIRouter(tags=["recruiter-workflow"])


@router.get("/jobs/{job_id}/candidates", response_model=JobCandidateListResponse)
def list_job_candidates(
    job_id: UUID,
    db: Annotated[Session, Depends(get_db)],
    recruiter_stage: RecruiterStage | None = None,
    shortlisted: bool | None = None,
) -> JobCandidateListResponse:
    """List persisted candidate screenings with optional recruiter-state filters."""
    screenings = RecruiterWorkflowService().list_for_job(db, job_id, recruiter_stage, shortlisted)
    return JobCandidateListResponse(job_id=job_id, candidates=[_candidate_response(item) for item in screenings])


@router.get("/jobs/{job_id}/candidates/{candidate_id}/screening", response_model=JobCandidateScreeningResponse)
def get_candidate_screening(
    job_id: UUID,
    candidate_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> JobCandidateScreeningResponse:
    """Retrieve the latest persisted screening for a candidate/job pair."""
    try:
        return _candidate_response(RecruiterWorkflowService().get_for_candidate(db, job_id, candidate_id))
    except RecruiterWorkflowNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


@router.patch("/screenings/{screening_id}/recruiter-state", response_model=RecruiterStateResponse)
def update_recruiter_state(
    screening_id: UUID,
    request: RecruiterStateUpdateRequest,
    db: Annotated[Session, Depends(get_db)],
) -> RecruiterStateResponse:
    """Update recruiter stage/shortlist state without changing automated evidence or score."""
    try:
        stage = RecruiterStage(request.recruiter_stage) if request.recruiter_stage else None
        screening = RecruiterWorkflowService().update_state(db, screening_id, stage, request.shortlisted)
        db.commit()
        return _state_response(screening)
    except RecruiterWorkflowNotFound as error:
        raise HTTPException(status_code=404, detail=str(error)) from error


def _state_response(screening: ScreeningResult) -> RecruiterStateResponse:
    return RecruiterStateResponse(
        screening_result_id=screening.id,
        recruiter_stage=screening.recruiter_stage.value,
        shortlisted=screening.shortlisted,
        recruiter_updated_at=screening.recruiter_updated_at,
    )


def _candidate_response(screening: ScreeningResult) -> JobCandidateScreeningResponse:
    return JobCandidateScreeningResponse(
        **_state_response(screening).model_dump(),
        candidate_id=screening.candidate_id,
        candidate_name=screening.candidate.full_name,
        resume_id=screening.resume_id,
        overall_score=float(screening.score) if screening.score is not None else None,
        automated_status=screening.status.value,
    )
