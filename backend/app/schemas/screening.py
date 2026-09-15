"""Unified response schemas for the end-to-end screening workflow."""

from pydantic import BaseModel

from app.schemas.matching import JobMatchResponse, RequirementMatchResponse


class RequirementBreakdownResponse(BaseModel):
    """Requirement-level counts grouped by importance."""

    total: int
    matched: int
    partially_supported: int
    unsupported: int


class ScreeningWorkflowResponse(JobMatchResponse):
    """A persisted end-to-end screening result with importance breakdowns."""

    deterministic_score: float
    required_breakdown: RequirementBreakdownResponse
    preferred_breakdown: RequirementBreakdownResponse
