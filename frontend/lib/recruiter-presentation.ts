import type { JobCandidateScreeningResponse } from "@/lib/api/types";
import type { Candidate, EvaluationStatus, EvidenceStrength, PipelineStage } from "@/types/candidate";

function pipelineStage(stage: JobCandidateScreeningResponse["recruiter_stage"]): PipelineStage {
  const stages: Record<JobCandidateScreeningResponse["recruiter_stage"], PipelineStage> = { new: "New", reviewing: "Technical Review", shortlisted: "Shortlisted", on_hold: "Screening", rejected: "Rejected" };
  return stages[stage];
}

function evaluation(score: number | null): EvaluationStatus {
  if (score === null) return "Needs review";
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs review";
  return "Weak";
}

export function presentRecruiterCandidate(item: JobCandidateScreeningResponse, jobId: string): Candidate {
  const score = item.overall_score ?? 0;
  const status = evaluation(item.overall_score);
  const evidence: EvidenceStrength = item.automated_status === "completed" ? "Moderate" : "Needs verification";
  return {
    id: item.candidate_id, name: item.candidate_name, email: "Not provided by recruiter API", currentRole: "Not provided by recruiter API", location: "Not provided by recruiter API", experienceYears: 0, experience: "Not provided", targetJobId: jobId,
    matchSummary: { score, scoreLabel: item.automated_status, strengthsCount: 0, flagsCount: 0, summaryNote: "Automated score is kept separate from recruiter stage." }, skillCoverage: status, evidenceStrength: evidence, projectRelevance: "Low", evaluationStatus: status, pipelineStage: pipelineStage(item.recruiter_stage), keySkills: [], verificationFlags: [], projects: [], resumeFile: { name: item.resume_id ? `Resume ${item.resume_id}` : "No resume attached", size: "Not provided", uploadedAt: "Not provided" }, profileLinks: {}, isShortlisted: item.shortlisted,
    decisionNotes: { strengths: [], concerns: [], verificationItems: [], recommendedNextStep: "Review the persisted screening result." }, appliedAt: "Not provided", lastActive: item.recruiter_updated_at ?? "Not provided",
  };
}

export function recruiterStageForPipeline(stage: PipelineStage): JobCandidateScreeningResponse["recruiter_stage"] {
  const stages: Record<PipelineStage, JobCandidateScreeningResponse["recruiter_stage"]> = { New: "new", Screening: "on_hold", "Technical Review": "reviewing", Interview: "reviewing", Shortlisted: "shortlisted", Rejected: "rejected" };
  return stages[stage];
}
