"""Explainable deterministic alignment between job requirements and resume skills."""

from collections import defaultdict
from dataclasses import dataclass
from typing import Iterable
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.models.core import (
    Evidence,
    Job,
    JobRequirement,
    RequirementImportance,
    Resume,
    ResumeSkill,
    ScreeningResult,
    ScreeningStatus,
    SkillEvidence,
    SkillEvidenceStatus,
)
from app.services.semantic_matching import SemanticRequirementMatch, semantic_credit


@dataclass(frozen=True)
class RequirementAlignment:
    """Deterministic status and source evidence for a single requirement."""

    requirement: JobRequirement
    status: str
    supporting_skill: ResumeSkill | None
    evidence: tuple[SkillEvidence, ...]
    credit: float
    reason: str


_STATUS_CREDIT = {
    SkillEvidenceStatus.STRONG_EVIDENCE: 1.0,
    SkillEvidenceStatus.SUPPORTED: 0.8,
    SkillEvidenceStatus.WEAK_EVIDENCE: 0.4,
    SkillEvidenceStatus.NEEDS_VERIFICATION: 0.2,
    SkillEvidenceStatus.NOT_FOUND: 0.0,
}


def align_requirements(
    requirements: Iterable[JobRequirement], resume_skills: Iterable[ResumeSkill]
) -> list[RequirementAlignment]:
    """Align catalog-backed requirements to the same canonical resume skill names."""
    skill_by_name = {resume_skill.skill.name: resume_skill for resume_skill in resume_skills}
    alignments: list[RequirementAlignment] = []
    for requirement in requirements:
        if requirement.skill is None:
            alignments.append(
                RequirementAlignment(
                    requirement, "unsupported", None, (), 0.0,
                    "Requirement is not in the deterministic skill catalog and cannot be matched automatically.",
                )
            )
            continue

        resume_skill = skill_by_name.get(requirement.skill.name)
        if resume_skill is None:
            alignments.append(
                RequirementAlignment(
                    requirement, "unsupported", None, (), 0.0,
                    f"No stored resume intelligence found for {requirement.skill.name}.",
                )
            )
            continue

        credit = _STATUS_CREDIT[resume_skill.status]
        match_status = "matched" if resume_skill.status in {
            SkillEvidenceStatus.STRONG_EVIDENCE,
            SkillEvidenceStatus.SUPPORTED,
        } else "partially_supported"
        evidence = tuple(resume_skill.evidence)
        reason = (
            f"{requirement.skill.name} has {resume_skill.status.value} resume evidence "
            f"({resume_skill.score} evidence point(s)); match credit is {credit:.0%}."
        )
        alignments.append(RequirementAlignment(requirement, match_status, resume_skill, evidence, credit, reason))
    return alignments


def calculate_match_score(alignments: Iterable[RequirementAlignment]) -> float:
    """Return a 0-100 weighted score, prioritizing required requirements."""
    alignment_list = list(alignments)
    if not alignment_list:
        return 0.0
    weighted_credit = sum(_importance_weight(item.requirement.importance) * item.credit for item in alignment_list)
    total_weight = sum(_importance_weight(item.requirement.importance) for item in alignment_list)
    return round((weighted_credit / total_weight) * 100, 2) if total_weight else 0.0


def calculate_combined_match_score(
    alignments: Iterable[RequirementAlignment], semantic_matches: Iterable[SemanticRequirementMatch]
) -> float:
    """Combine evidence credit with thresholded semantic credit under importance weights."""
    alignment_by_id = {alignment.requirement.id: alignment for alignment in alignments}
    semantic_by_id = {match.requirement.id: match for match in semantic_matches}
    if not alignment_by_id:
        return 0.0
    if not semantic_by_id:
        return calculate_match_score(alignment_by_id.values())
    total_weight = sum(_importance_weight(item.requirement.importance) for item in alignment_by_id.values())
    total_credit = 0.0
    weight_sum = settings.match_evidence_weight + settings.match_semantic_weight
    for requirement_id, alignment in alignment_by_id.items():
        semantic = semantic_by_id.get(requirement_id)
        semantic_score = semantic_credit(semantic.similarity) if semantic else 0.0
        combined_credit = (
            settings.match_evidence_weight * alignment.credit + settings.match_semantic_weight * semantic_score
        ) / weight_sum
        total_credit += _importance_weight(alignment.requirement.importance) * combined_credit
    return round((total_credit / total_weight) * 100, 2)


