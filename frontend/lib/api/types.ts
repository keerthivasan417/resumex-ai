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
