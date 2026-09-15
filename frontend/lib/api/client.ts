import type { EvaluationReportResponse, JobCandidateListResponse, JobCandidateScreeningResponse, RecruiterStateResponse, ResumeSkillIntelligenceResponse, ResumeUploadResponse, ScreeningWorkflowResponse, SkillGapResponse } from "@/lib/api/types";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "/backend-api").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new ApiError("The ResumeX backend is unavailable. Start the API and try again.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null) as { detail?: string } | null;
    throw new ApiError(payload?.detail ?? `Backend request failed (${response.status}).`, response.status);
  }
  return response.json() as Promise<T>;
}

export function uploadResume(candidateId: string, file: File): Promise<ResumeUploadResponse> {
  const formData = new FormData();
  formData.append("candidate_id", candidateId);
  formData.append("file", file);
  return request<ResumeUploadResponse>("/resumes/upload", { method: "POST", body: formData });
}

export function getResumeSkills(resumeId: string): Promise<ResumeSkillIntelligenceResponse> {
  return request<ResumeSkillIntelligenceResponse>(`/resumes/${encodeURIComponent(resumeId)}/skills`);
}

export function runScreening(jobId: string, resumeId: string): Promise<ScreeningWorkflowResponse> {
  return request<ScreeningWorkflowResponse>(`/screenings/jobs/${encodeURIComponent(jobId)}/resumes/${encodeURIComponent(resumeId)}`, { method: "POST" });
}

export function getSkillGap(jobId: string, resumeId: string): Promise<SkillGapResponse> {
  return request<SkillGapResponse>(`/jobs/${encodeURIComponent(jobId)}/resumes/${encodeURIComponent(resumeId)}/skill-gap`);
}

export function getEvaluationReport(jobId: string, resumeId: string): Promise<EvaluationReportResponse> { return request(`/jobs/${encodeURIComponent(jobId)}/resumes/${encodeURIComponent(resumeId)}/report`); }
export function getJobCandidates(jobId: string): Promise<JobCandidateListResponse> { return request(`/jobs/${encodeURIComponent(jobId)}/candidates`); }
export function getCandidateScreening(jobId: string, candidateId: string): Promise<JobCandidateScreeningResponse> { return request(`/jobs/${encodeURIComponent(jobId)}/candidates/${encodeURIComponent(candidateId)}/screening`); }
export function updateRecruiterState(screeningId: string, state: { recruiter_stage?: RecruiterStateResponse["recruiter_stage"]; shortlisted?: boolean }): Promise<RecruiterStateResponse> { return request(`/screenings/${encodeURIComponent(screeningId)}/recruiter-state`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(state) }); }
