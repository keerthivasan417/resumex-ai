"""Schemas for generic local text-vector storage."""

from uuid import UUID

from pydantic import BaseModel, Field


class TextVectorCreate(BaseModel):
    """A text chunk to embed and store for a domain entity."""

    entity_type: str = Field(min_length=1, max_length=100)
    entity_id: UUID
    chunk_index: int = Field(ge=0)
    chunk_text: str = Field(min_length=1)
    source_section_id: UUID | None = None


class TextVectorSearchResult(BaseModel):
    """A vector-search result with cosine distance."""

    id: UUID
    entity_type: str
    entity_id: UUID
    chunk_index: int
    chunk_text: str
    cosine_distance: float
