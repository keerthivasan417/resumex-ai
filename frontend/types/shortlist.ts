import {
  Candidate,
  PipelineStage,
  EvaluationStatus,
  EvidenceStrength,
  ProjectRelevance,
} from "@/types/candidate";
import { JobRequisition } from "@/types/job";

export interface ShortlistEntry {
  id: string;
  candidateId: string;
  targetJobId: string;
  candidate: Candidate;
  targetJob: JobRequisition;
  matchScore: number;
  skillCoverage: EvaluationStatus;
  evidenceStrength: EvidenceStrength;
  projectRelevance: ProjectRelevance;
  evaluationStatus: EvaluationStatus;
  pipelineStage: PipelineStage;
  strengths: string[];
  concerns: string[];
  verificationTopics: string[];
  recruiterNotes: string;
  shortlistedAt: string;
}

export interface SkillComparisonRow {
  skillName: string;
  priority: "Must have" | "Preferred" | "Nice to have";
  candidateStatuses: Record<string, "Matched" | "Supported" | "Needs verification" | "Missing">;
}
