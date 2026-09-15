"""Response schemas for explainable deterministic job matching."""

from uuid import UUID

from pydantic import BaseModel


class MatchEvidenceResponse(BaseModel):
    """Persisted evidence copied into a screening result."""

    id: UUID
    source_skill_evidence_id: UUID | None
    excerpt: str
    evidence_type: str


class RequirementMatchResponse(BaseModel):
    """Alignment result for one job requirement."""

    requirement_id: UUID
    requirement: str
    importance: str
    status: str
    supporting_skill: str | None
    supporting_evidence: list[MatchEvidenceResponse]
    semantic_similarity: float
    semantic_chunks: list["SemanticChunkResponse"]
    evidence_status: str | None
    reason: str


class JobMatchResponse(BaseModel):
    """Persisted deterministic match result for a job and resume."""

    screening_result_id: UUID
    job_id: UUID
    resume_id: UUID
    candidate_id: UUID
    overall_score: float
    requirements: list[RequirementMatchResponse]


class SemanticChunkResponse(BaseModel):
    """Candidate text chunk retrieved by pgvector cosine similarity."""

    vector_id: UUID
    resume_section_id: UUID | None
    chunk_text: str
    similarity: float
