"""Deterministic job requirement extraction and normalized job persistence."""

from dataclasses import dataclass
import re
from typing import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.core import Job, JobRequirement, RequirementImportance, Skill
from app.schemas.job import JobCreateRequest, JobRequirementCreate
from app.services.skill_catalog import SkillDefinition, find_skill_definitions, normalize_skill


@dataclass(frozen=True)
class NormalizedRequirement:
    """A job requirement with an optional catalog-backed canonical skill."""

    description: str
    importance: RequirementImportance
    skill: SkillDefinition | None


_PREFERRED_PATTERN = re.compile(r"\b(preferred|nice to have|bonus|plus|desirable)\b", re.IGNORECASE)


def extract_requirements(description: str, explicit_requirements: Iterable[JobRequirementCreate]) -> list[NormalizedRequirement]:
    """Extract known catalog skills from job text and merge explicit requirements."""
    requirements: list[NormalizedRequirement] = []
    for line in description.splitlines():
        cleaned_line = line.strip(" -•\t")
        if not cleaned_line:
            continue
        importance = _importance_for_text(cleaned_line)
        for skill in find_skill_definitions(cleaned_line):
            requirements.append(NormalizedRequirement(cleaned_line, importance, skill))

    for explicit in explicit_requirements:
        requirements.extend(_normalize_explicit_requirement(explicit))

    return _deduplicate_requirements(requirements)


def persist_job(db: Session, request: JobCreateRequest) -> Job:
    """Create a job and its normalized deterministic requirements."""
    job = Job(title=request.title, company_name=request.company_name, location=request.location, description=request.description)
    # Attach the parent before resolving skills. Resolving a later requirement can
    # autoflush, and the session must then know about the transient children.
    db.add(job)
    job.requirements = [
        JobRequirement(
            description=requirement.description,
            importance=requirement.importance,
            skill=_get_or_create_skill(db, requirement.skill) if requirement.skill else None,
        )
        for requirement in extract_requirements(request.description, request.requirements)
    ]
    db.flush()
    return job


def _normalize_explicit_requirement(explicit: JobRequirementCreate) -> list[NormalizedRequirement]:
    importance = RequirementImportance(explicit.importance)
    if explicit.skill:
        return [NormalizedRequirement(explicit.description, importance, normalize_skill(explicit.skill))]
    skills = find_skill_definitions(explicit.description)
    if skills:
        return [NormalizedRequirement(explicit.description, importance, skill) for skill in skills]
    return [NormalizedRequirement(explicit.description, importance, None)]


def _deduplicate_requirements(requirements: Iterable[NormalizedRequirement]) -> list[NormalizedRequirement]:
    """Keep one requirement per canonical skill, giving required priority over preferred."""
    merged: dict[str, NormalizedRequirement] = {}
    unnormalized: list[NormalizedRequirement] = []
    for requirement in requirements:
        if requirement.skill is None:
            if not any(item.description == requirement.description for item in unnormalized):
                unnormalized.append(requirement)
            continue
        key = requirement.skill.name
        existing = merged.get(key)
        if existing is None or requirement.importance is RequirementImportance.REQUIRED:
            merged[key] = requirement
    return [*merged.values(), *unnormalized]


def _get_or_create_skill(db: Session, definition: SkillDefinition) -> Skill:
    skill = db.scalar(select(Skill).where(Skill.name == definition.name))
    if skill is None:
        skill = Skill(name=definition.name, category=definition.category)
        db.add(skill)
        db.flush()
    return skill


def _importance_for_text(text: str) -> RequirementImportance:
    if _PREFERRED_PATTERN.search(text):
        return RequirementImportance.PREFERRED
    return RequirementImportance.REQUIRED
