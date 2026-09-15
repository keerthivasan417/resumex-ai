"""Response schemas for explainable resume skill intelligence."""

from uuid import UUID

from pydantic import BaseModel


class SkillEvidenceResponse(BaseModel):
    """An explainable source snippet supporting a normalized skill."""

    section_type: str
    line_number: int
    excerpt: str
    weight: int
    reason: str
    resume_section_id: UUID | None


class ResumeSkillResponse(BaseModel):
    """A normalized resume skill and its deterministic evidence assessment."""

    name: str
    category: str | None
    status: str
    score: int
    explanation: str
    evidence: list[SkillEvidenceResponse]


class ResumeSkillIntelligenceResponse(BaseModel):
    """All persisted skill intelligence for one resume."""

    resume_id: UUID
    skills: list[ResumeSkillResponse]
