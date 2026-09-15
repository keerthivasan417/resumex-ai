export type JobStatus = "Draft" | "Active" | "Paused" | "Closed";

export type JobLevel = "Junior" | "Mid" | "Senior" | "Staff" | "Lead" | "Principal";

export type WorkArrangement = "Remote" | "Hybrid" | "On-site";

export type EmploymentType = "Full-time" | "Contract" | "Part-time";

export type RequirementPriority = "Must have" | "Preferred" | "Nice to have";

export interface JobSkillRequirement {
  id: string;
  name: string;
  priority: RequirementPriority;
  description?: string;
}

export interface JobRequisition {
  id: string;
  title: string;
  department: string;
  level: JobLevel;
  location: string;
  workArrangement: WorkArrangement;
  employmentType: EmploymentType;
  status: JobStatus;
  description: string;
  responsibilities: string[];
  minExperienceYears: number;
  requirements: JobSkillRequirement[];
  candidateCount: number;
  shortlistCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobInput {
  title: string;
  department: string;
  level: JobLevel;
  location: string;
  workArrangement: WorkArrangement;
  employmentType: EmploymentType;
  description: string;
  responsibilitiesText: string;
  minExperienceYears: number;
  requirements: JobSkillRequirement[];
}
