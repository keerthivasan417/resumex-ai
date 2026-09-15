"""Job creation and deterministic resume matching endpoints."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.job import JobCreateRequest, JobCreateResponse, JobRequirementResponse
from app.schemas.matching import JobMatchResponse, MatchEvidenceResponse, RequirementMatchResponse, SemanticChunkResponse
from app.services.job_intelligence import persist_job
from app.services.job_matching import (
    align_requirements,
    calculate_combined_match_score,
    final_requirement_decision,
    load_job_for_matching,
    load_resume_for_matching,
    persist_match_result,
)
from app.services.semantic_indexing import SemanticIndexService
from app.services.semantic_matching import SemanticMatchingService
from app.services.skill_intelligence import analyze_resume_sections, persist_skill_intelligence


router = APIRouter(tags=["jobs"])


@router.post("/jobs", response_model=JobCreateResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    request: JobCreateRequest,
    db: Annotated[Session, Depends(get_db)],
) -> JobCreateResponse:
    """Persist a job and deterministic catalog-backed requirements."""
    job = persist_job(db, request)
    db.commit()
    db.refresh(job)
    return JobCreateResponse(
        id=job.id,
        title=job.title,
        description=job.description or "",
        requirements=[
            JobRequirementResponse(
                id=requirement.id,
                description=requirement.description,
                importance=requirement.importance.value,
                skill=requirement.skill.name if requirement.skill else None,
            )
            for requirement in job.requirements
        ],
    )


@router.post("/jobs/{job_id}/resumes/{resume_id}/match", response_model=JobMatchResponse)
def match_resume_to_job(
    job_id: UUID,
    resume_id: UUID,
    db: Annotated[Session, Depends(get_db)],
) -> JobMatchResponse:
    """Create or replace an explainable deterministic match result."""
    job = load_job_for_matching(db, job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    resume = load_resume_for_matching(db, resume_id)
    if resume is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")

    if not resume.skill_intelligence:
        resume_with_sections = db.get(type(resume), resume.id)
        if resume_with_sections is not None:
            persist_skill_intelligence(db, resume_with_sections, analyze_resume_sections(resume_with_sections.sections))
            db.flush()
            resume = load_resume_for_matching(db, resume_id)
            if resume is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")

    index_service = SemanticIndexService()
    index_service.index_resume(db, resume)
    index_service.index_job(db, job)
    db.flush()

    alignments = align_requirements(job.requirements, resume.skill_intelligence)
    semantic_matches = SemanticMatchingService().match_requirements(db, job.requirements, resume)
    semantic_by_requirement = {match.requirement.id: match for match in semantic_matches}
    screening, evidence_by_requirement = persist_match_result(db, job, resume, alignments, semantic_matches)
    db.commit()

    return JobMatchResponse(
        screening_result_id=screening.id,
        job_id=job.id,
        resume_id=resume.id,
        candidate_id=resume.candidate_id,
        overall_score=calculate_combined_match_score(alignments, semantic_matches),
        requirements=[
            RequirementMatchResponse(
                requirement_id=alignment.requirement.id,
                requirement=alignment.requirement.description,
                importance=alignment.requirement.importance.value,
                status=final_requirement_decision(alignment, semantic_by_requirement.get(alignment.requirement.id)),
                supporting_skill=alignment.supporting_skill.skill.name if alignment.supporting_skill else None,
                supporting_evidence=[
                    MatchEvidenceResponse(
                        id=evidence.id,
                        source_skill_evidence_id=_source_skill_evidence_id(evidence.source_reference),
                        excerpt=evidence.excerpt,
                        evidence_type=evidence.evidence_type,
                    )
                    for evidence in evidence_by_requirement[alignment.requirement.id]
                    if evidence.evidence_type != "semantic_match"
                ],
                semantic_similarity=semantic_by_requirement.get(alignment.requirement.id).similarity
                if semantic_by_requirement.get(alignment.requirement.id) else 0.0,
                semantic_chunks=[
                    SemanticChunkResponse(
                        vector_id=chunk.vector.id,
                        resume_section_id=chunk.vector.source_section_id,
                        chunk_text=chunk.vector.chunk_text,
                        similarity=chunk.similarity,
                    )
                    for chunk in (
                        semantic_by_requirement[alignment.requirement.id].chunks
                        if alignment.requirement.id in semantic_by_requirement
                        else ()
                    )
                ],
                evidence_status=alignment.supporting_skill.status.value if alignment.supporting_skill else None,
                reason=_combined_reason(alignment.reason, semantic_by_requirement.get(alignment.requirement.id)),
            )
            for alignment in alignments
        ],
    )


def _source_skill_evidence_id(source_reference: str | None) -> UUID | None:
    if not source_reference or not source_reference.startswith("skill_evidence:"):
        return None
    return UUID(source_reference.removeprefix("skill_evidence:"))


def _combined_reason(deterministic_reason: str, semantic_match: object | None) -> str:
    if semantic_match is None:
        return f"{deterministic_reason} No indexed candidate chunk was retrieved."
    return f"{deterministic_reason} Top candidate chunk cosine similarity is {semantic_match.similarity:.2f}."
