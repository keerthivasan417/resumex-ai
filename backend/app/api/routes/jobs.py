"""Job creation and deterministic resume matching endpoints."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.core import Job, JobRequirement
from app.schemas.job import JobCreateRequest, JobCreateResponse, JobRequirementResponse, JobResponse
from app.schemas.matching import JobMatchResponse
from app.services.job_intelligence import persist_job
from app.api.screening_response import build_job_match_response
from app.services.screening_workflow import ScreeningWorkflowNotFound, ScreeningWorkflowService
from app.api.skill_gap_response import build_skill_gap_response
from app.schemas.skill_gap import SkillGapResponse
from app.services.skill_gap import SkillGapNotFound, SkillGapService


router = APIRouter(tags=["jobs"])


@router.get("/jobs", response_model=list[JobResponse])
def list_jobs(db: Annotated[Session, Depends(get_db)]) -> list[JobResponse]:
    """List stored jobs for deterministic frontend selection."""
    statement = (
        select(Job)
        .options(selectinload(Job.requirements).selectinload(JobRequirement.skill))
        .order_by(Job.created_at.desc())
    )
    return [_job_response(job) for job in db.scalars(statement)]


@router.get("/jobs/{job_id}", response_model=JobResponse)
def get_job(job_id: UUID, db: Annotated[Session, Depends(get_db)]) -> JobResponse:
    """Retrieve a job and its normalized requirement summary."""
    statement = (
        select(Job)
        .where(Job.id == job_id)
        .options(selectinload(Job.requirements).selectinload(JobRequirement.skill))
    )
    job = db.scalar(statement)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    return _job_response(job)


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


def _job_response(job: Job) -> JobResponse:
    """Map persisted job data consistently for job list and detail reads."""
    return JobResponse(
        id=job.id,
        title=job.title,
        description=job.description or "",
        status=job.status.value,
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


@router.get("/jobs/{job_id}/resumes/{resume_id}/skill-gap", response_model=SkillGapResponse)
def get_skill_gap(
    job_id: UUID,
    resume_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> SkillGapResponse:
    """Return deterministic evidence-aware skill gaps and local learning guidance."""
    try:
        return build_skill_gap_response(SkillGapService().run(db, job_id, resume_id))
    except SkillGapNotFound as error:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(error)) from error
