"""Deterministic, evidence-aware skill gaps and learning recommendations."""

from dataclasses import dataclass
from typing import Iterable
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.core import (
    Candidate, DeveloperSignal, GitHubProfileSnapshot, Job, JobRequirement, RequirementImportance, Resume, ResumeSkill,
    SkillEvidenceStatus,
)
from app.services.job_matching import load_job_for_matching, load_resume_for_matching
from app.services.learning_catalog import LearningResource, learning_resource_for


@dataclass(frozen=True)
class GitHubSkillContext:
    signal_id: UUID | None
    signal_type: str
    label: str
    source_url: str | None
    observed_at: object | None
    details: dict[str, object]


@dataclass(frozen=True)
class SkillGapItem:
    requirement: JobRequirement
    skill_name: str | None
    status: str
    resume_evidence_status: SkillEvidenceStatus | None
    evidence: tuple[object, ...]
    github_context: tuple[GitHubSkillContext, ...]
    reason: str
    recommendation: LearningResource | None


@dataclass(frozen=True)
class SkillGapSummary:
    required_satisfied_count: int
    required_partial_count: int
    required_gap_count: int
    preferred_gap_count: int
    needs_verification_count: int
    required_gaps: tuple[str, ...]
    preferred_gaps: tuple[str, ...]
    needs_verification: tuple[str, ...]


@dataclass(frozen=True)
class SkillGapResult:
    job: Job
    resume: Resume
    items: tuple[SkillGapItem, ...]
    summary: SkillGapSummary


class SkillGapNotFound(LookupError):
    """Raised when the requested job or resume cannot be evaluated."""


class SkillGapService:
    """Compare stored resume intelligence with job requirements without persistence."""

    def run(self, db: Session, job_id: UUID, resume_id: UUID) -> SkillGapResult:
        job = load_job_for_matching(db, job_id)
        if job is None:
            raise SkillGapNotFound("Job not found.")
        resume = load_resume_for_matching(db, resume_id)
        if resume is None:
            raise SkillGapNotFound("Resume not found.")
        github_context = self._load_github_context(db, resume.candidate_id)
        return self.evaluate(job, resume, github_context)

    def evaluate(
        self,
        job: Job,
        resume: Resume,
        github_context: Iterable[GitHubSkillContext] = (),
    ) -> SkillGapResult:
        """Classify every requirement, keeping resume evidence as the sole proof source."""
        github_by_skill: dict[str, list[GitHubSkillContext]] = {}
        for context in github_context:
            if context.signal_type not in {"github_language", "github_strength"}:
                continue
            github_by_skill.setdefault(context.label, []).append(context)
        resume_by_skill = {resume_skill.skill.name: resume_skill for resume_skill in resume.skill_intelligence}
        items = tuple(
            self._classify_requirement(requirement, resume_by_skill.get(requirement.skill.name) if requirement.skill else None,
                                       tuple(github_by_skill.get(requirement.skill.name, ())) if requirement.skill else ())
            for requirement in job.requirements
        )
        return SkillGapResult(job=job, resume=resume, items=items, summary=_summarize(items))

    @staticmethod
    def _classify_requirement(
        requirement: JobRequirement,
        resume_skill: ResumeSkill | None,
        github_context: tuple[GitHubSkillContext, ...],
    ) -> SkillGapItem:
        skill_name = requirement.skill.name if requirement.skill else None
        display_name = skill_name or requirement.description
        evidence = tuple(resume_skill.evidence) if resume_skill else ()
        if resume_skill is not None and resume_skill.status in {SkillEvidenceStatus.STRONG_EVIDENCE, SkillEvidenceStatus.SUPPORTED}:
            status, reason = "satisfied", f"{display_name} has {resume_skill.status.value} resume evidence."
        elif resume_skill is not None and resume_skill.status is SkillEvidenceStatus.WEAK_EVIDENCE:
            status, reason = "partial", f"{display_name} is mentioned only as weak resume evidence."
        elif resume_skill is not None:
            status, reason = "needs_verification", f"{display_name} has resume evidence that requires verification."
        elif github_context:
            status = "needs_verification"
            reason = f"No resume evidence exists for {display_name}; public GitHub context is supporting context only and requires verification."
        elif skill_name is None:
            status, reason = "needs_verification", "This requirement is not in the deterministic skill catalog and requires manual verification."
        else:
            status, reason = "gap", f"No stored resume evidence exists for {display_name}."
        recommendation = learning_resource_for(skill_name) if status == "gap" and skill_name else None
        return SkillGapItem(
            requirement=requirement,
            skill_name=skill_name,
            status=status,
            resume_evidence_status=resume_skill.status if resume_skill else None,
            evidence=evidence,
            github_context=github_context,
            reason=reason,
            recommendation=recommendation,
        )

    @staticmethod
    def _load_github_context(db: Session, candidate_id: UUID) -> tuple[GitHubSkillContext, ...]:
        candidate = db.scalar(
            select(Candidate)
            .where(Candidate.id == candidate_id)
            .options(
                selectinload(Candidate.github_snapshot)
                .selectinload(GitHubProfileSnapshot.signals)
                .selectinload(DeveloperSignal.skill)
            )
        )
        if candidate is None or candidate.github_snapshot is None:
            return ()
        return tuple(
            GitHubSkillContext(
                signal_id=signal.id,
                signal_type=signal.signal_type,
                label=signal.skill.name if signal.skill else signal.label,
                source_url=signal.source_url,
                observed_at=signal.observed_at,
                details=signal.details,
            )
            for signal in candidate.github_snapshot.signals
        )


def _summarize(items: Iterable[SkillGapItem]) -> SkillGapSummary:
    item_list = list(items)
    required = [item for item in item_list if item.requirement.importance is RequirementImportance.REQUIRED]
    preferred = [item for item in item_list if item.requirement.importance is RequirementImportance.PREFERRED]
    required_gaps = tuple(item.skill_name or item.requirement.description for item in required if item.status == "gap")
    preferred_gaps = tuple(item.skill_name or item.requirement.description for item in preferred if item.status == "gap")
    verification = tuple(item.skill_name or item.requirement.description for item in item_list if item.status == "needs_verification")
    return SkillGapSummary(
        required_satisfied_count=sum(item.status == "satisfied" for item in required),
        required_partial_count=sum(item.status == "partial" for item in required),
        required_gap_count=len(required_gaps),
        preferred_gap_count=len(preferred_gaps),
        needs_verification_count=len(verification),
        required_gaps=required_gaps,
        preferred_gaps=preferred_gaps,
        needs_verification=verification,
    )
