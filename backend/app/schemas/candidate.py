"""Schemas for the minimal candidate profile lifecycle."""

from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CandidateCreateRequest(BaseModel):
    """The minimum profile data required before uploading a resume."""

    model_config = ConfigDict(extra="forbid")

    full_name: str = Field(min_length=1, max_length=255)


class CandidateResponse(BaseModel):
    """A persisted candidate profile suitable for the resume flow."""

    id: UUID
    full_name: str
    email: str | None
    headline: str | None
    location: str | None
    github_profile_url: str | None
