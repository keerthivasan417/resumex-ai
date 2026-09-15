"""Schemas for deterministic job requirement creation."""

from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field


class JobRequirementCreate(BaseModel):
    """An optional explicit job requirement; catalog skills are normalized when known."""

    description: str = Field(min_length=1, max_length=5000)
    importance: Literal["required", "preferred"] = "required"
    skill: str | None = Field(default=None, max_length=255)


class JobCreateRequest(BaseModel):
    """A job description and optional explicit requirements."""

    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    requirements: list[JobRequirementCreate] = Field(default_factory=list)
    company_name: str = Field(default="Unspecified", min_length=1, max_length=255)


class JobRequirementResponse(BaseModel):
    """A stored, normalized job requirement."""

    id: UUID
    description: str
    importance: str
    skill: str | None


class JobCreateResponse(BaseModel):
    """Created job and its deterministic requirements."""

    id: UUID
    title: str
    description: str
    requirements: list[JobRequirementResponse]
