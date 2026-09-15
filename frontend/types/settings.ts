export type MatchEvaluationMode =
  | "Balanced"
  | "Skills-first"
  | "Evidence-first";

export type EvidenceSensitivity = "Strict" | "Standard" | "Relaxed";

export type WeightTier = "High" | "Medium" | "Low" | "Disabled";

export type TeamRole = "Admin" | "Recruiter" | "Reviewer";

export interface SkillVerificationBehavior {
  requireProjectEvidence: boolean;
  considerExperienceEvidence: boolean;
  considerCertificationEvidence: boolean;
  considerExternalProfileEvidence: boolean;
}

export interface MatchingWeights {
  skillRequirements: WeightTier;
  experience: WeightTier;
  projectRelevance: WeightTier;
  evidenceStrength: WeightTier;
  semanticRelevance: WeightTier;
}

export interface ExternalEvidenceSource {
  id: string;
  name: string;
  category: "Version Control" | "Professional" | "Competitive Coding";
  status: "Available" | "Not configured";
  enabled: boolean;
  connectionType: "Candidate-provided link" | "Not connected" | "Configure later";
  description: string;
}

export interface VerificationPolicy {
  minimumEvidenceSources: number; // 1, 2, or 3
  externalEvidenceConsidered: boolean;
  certificationsAsPrimary: boolean;
  projectEvidenceRequiredForTech: boolean;
  minimumConfidenceThreshold: number; // e.g. 75
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  accessLevel: string;
  lastActive: string;
}

export interface WorkspaceSettings {
  workspaceName: string;
  workspaceSlug: string;
  evaluationMode: MatchEvaluationMode;
  evidenceSensitivity: EvidenceSensitivity;
  minEvidenceThreshold: number;
  skillVerification: SkillVerificationBehavior;
  matchingWeights: MatchingWeights;
  externalSources: ExternalEvidenceSource[];
  verificationPolicy: VerificationPolicy;
  teamMembers: TeamMember[];
}
