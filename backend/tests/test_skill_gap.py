"""Tests for deterministic skill-gap classifications and local recommendations."""

from uuid import uuid4

from app.api.skill_gap_response import build_skill_gap_response
from app.models.core import Job, JobRequirement, RequirementImportance, Resume, ResumeSkill, Skill, SkillEvidence, SkillEvidenceStatus
from app.services.skill_gap import GitHubSkillContext, SkillGapService


def _requirement(skill: Skill, importance: RequirementImportance) -> JobRequirement:
    return JobRequirement(id=uuid4(), description=skill.name, importance=importance, skill=skill)


def test_skill_gap_uses_resume_evidence_first_and_github_only_for_verification() -> None:
    python, javascript, react, docker = (Skill(name=name) for name in ("Python", "JavaScript", "React", "Docker"))
    required_python = _requirement(python, RequirementImportance.REQUIRED)
    required_react = _requirement(react, RequirementImportance.REQUIRED)
    preferred_javascript = _requirement(javascript, RequirementImportance.PREFERRED)
    preferred_docker = _requirement(docker, RequirementImportance.PREFERRED)
    job = Job(id=uuid4(), title="Engineer", company_name="ResumeX", requirements=[
        required_python, required_react, preferred_javascript, preferred_docker,
    ])
    strong_evidence = SkillEvidence(section_type="experience", line_number=1, excerpt="Built Python APIs.", weight=6, reason="implementation")
    resume = Resume(
        id=uuid4(), candidate_id=uuid4(), file_name="resume.pdf", status="ready",
        skill_intelligence=[
            ResumeSkill(skill=python, status=SkillEvidenceStatus.STRONG_EVIDENCE, score=6, explanation="Strong.", evidence=[strong_evidence]),
            ResumeSkill(skill=javascript, status=SkillEvidenceStatus.WEAK_EVIDENCE, score=1, explanation="Weak."),
        ],
    )
    github_context = [
        GitHubSkillContext(None, "github_strength", "React", "https://github.com/octocat", None, {"repository_count": 2}),
    ]

    result = SkillGapService().evaluate(job, resume, github_context)
    by_skill = {item.skill_name: item for item in result.items}

    assert by_skill["Python"].status == "satisfied"
    assert by_skill["JavaScript"].status == "partial"
    assert by_skill["React"].status == "needs_verification"
    assert by_skill["React"].github_context[0].source_url == "https://github.com/octocat"
    assert by_skill["Docker"].status == "gap"
    assert by_skill["Docker"].recommendation is not None
    assert result.summary.required_satisfied_count == 1
    assert result.summary.preferred_gap_count == 1
    assert result.summary.needs_verification == ("React",)


def test_skill_gap_response_exposes_recommendations_without_completion_state() -> None:
    docker = Skill(name="Docker")
    requirement = _requirement(docker, RequirementImportance.REQUIRED)
    job = Job(id=uuid4(), title="Platform Engineer", company_name="ResumeX", requirements=[requirement])
    resume = Resume(id=uuid4(), candidate_id=uuid4(), file_name="resume.pdf", status="ready", skill_intelligence=[])

    response = build_skill_gap_response(SkillGapService().evaluate(job, resume))

    assert response.requirements[0].status == "gap"
    assert response.recommendations[0].skill == "Docker"
    assert response.recommendations[0].resource_url.startswith("https://")
    assert "completed" not in response.recommendations[0].model_fields
