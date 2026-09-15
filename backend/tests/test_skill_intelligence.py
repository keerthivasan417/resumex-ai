"""Tests for deterministic skill normalization and evidence assessment."""

from dataclasses import dataclass
from uuid import UUID, uuid4

from app.models.core import Resume, ResumeSkill, Skill, SkillEvidenceStatus
from app.services.skill_catalog import normalize_skill
from app.services.skill_intelligence import analyze_resume_sections, persist_skill_intelligence, status_for_evidence


@dataclass
class _Section:
    id: UUID | None
    section_type: str
    content: str


def _analysis_by_name(sections: list[_Section], name: str):
    return next(analysis for analysis in analyze_resume_sections(sections) if analysis.skill.name == name)


def test_aliases_normalize_to_canonical_skills() -> None:
    """Catalog aliases resolve to the same canonical names."""
    assert normalize_skill("JS").name == "JavaScript"  # type: ignore[union-attr]
    assert normalize_skill("ReactJS").name == "React"  # type: ignore[union-attr]
    assert normalize_skill("PostgreSQL").name == "PostgreSQL"  # type: ignore[union-attr]
    assert normalize_skill("postgres").name == "PostgreSQL"  # type: ignore[union-attr]


def test_concrete_project_usage_is_strong_evidence() -> None:
    """Implementation language in a project is stronger than a list mention."""
    analysis = _analysis_by_name(
        [_Section(uuid4(), "projects", "Built a ReactJS dashboard and deployed it after 2 years of maintenance.")],
        "React",
    )

    assert analysis.status is SkillEvidenceStatus.STRONG_EVIDENCE
    assert analysis.score == 8
    assert "implementation" in analysis.evidence[0].reason
    assert "duration" in analysis.evidence[0].reason


def test_skill_list_mention_is_weak_evidence() -> None:
    """A standalone skills list never receives a strong status."""
    analysis = _analysis_by_name([_Section(uuid4(), "skills", "Python, FastAPI, PostgreSQL")], "Python")

    assert analysis.status is SkillEvidenceStatus.WEAK_EVIDENCE
    assert analysis.score == 1


def test_unsupported_skill_has_no_detection() -> None:
    """Terms outside the catalog do not create unsupported inferred skills."""
    analyses = analyze_resume_sections([_Section(uuid4(), "skills", "COBOL, Fortran")])

    assert analyses == []
    assert status_for_evidence([]) is SkillEvidenceStatus.NOT_FOUND


def test_duplicate_aliases_create_one_normalized_skill() -> None:
    """Multiple aliases in the same source line do not duplicate a canonical skill."""
    analyses = analyze_resume_sections([_Section(uuid4(), "skills", "JS, JavaScript, and EcmaScript")])

    assert [analysis.skill.name for analysis in analyses] == ["JavaScript"]
    assert len(analyses[0].evidence) == 1


class _FakeSession:
    """Minimal persistence double that does not require PostgreSQL."""

    def __init__(self) -> None:
        self.added: list[object] = []
        self.executed: list[object] = []

    def execute(self, statement: object) -> None:
        self.executed.append(statement)

    def scalar(self, statement: object) -> None:
        return None

    def add(self, instance: object) -> None:
        self.added.append(instance)

    def flush(self) -> None:
        for instance in self.added:
            if isinstance(instance, Skill) and instance.id is None:
                instance.id = uuid4()


def test_persistence_creates_normalized_skill_and_evidence_rows() -> None:
    """One analysis produces a canonical skill, resume-skill, and evidence aggregate."""
    resume = Resume(id=uuid4(), candidate_id=uuid4(), file_name="resume.pdf")
    analyses = analyze_resume_sections([_Section(uuid4(), "experience", "Developed Python services.")])
    db = _FakeSession()

    persisted = persist_skill_intelligence(db, resume, analyses)  # type: ignore[arg-type]

    assert len(persisted) == 1
    assert persisted[0].skill.name == "Python"
    assert len(persisted[0].evidence) == 1
    assert any(isinstance(item, ResumeSkill) for item in db.added)
