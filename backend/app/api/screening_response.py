"""Response presentation helpers shared by screening HTTP routes."""

from app.schemas.matching import JobMatchResponse, MatchEvidenceResponse, RequirementMatchResponse, SemanticChunkResponse
from app.schemas.screening import RequirementBreakdownResponse, ScreeningWorkflowResponse
from app.services.job_matching import final_requirement_decision
from app.services.screening_workflow import ScreeningWorkflowResult


def build_job_match_response(result: ScreeningWorkflowResult) -> JobMatchResponse:
    """Render a workflow result using the existing job-match response contract."""
    return JobMatchResponse(
        screening_result_id=result.screening_result.id,
        job_id=result.job.id,
        resume_id=result.resume.id,
        candidate_id=result.resume.candidate_id,
        overall_score=result.overall_score,
        requirements=_requirement_responses(result),
    )


def build_screening_workflow_response(result: ScreeningWorkflowResult) -> ScreeningWorkflowResponse:
    """Render the unified workflow response including importance breakdowns."""
    requirements = _requirement_responses(result)
    return ScreeningWorkflowResponse(
        screening_result_id=result.screening_result.id,
        job_id=result.job.id,
        resume_id=result.resume.id,
        candidate_id=result.resume.candidate_id,
        overall_score=result.overall_score,
        deterministic_score=result.deterministic_score,
        requirements=requirements,
        required_breakdown=_breakdown(requirements, "required"),
        preferred_breakdown=_breakdown(requirements, "preferred"),
    )


def _requirement_responses(result: ScreeningWorkflowResult) -> list[RequirementMatchResponse]:
    semantic_by_requirement = {match.requirement.id: match for match in result.semantic_matches}
    responses: list[RequirementMatchResponse] = []
    for alignment in result.alignments:
        semantic_match = semantic_by_requirement.get(alignment.requirement.id)
        responses.append(
            RequirementMatchResponse(
                requirement_id=alignment.requirement.id,
                requirement=alignment.requirement.description,
                importance=alignment.requirement.importance.value,
                status=final_requirement_decision(alignment, semantic_match),
                supporting_skill=alignment.supporting_skill.skill.name if alignment.supporting_skill else None,
                supporting_evidence=[
                    MatchEvidenceResponse(
                        id=evidence.id,
                        source_skill_evidence_id=_source_skill_evidence_id(evidence.source_reference),
                        excerpt=evidence.excerpt,
                        evidence_type=evidence.evidence_type,
                    )
                    for evidence in result.evidence_by_requirement[alignment.requirement.id]
                    if evidence.evidence_type != "semantic_match"
                ],
                semantic_similarity=semantic_match.similarity if semantic_match else 0.0,
                semantic_chunks=[
                    SemanticChunkResponse(
                        vector_id=chunk.vector.id,
                        resume_section_id=chunk.vector.source_section_id,
                        chunk_text=chunk.vector.chunk_text,
                        similarity=chunk.similarity,
                    )
                    for chunk in semantic_match.chunks
                ] if semantic_match else [],
                evidence_status=alignment.supporting_skill.status.value if alignment.supporting_skill else None,
                reason=_combined_reason(alignment.reason, semantic_match),
            )
        )
    return responses


def _breakdown(requirements: list[RequirementMatchResponse], importance: str) -> RequirementBreakdownResponse:
    items = [item for item in requirements if item.importance == importance]
    return RequirementBreakdownResponse(
        total=len(items),
        matched=sum(item.status == "matched" for item in items),
        partially_supported=sum(item.status == "partially_supported" for item in items),
        unsupported=sum(item.status == "unsupported" for item in items),
    )


def _source_skill_evidence_id(source_reference: str | None):
    if not source_reference or not source_reference.startswith("skill_evidence:"):
        return None
    from uuid import UUID

    return UUID(source_reference.removeprefix("skill_evidence:"))


def _combined_reason(deterministic_reason: str, semantic_match: object | None) -> str:
    if semantic_match is None:
        return f"{deterministic_reason} No indexed candidate chunk was retrieved."
    return f"{deterministic_reason} Top candidate chunk cosine similarity is {semantic_match.similarity:.2f}."
