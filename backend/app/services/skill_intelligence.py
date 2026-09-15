"""Deterministic skill evidence extraction, scoring, and persistence."""

from collections import defaultdict
from dataclasses import dataclass
import re
from typing import Iterable, Protocol
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload

from app.models.core import Resume, ResumeSkill, ResumeSection, Skill, SkillEvidence, SkillEvidenceStatus
from app.services.skill_catalog import SkillDefinition, find_aliases, find_skill_definitions


class SectionSource(Protocol):
    """The section fields required for deterministic skill analysis."""

    id: UUID | None
    section_type: str
    content: str


@dataclass(frozen=True)
class DetectedSkillEvidence:
    """One source line that supports a canonical skill."""

    section_id: UUID | None
    section_type: str
    line_number: int
    excerpt: str
    weight: int
    reason: str


@dataclass(frozen=True)
class SkillAnalysis:
    """Explainable status and evidence collected for one canonical skill."""

    skill: SkillDefinition
    status: SkillEvidenceStatus
    score: int
    explanation: str
    evidence: tuple[DetectedSkillEvidence, ...]


_BASE_WEIGHTS = {
    "skills": 1,
    "experience": 4,
    "projects": 4,
    "education": 3,
    "certifications": 3,
}
_ACTION_PATTERN = re.compile(r"\b(built|created|developed|designed|deployed|implemented|integrated|maintained|migrated|optimized|led)\b", re.IGNORECASE)
_DURATION_PATTERN = re.compile(r"\b\d+(?:\.\d+)?\+?\s*(?:years?|yrs?|months?)\b", re.IGNORECASE)


def analyze_resume_sections(sections: Iterable[SectionSource]) -> list[SkillAnalysis]:
    """Extract catalog skills from resume sections and assign weighted evidence statuses."""
    evidence_by_skill: dict[str, list[DetectedSkillEvidence]] = defaultdict(list)
    definitions: dict[str, SkillDefinition] = {}

    for section in sections:
        for line_number, line in enumerate(section.content.splitlines(), start=1):
            if not line.strip():
                continue
            for definition in find_skill_definitions(line):
                aliases = find_aliases(line, definition)
                if not aliases:
                    continue
                evidence_by_skill[definition.name].append(_build_evidence(section, line_number, line))
                definitions[definition.name] = definition

    return [
        _build_analysis(definitions[name], evidence)
        for name, evidence in sorted(evidence_by_skill.items())
    ]


def status_for_evidence(evidence: Iterable[DetectedSkillEvidence]) -> SkillEvidenceStatus:
    """Classify deterministic evidence; empty evidence intentionally remains not found."""
    evidence_list = list(evidence)
    if not evidence_list:
        return SkillEvidenceStatus.NOT_FOUND
    score = sum(item.weight for item in evidence_list)
    source_types = {item.section_type for item in evidence_list}
    contextual = source_types.intersection({"experience", "projects"})
    certified = "certifications" in source_types
    concrete = any("implementation" in item.reason or "duration" in item.reason for item in evidence_list)

    if (contextual and concrete and score >= 6) or (certified and score >= 5):
        return SkillEvidenceStatus.STRONG_EVIDENCE
    if (contextual or certified or "education" in source_types) and score >= 3:
        return SkillEvidenceStatus.SUPPORTED
    if source_types == {"skills"}:
        return SkillEvidenceStatus.WEAK_EVIDENCE
    return SkillEvidenceStatus.NEEDS_VERIFICATION


def persist_skill_intelligence(db: Session, resume: Resume, analyses: Iterable[SkillAnalysis]) -> list[ResumeSkill]:
    """Replace deterministic resume intelligence with normalized skills and evidence rows."""
    db.execute(delete(ResumeSkill).where(ResumeSkill.resume_id == resume.id))
    persisted: list[ResumeSkill] = []
    for analysis in analyses:
        skill = db.scalar(select(Skill).where(Skill.name == analysis.skill.name))
        if skill is None:
            skill = Skill(name=analysis.skill.name, category=analysis.skill.category)
            db.add(skill)
            db.flush()

        resume_skill = ResumeSkill(
            resume=resume,
            skill=skill,
            status=analysis.status,
            score=analysis.score,
            explanation=analysis.explanation,
        )
        resume_skill.evidence = [
            SkillEvidence(
                resume_section_id=item.section_id,
                section_type=item.section_type,
                line_number=item.line_number,
                excerpt=item.excerpt,
                weight=item.weight,
                reason=item.reason,
            )
            for item in analysis.evidence
        ]
        db.add(resume_skill)
        persisted.append(resume_skill)
    db.flush()
    return persisted


def load_resume_skill_intelligence(db: Session, resume_id: UUID) -> Resume | None:
    """Load a resume with the data needed to return or generate skill intelligence."""
    statement = (
        select(Resume)
        .where(Resume.id == resume_id)
        .options(
            selectinload(Resume.sections),
            selectinload(Resume.skill_intelligence).selectinload(ResumeSkill.skill),
            selectinload(Resume.skill_intelligence).selectinload(ResumeSkill.evidence),
        )
    )
    return db.scalar(statement)


def _build_evidence(section: SectionSource, line_number: int, line: str) -> DetectedSkillEvidence:
    section_type = section.section_type.casefold()
    weight = _BASE_WEIGHTS.get(section_type, 1)
    reasons = [f"Mentioned in the {section_type} section"]
    if section_type in {"experience", "projects"} and _ACTION_PATTERN.search(line):
        weight += 2
        reasons.append("concrete implementation detail")
    if _DURATION_PATTERN.search(line):
        weight += 2
        reasons.append("duration stated")
    if section_type == "certifications":
        weight += 2
        reasons.append("certification context")
    return DetectedSkillEvidence(
        section_id=section.id,
        section_type=section_type,
        line_number=line_number,
        excerpt=line.strip()[:2000],
        weight=weight,
        reason="; ".join(reasons),
    )


def _build_analysis(skill: SkillDefinition, evidence: list[DetectedSkillEvidence]) -> SkillAnalysis:
    score = sum(item.weight for item in evidence)
    status = status_for_evidence(evidence)
    source_types = ", ".join(sorted({item.section_type for item in evidence}))
    explanation = f"{score} weighted point(s) from {len(evidence)} evidence item(s) in: {source_types}."
    return SkillAnalysis(skill, status, score, explanation, tuple(evidence))
