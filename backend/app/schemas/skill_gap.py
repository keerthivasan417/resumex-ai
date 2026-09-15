"""Response schemas for deterministic skill gaps and curated learning guidance."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SkillGapEvidenceResponse(BaseModel):
    id: UUID | None
    section_type: str
    excerpt: str
    reason: str


class GitHubSkillContextResponse(BaseModel):
    signal_id: UUID | None
    signal_type: str
    label: str
    source_url: str | None
    observed_at: datetime | None
    details: dict[str, object]


class LearningRecommendationResponse(BaseModel):
    skill: str
    reason: str
    learning_path: list[str]
    resource_title: str
    resource_url: str


class SkillGapItemResponse(BaseModel):
    requirement_id: UUID
    requirement: str
    importance: str
    skill: str | None
    status: str
    resume_evidence_status: str | None
    supporting_resume_evidence: list[SkillGapEvidenceResponse]
    github_context: list[GitHubSkillContextResponse]
    reason: str
    recommendation: LearningRecommendationResponse | None


class SkillGapSummaryResponse(BaseModel):
    required_satisfied_count: int
    required_partial_count: int
    required_gap_count: int
    preferred_gap_count: int
    needs_verification_count: int
    required_gaps: list[str]
    preferred_gaps: list[str]
    needs_verification: list[str]


class SkillGapResponse(BaseModel):
    job_id: UUID
    resume_id: UUID
    candidate_id: UUID
    summary: SkillGapSummaryResponse
    requirements: list[SkillGapItemResponse]
    recommendations: list[LearningRecommendationResponse]
