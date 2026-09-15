"""Recruiter-owned workflow schemas, separate from automated evidence."""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel


RecruiterStageValue = Literal["new", "reviewing", "shortlisted", "on_hold", "rejected"]


class RecruiterStateUpdateRequest(BaseModel):
    recruiter_stage: RecruiterStageValue | None = None
    shortlisted: bool | None = None


class RecruiterStateResponse(BaseModel):
    screening_result_id: UUID
    recruiter_stage: RecruiterStageValue
    shortlisted: bool
    recruiter_updated_at: datetime | None


class JobCandidateScreeningResponse(RecruiterStateResponse):
    candidate_id: UUID
    candidate_name: str
    resume_id: UUID | None
    overall_score: float | None
    automated_status: str


class JobCandidateListResponse(BaseModel):
    job_id: UUID
    candidates: list[JobCandidateScreeningResponse]
