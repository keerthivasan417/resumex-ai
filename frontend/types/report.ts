import { EvidenceStatus, EvidenceStrength } from "@/types/analysis";
import { RequirementAlignmentStatus, SkillGapTier } from "@/types/matching";
import { LanguageDistributionItem, ProjectItem, ExternalProfileItem } from "@/types/profile";

export interface ReportHeaderData {
  reportId: string;
  reportDate: string;
  evaluationStatus: string;
  candidateName: string;
  targetRole: string;
  targetCompany: string;
  documentName: string;
}

export interface ExecutiveSummaryData {
  overallCompatibility: string;
  compatibilityLevel: "Strong" | "Moderate" | "Developing";
  strongestAreas: string[];
  areasNeedingVerification: string[];
  majorSkillGaps: string[];
  verdictSummary: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
  honors?: string;
}

export interface ResumeExperience {
  role: string;
  company: string;
  period: string;
  highlights: string;
}

export interface ResumeProfileData {
  technicalFocus: string;
  education: ResumeEducation[];
  experience: ResumeExperience[];
  certifications: Array<{ name: string; status: string; issuer: string }>;
}

export interface SkillEvidenceReportItem {
  name: string;
  category: string;
  status: EvidenceStatus;
  strength: EvidenceStrength;
  sources: {
    skillsSection: boolean;
    project: boolean;
    experience: boolean;
    certification: boolean;
    github: boolean;
  };
  keyProof: string;
}

export interface JobAlignmentReportItem {
  requirement: string;
  priority: "Must have" | "Preferred" | "Nice to have";
  candidateCapability: string;
  status: RequirementAlignmentStatus;
  supportingEvidence: string;
  gapCallout?: string;
}

export interface SkillGapReportItem {
  skill: string;
  tier: SkillGapTier;
  status: string;
  reason: string;
  recommendation: string;
}

export interface FinalAssessmentData {
  strengths: string[];
  concerns: string[];
  verificationRecommendations: string[];
  developmentRecommendations: string[];
  hiringDecisionAdvice: string;
}

export interface CandidateEvaluationReport {
  header: ReportHeaderData;
  executiveSummary: ExecutiveSummaryData;
  resumeProfile: ResumeProfileData;
  skillsEvidence: SkillEvidenceReportItem[];
  jobAlignment: JobAlignmentReportItem[];
  skillGaps: SkillGapReportItem[];
  developerIntelligence: {
    languageDistribution: LanguageDistributionItem[];
    keyProjects: ProjectItem[];
    codingProfiles: ExternalProfileItem[];
    commitSummary: string;
  };
  evidenceNote: string;
  finalAssessment: FinalAssessmentData;
}
