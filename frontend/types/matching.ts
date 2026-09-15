export type RequirementAlignmentStatus =
  | "Matched"
  | "Supported"
  | "Partial"
  | "Needs verification"
  | "Missing";

export type SkillGapTier = "Strong match" | "Needs strengthening" | "Missing";

export interface CandidateEvidenceSources {
  skillsSection: boolean;
  project: boolean;
  experience: boolean;
  certification: boolean;
  github?: boolean;
}

export interface JobRequirement {
  id: string;
  name: string;
  category: string;
  priority: "Must have" | "Preferred" | "Nice to have";
  jobDescriptionSnippet: string;
  status: RequirementAlignmentStatus;
  candidateSkillId?: string;
  candidateSkillName?: string;
  evidence: CandidateEvidenceSources;
  relatedProjects?: string[];
  explanation: string;
  gapTier: SkillGapTier;
  gapReason: string;
  futureRecommendation: string;
}

export interface TargetJob {
  id: string;
  title: string;
  company: string;
  department: string;
  level: string;
  location: string;
  summary: {
    overallCompatibility: string;
    skillCoverage: string;
    experienceAlignment: string;
    projectRelevance: string;
    evidenceStrength: string;
    totalRequirements: number;
    matchedCount: number;
    supportedCount: number;
    partialCount: number;
    needsVerificationCount: number;
    missingCount: number;
  };
  requirements: JobRequirement[];
}

export interface MatchingReport {
  targetJob: TargetJob | null;
  candidateName: string;
  documentName: string;
  analyzedAt: string;
  availableJobs: Array<{ id: string; title: string; company: string; level: string }>;
}
