"""Presentation mapping for deterministic skill-gap results."""

from app.schemas.skill_gap import (
    GitHubSkillContextResponse,
    LearningRecommendationResponse,
    SkillGapEvidenceResponse,
    SkillGapItemResponse,
    SkillGapResponse,
    SkillGapSummaryResponse,
)
from app.services.skill_gap import SkillGapItem, SkillGapResult


def build_skill_gap_response(result: SkillGapResult) -> SkillGapResponse:
    """Map domain objects to one explicit, read-only API response."""
    items = [_item_response(item) for item in result.items]
    recommendations = [item.recommendation for item in result.items if item.recommendation is not None]
    return SkillGapResponse(
        job_id=result.job.id,
        resume_id=result.resume.id,
        candidate_id=result.resume.candidate_id,
        summary=SkillGapSummaryResponse(
            required_satisfied_count=result.summary.required_satisfied_count,
            required_partial_count=result.summary.required_partial_count,
            required_gap_count=result.summary.required_gap_count,
            preferred_gap_count=result.summary.preferred_gap_count,
            needs_verification_count=result.summary.needs_verification_count,
            required_gaps=list(result.summary.required_gaps),
            preferred_gaps=list(result.summary.preferred_gaps),
            needs_verification=list(result.summary.needs_verification),
        ),
        requirements=items,
        recommendations=[
            LearningRecommendationResponse(
                skill=resource.skill,
                reason=f"No stored resume evidence satisfies the {resource.skill} requirement.",
                learning_path=list(resource.learning_path),
                resource_title=resource.resource_title,
                resource_url=resource.resource_url,
            )
            for resource in recommendations
        ],
    )


def _item_response(item: SkillGapItem) -> SkillGapItemResponse:
    recommendation = item.recommendation
    return SkillGapItemResponse(
        requirement_id=item.requirement.id,
        requirement=item.requirement.description,
        importance=item.requirement.importance.value,
        skill=item.skill_name,
        status=item.status,
        resume_evidence_status=item.resume_evidence_status.value if item.resume_evidence_status else None,
        supporting_resume_evidence=[
            SkillGapEvidenceResponse(
                id=evidence.id,
                section_type=evidence.section_type,
                excerpt=evidence.excerpt,
                reason=evidence.reason,
            )
            for evidence in item.evidence
        ],
        github_context=[
            GitHubSkillContextResponse(
                signal_id=context.signal_id,
                signal_type=context.signal_type,
                label=context.label,
                source_url=context.source_url,
                observed_at=context.observed_at,
                details=context.details,
            )
            for context in item.github_context
        ],
        reason=item.reason,
        recommendation=(
            LearningRecommendationResponse(
                skill=recommendation.skill,
                reason=item.reason,
                learning_path=list(recommendation.learning_path),
                resource_title=recommendation.resource_title,
                resource_url=recommendation.resource_url,
            )
            if recommendation
            else None
        ),
    )
