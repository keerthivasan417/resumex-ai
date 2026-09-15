"""Public GitHub developer-intelligence API schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GitHubSyncRequest(BaseModel):
    """An optional replacement profile URL for a candidate GitHub sync."""

    github_profile_url: str | None = Field(default=None, max_length=2048)


class DeveloperSignalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    signal_type: str
    label: str
    normalized_skill: str | None
    source_url: str | None
    observed_at: datetime | None
    details: dict[str, object]


class DeveloperIntelligenceResponse(BaseModel):
    """Cached, source-attributed public developer signals for a candidate."""

    candidate_id: UUID
    github_profile_url: str | None
    username: str | None
    profile_name: str | None
    public_repository_count: int | None
    source: str | None
    fetched_at: datetime | None
    signals: list[DeveloperSignalResponse]
