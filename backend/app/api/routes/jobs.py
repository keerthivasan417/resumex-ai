"""Job creation and deterministic resume matching endpoints."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.job import JobCreateRequest, JobCreateResponse, JobRequirementResponse
from app.schemas.matching import JobMatchResponse
from app.services.job_intelligence import persist_job
from app.api.screening_response import build_job_match_response
from app.services.screening_workflow import ScreeningWorkflowNotFound, ScreeningWorkflowService


router = APIRouter(tags=["jobs"])


@router.post("/jobs", response_model=JobCreateResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    request: JobCreateRequest,
    db: Annotated[Session, Depends(get_db)],
) -> JobCreateResponse:
    """Persist a job and deterministic catalog-backed requirements."""
    job = persist_job(db, request)
    db.commit()
    db.refresh(job)
    return JobCreateResponse(
        id=job.id,
        title=job.title,
        description=job.description or "",
        requirements=[
            JobRequirementResponse(
                id=requirement.id,
                description=requirement.description,
                importance=requirement.importance.value,
                skill=requirement.skill.name if requirement.skill else None,
            )
            for requirement in job.requirements
        ],
    )


@router.post("/jobs/{job_id}/resumes/{resume_id}/match", response_model=JobMatchResponse)
def match_resume_to_job(
    job_id: UUID,
    resume_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> JobMatchResponse:
    """Create or replace an explainable deterministic match result."""
    try:
        return build_job_match_response(ScreeningWorkflowService().run(db, job_id, resume_id))
    except ScreeningWorkflowNotFound as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
