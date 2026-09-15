"""Tests for deterministic job intelligence and explainable matching."""

from types import SimpleNamespace
from uuid import uuid4

from app.models.core import RequirementImportance, SkillEvidenceStatus
from app.schemas.job import JobCreateRequest
from app.services.job_intelligence import extract_requirements, persist_job
from app.services.job_matching import align_requirements, calculate_match_score, persist_match_result


def _requirement(skill_name: str, importance: RequirementImportance = RequirementImportance.REQUIRED):
    return SimpleNamespace(
        id=uuid4(),
        description=f"{skill_name} requirement",
        importance=importance,
        skill=SimpleNamespace(name=skill_name),
    )


def _resume_skill(skill_name: str, status: SkillEvidenceStatus, evidence=()):
    return SimpleNamespace(skill=SimpleNamespace(name=skill_name), status=status, score=6, evidence=list(evidence))


def test_job_description_extracts_normalized_alias_requirements() -> None:
    """Aliases in job text become canonical job requirement skills."""
    requirements = extract_requirements("Required: ReactJS and Postgres experience.", [])

    assert {requirement.skill.name for requirement in requirements if requirement.skill} == {"React", "PostgreSQL"}


def test_exact_and_alias_skill_match_is_matched() -> None:
    """Canonical names align even when the job description used an alias."""
    requirement = _requirement("React")
    alignment = align_requirements([requirement], [_resume_skill("React", SkillEvidenceStatus.SUPPORTED)])[0]

    assert alignment.status == "matched"
    assert alignment.supporting_skill.skill.name == "React"
    assert alignment.credit == 0.8


def test_strong_evidence_match_receives_full_credit() -> None:
    """Concrete experience/project evidence receives a full exact-match credit."""
    alignment = align_requirements(
        [_requirement("Python")], [_resume_skill("Python", SkillEvidenceStatus.STRONG_EVIDENCE)]
    )[0]

    assert alignment.status == "matched"
    assert alignment.credit == 1.0


def test_weak_skill_list_is_only_partially_supported() -> None:
    """A skills-list mention cannot become a full match."""
    alignment = align_requirements(
        [_requirement("PostgreSQL")], [_resume_skill("PostgreSQL", SkillEvidenceStatus.WEAK_EVIDENCE)]
    )[0]

    assert alignment.status == "partially_supported"
    assert alignment.credit == 0.4


def test_missing_requirement_is_unsupported() -> None:
    """No candidate evidence results in an unsupported requirement."""
    alignment = align_requirements([_requirement("Docker")], []) [0]

    assert alignment.status == "unsupported"
    assert alignment.supporting_skill is None
    assert "No stored resume intelligence" in alignment.reason


def test_required_requirements_outweigh_preferred_requirements() -> None:
    """Required requirements use the configured higher deterministic weight."""
    required_match = align_requirements(
        [_requirement("Python")], [_resume_skill("Python", SkillEvidenceStatus.STRONG_EVIDENCE)]
    )[0]
    preferred_miss = align_requirements([_requirement("Docker", RequirementImportance.PREFERRED)], [])[0]

    assert calculate_match_score([required_match, preferred_miss]) == 75.0
    assert calculate_match_score([preferred_miss, required_match]) == 75.0


def test_alignment_preserves_supporting_evidence_and_reason() -> None:
    """Explainability includes the original skill-evidence snippet and location."""
    source_evidence = SimpleNamespace(
        id=uuid4(), resume_section_id=uuid4(), excerpt="Built Python APIs for 2 years.", section_type="experience"
    )
    alignment = align_requirements(
        [_requirement("Python")], [_resume_skill("Python", SkillEvidenceStatus.STRONG_EVIDENCE, [source_evidence])]
    )[0]

    assert alignment.evidence[0].excerpt == "Built Python APIs for 2 years."
    assert "strong_evidence" in alignment.reason


class _FakeSession:
    """Minimal unit-test persistence double without a hosted database."""

    def __init__(self) -> None:
        self.added: list[object] = []

    def scalar(self, statement: object):
        return None

    def add(self, instance: object) -> None:
        self.added.append(instance)

    def flush(self) -> None:
        for instance in self.added:
            if hasattr(instance, "id") and instance.id is None:
                instance.id = uuid4()

    def execute(self, statement: object) -> None:
        pass


def test_job_and_match_persistence_builds_existing_models() -> None:
    """Job requirements and screening evidence are persisted through existing model types."""
    db = _FakeSession()
    job = persist_job(db, JobCreateRequest(title="Python Engineer", description="Required Python."))  # type: ignore[arg-type]
    job.id = uuid4()
    requirement = job.requirements[0]
    resume = SimpleNamespace(id=uuid4(), candidate_id=uuid4())
    source_evidence = SimpleNamespace(id=uuid4(), resume_section_id=uuid4(), excerpt="Developed Python APIs.")
    alignment = align_requirements(
        [requirement], [_resume_skill("Python", SkillEvidenceStatus.STRONG_EVIDENCE, [source_evidence])]
    )[0]

    screening, evidence_by_requirement = persist_match_result(db, job, resume, [alignment])  # type: ignore[arg-type]

    assert screening.score == 100.0
    assert evidence_by_requirement[requirement.id][0].excerpt == "Developed Python APIs."
    assert evidence_by_requirement[requirement.id][0].source_reference == f"skill_evidence:{source_evidence.id}"