def final_requirement_decision(alignment: RequirementAlignment, semantic: SemanticRequirementMatch | None) -> str:
    """Retain evidence-backed matches; semantic retrieval can only supply partial support."""
    if alignment.status == "matched":
        return "matched"
    if alignment.status == "partially_supported":
        return "partially_supported"
    if semantic and semantic_credit(semantic.similarity) > 0:
        return "partially_supported"
    return "unsupported"


def load_job_for_matching(db: Session, job_id: UUID) -> Job | None:
    """Load a job with normalized requirements and their catalog skills."""
    statement = (
        select(Job)
        .where(Job.id == job_id)
        .options(selectinload(Job.requirements).selectinload(JobRequirement.skill))
    )
    return db.scalar(statement)


def load_resume_for_matching(db: Session, resume_id: UUID) -> Resume | None:
    """Load resume skill intelligence and its supporting source snippets."""
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


def persist_match_result(
    db: Session,
    job: Job,
    resume: Resume,
    alignments: Iterable[RequirementAlignment],
    semantic_matches: Iterable[SemanticRequirementMatch] = (),
) -> tuple[ScreeningResult, dict[UUID, list[Evidence]]]:
    """Persist one replaceable screening result and its copied evidence trail."""
    alignment_list = list(alignments)
    screening = db.scalar(
        select(ScreeningResult).where(
            ScreeningResult.candidate_id == resume.candidate_id,
            ScreeningResult.job_id == job.id,
            ScreeningResult.resume_id == resume.id,
        )
    )
    if screening is None:
        screening = ScreeningResult(candidate_id=resume.candidate_id, job_id=job.id, resume_id=resume.id)
        db.add(screening)
        db.flush()
    else:
        db.execute(delete(Evidence).where(Evidence.screening_result_id == screening.id))

    semantic_by_requirement = {match.requirement.id: match for match in semantic_matches}
    score = calculate_combined_match_score(alignment_list, semantic_by_requirement.values())
    screening.status = ScreeningStatus.COMPLETED
    screening.score = score
    screening.summary = f"Combined deterministic evidence and semantic match score: {score:.2f}."

    evidence_by_requirement: dict[UUID, list[Evidence]] = defaultdict(list)
    for alignment in alignment_list:
        for evidence in alignment.evidence:
            persisted_evidence = Evidence(
                screening_result=screening,
                job_requirement_id=alignment.requirement.id,
                resume_section_id=evidence.resume_section_id,
                evidence_type=alignment.status,
                excerpt=evidence.excerpt,
                source_reference=f"skill_evidence:{evidence.id}" if evidence.id else None,
            )
            db.add(persisted_evidence)
            evidence_by_requirement[alignment.requirement.id].append(persisted_evidence)
        semantic_match = semantic_by_requirement.get(alignment.requirement.id)
        if semantic_match:
            for chunk in semantic_match.chunks:
                persisted_evidence = Evidence(
                    screening_result=screening,
                    job_requirement_id=alignment.requirement.id,
                    resume_section_id=chunk.vector.source_section_id,
                    evidence_type="semantic_match",
                    excerpt=chunk.vector.chunk_text,
                    source_reference=f"text_vector:{chunk.vector.id}",
                )
                db.add(persisted_evidence)
                evidence_by_requirement[alignment.requirement.id].append(persisted_evidence)
    db.flush()
    return screening, evidence_by_requirement


def _importance_weight(importance: RequirementImportance) -> float:
    if importance is RequirementImportance.PREFERRED:
        return settings.match_preferred_weight
    return settings.match_required_weight
