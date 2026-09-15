"""Presentation mapping for persisted evaluation reports."""

from collections import defaultdict

from app.api.skill_gap_response import build_skill_gap_response
from app.schemas.github import DeveloperSignalResponse
from app.schemas.recruiter import RecruiterStateResponse
from app.schemas.report import (
    EvaluationReportResponse, FinalAssessmentResponse, GitHubReportContextResponse,
    ReportRequirementResponse, SemanticMatchingSummaryResponse,
)
from app.services.evaluation_report import EvaluationReport


def build_evaluation_report_response(report: EvaluationReport) -> EvaluationReportResponse:
    """Render a persisted screening and derived supporting context without mutations."""
    evidence_by_requirement: dict[object, list[object]] = defaultdict(list)
    for evidence in report.screening.evidence:
        evidence_by_requirement[evidence.job_requirement_id].append(evidence)
    requirement_items = []
    for alignment in report.alignments:
        evidence = evidence_by_requirement[alignment.requirement.id]
        requirement_items.append(
            ReportRequirementResponse(
                requirement_id=alignment.requirement.id,
                requirement=alignment.requirement.description,
                importance=alignment.requirement.importance.value,
                status=alignment.status,
                evidence_status=alignment.supporting_skill.status.value if alignment.supporting_skill else None,
                reason=alignment.reason,
                evidence_snippets=[item.excerpt for item in evidence if item.evidence_type != "semantic_match"],
                semantic_evidence_count=sum(item.evidence_type == "semantic_match" for item in evidence),
            )
        )
    gap_response = build_skill_gap_response(report.skill_gap)
    snapshot = report.screening.candidate.github_snapshot
    github_signals = [
        DeveloperSignalResponse(
            id=signal.id,
            signal_type=signal.signal_type,
            label=signal.label,
            normalized_skill=signal.skill.name if signal.skill else None,
            source_url=signal.source_url,
            observed_at=signal.observed_at,
            details=signal.details,
        )
        for signal in snapshot.signals
    ] if snapshot else []
    semantic_counts = [item.semantic_evidence_count for item in requirement_items]
    return EvaluationReportResponse(
        candidate_id=report.resume.candidate_id,
        resume_id=report.resume.id,
        job_id=report.job.id,
        screening_result_id=report.screening.id,
        overall_score=float(report.screening.score or 0),
        deterministic_score=calculate_deterministic_score(report),
        automated_status=report.screening.status.value,
        recruiter_state=RecruiterStateResponse(
            screening_result_id=report.screening.id,
            recruiter_stage=report.screening.recruiter_stage.value,
            shortlisted=report.screening.shortlisted,
            recruiter_updated_at=report.screening.recruiter_updated_at,
        ),
        required_alignment=[item for item in requirement_items if item.importance == "required"],
        preferred_alignment=[item for item in requirement_items if item.importance == "preferred"],
        semantic_matching=SemanticMatchingSummaryResponse(
            persisted_semantic_evidence_count=sum(semantic_counts),
            requirements_with_semantic_evidence=sum(count > 0 for count in semantic_counts),
            note="Semantic similarities are not recalculated in reports; persisted semantic evidence is shown for traceability.",
        ),
        github_context=GitHubReportContextResponse(
            available=snapshot is not None,
            username=snapshot.username if snapshot else None,
            source=snapshot.source if snapshot else None,
            fetched_at=snapshot.fetched_at if snapshot else None,
            signals=github_signals,
        ),
        skill_gap_summary=gap_response.summary,
        learning_recommendations=gap_response.recommendations,
        final_assessment=FinalAssessmentResponse(
            classification=report.assessment.classification,
            reason_codes=list(report.assessment.reason_codes),
            explanation=report.assessment.explanation,
        ),
        generated_at=report.generated_at,
    )


def calculate_deterministic_score(report: EvaluationReport) -> float:
    """Keep the report's deterministic score aligned with the existing matcher."""
    from app.services.job_matching import calculate_match_score

    return calculate_match_score(report.alignments)
