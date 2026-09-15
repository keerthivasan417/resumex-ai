"""Structured, read-only evaluation report schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.github import DeveloperSignalResponse
from app.schemas.recruiter import RecruiterStateResponse
from app.schemas.skill_gap import LearningRecommendationResponse, SkillGapSummaryResponse


class ReportRequirementResponse(BaseModel):
    requirement_id: UUID
    requirement: str
    importance: str
    status: str
    evidence_status: str | None
    reason: str
    evidence_snippets: list[str]
    semantic_evidence_count: int


class SemanticMatchingSummaryResponse(BaseModel):
    persisted_semantic_evidence_count: int
    requirements_with_semantic_evidence: int
    note: str


class GitHubReportContextResponse(BaseModel):
    available: bool
    username: str | None
    source: str | None
    fetched_at: datetime | None
    signals: list[DeveloperSignalResponse]


class FinalAssessmentResponse(BaseModel):
    classification: str
    reason_codes: list[str]
    explanation: str


class EvaluationReportResponse(BaseModel):
    candidate_id: UUID
    resume_id: UUID
    job_id: UUID
    screening_result_id: UUID
    overall_score: float
    deterministic_score: float
    automated_status: str
    recruiter_state: RecruiterStateResponse
    required_alignment: list[ReportRequirementResponse]
    preferred_alignment: list[ReportRequirementResponse]
    semantic_matching: SemanticMatchingSummaryResponse
    github_context: GitHubReportContextResponse
    skill_gap_summary: SkillGapSummaryResponse
    learning_recommendations: list[LearningRecommendationResponse]
    final_assessment: FinalAssessmentResponse
    generated_at: datetime
