"""Read-only endpoint for deterministic resume skill intelligence."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.skill_intelligence import (
    ResumeSkillIntelligenceResponse,
    ResumeSkillResponse,
    SkillEvidenceResponse,
)
from app.services.skill_intelligence import (
    analyze_resume_sections,
    load_resume_skill_intelligence,
    persist_skill_intelligence,
)


router = APIRouter(tags=["skills"])


@router.get("/resumes/{resume_id}/skills", response_model=ResumeSkillIntelligenceResponse)
def get_resume_skills(
    resume_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> ResumeSkillIntelligenceResponse:
    """Return persisted skill evidence, generating the deterministic first pass when absent."""
    resume = load_resume_skill_intelligence(db, resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")

    if not resume.skill_intelligence:
        persist_skill_intelligence(db, resume, analyze_resume_sections(resume.sections))
        db.commit()
        resume = load_resume_skill_intelligence(db, resume_id)
        if resume is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")

    return ResumeSkillIntelligenceResponse(
        resume_id=resume.id,
        skills=[
            ResumeSkillResponse(
                name=resume_skill.skill.name,
                category=resume_skill.skill.category,
                status=resume_skill.status.value,
                score=resume_skill.score,
                explanation=resume_skill.explanation,
                evidence=[
                    SkillEvidenceResponse(
                        section_type=evidence.section_type,
                        line_number=evidence.line_number,
                        excerpt=evidence.excerpt,
                        weight=evidence.weight,
                        reason=evidence.reason,
                        resume_section_id=evidence.resume_section_id,
                    )
                    for evidence in resume_skill.evidence
                ],
            )
            for resume_skill in sorted(resume.skill_intelligence, key=lambda item: item.skill.name)
        ],
    )
