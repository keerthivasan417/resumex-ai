"""Schemas for resume upload responses."""

from uuid import UUID

from pydantic import BaseModel


class ResumeSectionResponse(BaseModel):
    """A deterministic section extracted from a resume."""

    section_type: str
    title: str | None
    position: int
    content: str


class ResumeUploadResponse(BaseModel):
    """Persisted resume metadata returned after a successful upload."""

    id: UUID
    candidate_id: UUID
    file_name: str
    mime_type: str
    status: str
    sections: list[ResumeSectionResponse]
