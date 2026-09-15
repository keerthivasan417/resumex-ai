const RESUME_ID_KEY = "resumex.resume_id";
const CANDIDATE_ID_KEY = "resumex.candidate_id";

export function getStoredResumeId(): string | null {
  return typeof window === "undefined" ? null : window.localStorage.getItem(RESUME_ID_KEY);
}

export function storeResumeContext(resumeId: string, candidateId: string): void {
  window.localStorage.setItem(RESUME_ID_KEY, resumeId);
  window.localStorage.setItem(CANDIDATE_ID_KEY, candidateId);
}

export function getStoredCandidateId(): string {
  return typeof window === "undefined" ? "" : window.localStorage.getItem(CANDIDATE_ID_KEY) ?? "";
}
