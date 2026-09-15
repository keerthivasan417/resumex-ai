export type PipelineStage =
  | "New"
  | "Screening"
  | "Technical Review"
  | "Interview"
  | "Shortlisted"
  | "Rejected";

export type EvaluationStatus = "Strong" | "Good" | "Needs review" | "Weak";

export type EvidenceStrength =
  | "Strong"
  | "Moderate"
  | "Weak"
  | "Needs verification";

export type ProjectRelevance = "High" | "Moderate" | "Low";

export interface CandidateSkill {
  name: string;
  status: "Matched" | "Supported" | "Needs verification" | "Missing";
  category?: string;
  evidenceSnippet?: string;
}

export interface VerificationFlag {
  id: string;
  skill: string;
  status: "strong" | "supported" | "warning" | "missing";
  label: string;
  note: string;
}

export interface CandidateProject {
  id: string;
  title: string;
  role: string;
  description: string;
  relevance: ProjectRelevance;
  techStack: string[];
  metrics?: string;
}

export interface CandidateMatchSummary {
  score: number; // 0 to 100
  scoreLabel: string;
  strengthsCount: number;
  flagsCount: number;
  summaryNote: string;
}

export interface CandidateResumeFile {
  name: string;
  size: string;
  uploadedAt: string;
}

export interface CandidateProfileLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface CandidateDecisionNotes {
  strengths: string[];
  concerns: string[];
  verificationItems: string[];
  recommendedNextStep: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currentRole: string;
  location: string;
  experienceYears: number;
  experience: string;
  targetJobId: string;
  matchSummary: CandidateMatchSummary;
  skillCoverage: EvaluationStatus;
  evidenceStrength: EvidenceStrength;
  projectRelevance: ProjectRelevance;
  evaluationStatus: EvaluationStatus;
  pipelineStage: PipelineStage;
  keySkills: CandidateSkill[];
  verificationFlags: VerificationFlag[];
  projects: CandidateProject[];
  resumeFile: CandidateResumeFile;
  profileLinks: CandidateProfileLinks;
  isShortlisted: boolean;
  decisionNotes: CandidateDecisionNotes;
  appliedAt: string;
  lastActive: string;
}
