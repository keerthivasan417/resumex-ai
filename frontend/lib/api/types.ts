export interface ResumeSectionResponse {
  section_type: string;
  title: string | null;
  position: number;
  content: string;
}

export interface ResumeUploadResponse {
  id: string;
  candidate_id: string;
  file_name: string;
  mime_type: string;
  status: string;
  sections: ResumeSectionResponse[];
}

export interface SkillEvidenceResponse {
  section_type: string;
  line_number: number;
  excerpt: string;
  weight: number;
  reason: string;
  resume_section_id: string | null;
}

export interface ResumeSkillResponse {
  name: string;
  category: string | null;
  status: "strong_evidence" | "supported" | "weak_evidence" | "needs_verification" | "not_found";
  score: number;
  explanation: string;
  evidence: SkillEvidenceResponse[];
}

export interface ResumeSkillIntelligenceResponse {
  resume_id: string;
  skills: ResumeSkillResponse[];
}

export interface SemanticChunkResponse {
  vector_id: string;
  resume_section_id: string | null;
  chunk_text: string;
  similarity: number;
}

export interface RequirementMatchResponse {
  requirement_id: string;
  requirement: string;
  importance: "required" | "preferred";
  status: "matched" | "partially_supported" | "unsupported";
  supporting_skill: string | null;
  supporting_evidence: Array<{ id: string; source_skill_evidence_id: string | null; excerpt: string; evidence_type: string }>;
  semantic_similarity: number;
  semantic_chunks: SemanticChunkResponse[];
  evidence_status: string | null;
  reason: string;
}

export interface ScreeningWorkflowResponse {
  screening_result_id: string;
  job_id: string;
  resume_id: string;
  candidate_id: string;
  overall_score: number;
  deterministic_score: number;
  requirements: RequirementMatchResponse[];
  required_breakdown: { total: number; matched: number; partially_supported: number; unsupported: number };
  preferred_breakdown: { total: number; matched: number; partially_supported: number; unsupported: number };
}

export interface SkillGapResponse {
  job_id: string;
  resume_id: string;
  candidate_id: string;
  summary: { required_satisfied_count: number; required_partial_count: number; required_gap_count: number; preferred_gap_count: number; needs_verification_count: number; required_gaps: string[]; preferred_gaps: string[]; needs_verification: string[] };
  requirements: Array<{ requirement_id: string; requirement: string; importance: "required" | "preferred"; skill: string | null; status: "satisfied" | "partial" | "gap" | "needs_verification"; resume_evidence_status: string | null; reason: string; recommendation: LearningRecommendationResponse | null }>;
  recommendations: LearningRecommendationResponse[];
}

export interface LearningRecommendationResponse {
  skill: string;
  reason: string;
  learning_path: string[];
  resource_title: string;
  resource_url: string;
}

export interface RecruiterStateResponse { screening_result_id: string; recruiter_stage: "new" | "reviewing" | "shortlisted" | "on_hold" | "rejected"; shortlisted: boolean; recruiter_updated_at: string | null; }
export interface JobCandidateScreeningResponse extends RecruiterStateResponse { candidate_id: string; candidate_name: string; resume_id: string | null; overall_score: number | null; automated_status: string; }
export interface JobCandidateListResponse { job_id: string; candidates: JobCandidateScreeningResponse[]; }
export interface EvaluationReportResponse {
  candidate_id: string; resume_id: string; job_id: string; screening_result_id: string; overall_score: number; deterministic_score: number; automated_status: string;
  recruiter_state: RecruiterStateResponse;
  required_alignment: ReportRequirementResponse[]; preferred_alignment: ReportRequirementResponse[];
  semantic_matching: { persisted_semantic_evidence_count: number; requirements_with_semantic_evidence: number; note: string };
  github_context: { available: boolean; username: string | null; source: string | null; fetched_at: string | null; signals: Array<{ id: string; signal_type: string; label: string; normalized_skill: string | null; source_url: string | null; observed_at: string | null; details: Record<string, unknown> }> };
  skill_gap_summary: SkillGapResponse["summary"]; learning_recommendations: LearningRecommendationResponse[];
  final_assessment: { classification: string; reason_codes: string[]; explanation: string }; generated_at: string;
}
export interface ReportRequirementResponse { requirement_id: string; requirement: string; importance: "required" | "preferred"; status: string; evidence_status: string | null; reason: string; evidence_snippets: string[]; semantic_evidence_count: number; }
