export type SkillCategory =
  | "Languages"
  | "Frameworks"
  | "Databases"
  | "Cloud/Infrastructure"
  | "Data/ML"
  | "Tools";

export type EvidenceStatus =
  | "Strong evidence"
  | "Supported"
  | "Weak evidence"
  | "Needs verification"
  | "Not found";

export type EvidenceStrength = "High" | "Moderate" | "Low" | "Unverified" | "None";

export interface SourceAuditItem {
  present: boolean;
  label: string;
  detail: string;
  citation?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  status: EvidenceStatus;
  strength: EvidenceStrength;
  sources: {
    skillsSection: SourceAuditItem;
    project: SourceAuditItem;
    experience: SourceAuditItem;
    certification: SourceAuditItem;
    github: SourceAuditItem;
  };
  explanation: string;
  extractedClaim?: string;
  sampleCodeOrCommit?: {
    repo: string;
    commitHash?: string;
    snippet?: string;
    description?: string;
  };
}

export interface AnalysisReport {
  documentName: string;
  analyzedAt: string;
  status: string;
  totalDetected: number;
  supportedCount: number;
  needsVerificationCount: number;
  missingCount: number;
  skills: SkillItem[];
}
