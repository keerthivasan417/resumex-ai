import type { ScreeningWorkflowResponse, SkillGapResponse } from "@/lib/api/types";
import type { JobRequirement, MatchingReport, RequirementAlignmentStatus, TargetJob } from "@/types/matching";

function alignmentStatus(status: string): RequirementAlignmentStatus {
  if (status === "matched") return "Matched";
  if (status === "partially_supported") return "Partial";
  return "Missing";
}

export function presentMatchingReport(screening: ScreeningWorkflowResponse, gaps: SkillGapResponse, context?: { candidateName?: string | null; documentName?: string | null; jobTitle?: string | null; companyName?: string | null; location?: string | null }): MatchingReport {
  const gapByRequirement = new Map(gaps.requirements.map((gap) => [gap.requirement_id, gap]));
  const requirements: JobRequirement[] = screening.requirements.map((requirement) => {
    const gap = gapByRequirement.get(requirement.requirement_id);
    const evidence = requirement.supporting_evidence;
    const recommendation = gap?.recommendation;
    return {
      id: requirement.requirement_id,
      name: requirement.supporting_skill ?? gap?.skill ?? requirement.requirement,
      category: "Backend requirement",
      priority: requirement.importance === "required" ? "Must have" : "Preferred",
      jobDescriptionSnippet: requirement.requirement,
      status: alignmentStatus(requirement.status),
      candidateSkillId: requirement.supporting_skill?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      candidateSkillName: requirement.supporting_skill ?? undefined,
      evidence: { skillsSection: evidence.length > 0, project: false, experience: false, certification: false },
      explanation: `${requirement.reason} ${requirement.semantic_chunks.length ? `Top semantic similarity: ${(requirement.semantic_similarity * 100).toFixed(0)}%.` : "No semantic chunk was returned."}`,
      gapTier: gap?.status === "satisfied" ? "Strong match" : gap?.status === "gap" ? "Missing" : "Needs strengthening",
      gapReason: gap?.reason ?? requirement.reason,
      futureRecommendation: recommendation ? `${recommendation.resource_title}: ${recommendation.learning_path.join(", ")}` : "No learning recommendation is available for this requirement.",
    };
  });
  const matchedCount = screening.requirements.filter((item) => item.status === "matched").length;
  const partialCount = screening.requirements.filter((item) => item.status === "partially_supported").length;
  const targetJob: TargetJob = {
    id: screening.job_id,
    title: context?.jobTitle || "Not provided",
    company: context?.companyName || "Not provided",
    department: "Not provided",
    level: "Not provided",
    location: context?.location || "Not provided",
    summary: {
      overallCompatibility: `${screening.overall_score.toFixed(1)}%`,
      skillCoverage: `${matchedCount} matched / ${screening.requirements.length} requirements`,
      experienceAlignment: `${partialCount} partially supported`,
      projectRelevance: `${screening.requirements.filter((item) => item.semantic_chunks.length > 0).length} semantic retrievals`,
      evidenceStrength: `${screening.deterministic_score.toFixed(1)}% deterministic`,
      totalRequirements: screening.requirements.length,
      matchedCount,
      supportedCount: matchedCount,
      partialCount,
      needsVerificationCount: gaps.summary.needs_verification_count,
      missingCount: gaps.summary.required_gap_count + gaps.summary.preferred_gap_count,
    },
    requirements,
  };
  return { targetJob, candidateName: context?.candidateName || "Not provided", documentName: context?.documentName || "Not provided", analyzedAt: "Not provided", availableJobs: [] };
}
