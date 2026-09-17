import type { JobResponse } from "@/lib/api/types";
import type { JobRequisition } from "@/types/job";

export function presentJob(job: JobResponse): JobRequisition {
  const status = job.status === "open" ? "Active" : job.status === "closed" ? "Closed" : "Draft";
  return { id: job.id, title: job.title, department: job.company_name || "Not provided", level: "Not provided", location: job.location || "Not provided", workArrangement: "Not provided", employmentType: "Not provided", status, description: job.description, responsibilities: [], minExperienceYears: 0, requirements: job.requirements.map((requirement) => ({ id: requirement.id, name: requirement.skill || requirement.description, priority: requirement.importance === "required" ? "Must have" : "Preferred", description: requirement.description })), candidateCount: 0, shortlistCount: 0, createdAt: "Not provided", updatedAt: "Not provided" };
}
