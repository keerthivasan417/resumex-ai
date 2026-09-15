import type { ResumeSkillResponse } from "@/lib/api/types";
import type { EvidenceStatus, EvidenceStrength, SkillCategory, SkillItem, SourceAuditItem } from "@/types/analysis";

function statusLabel(status: ResumeSkillResponse["status"]): EvidenceStatus {
  const labels: Record<ResumeSkillResponse["status"], EvidenceStatus> = {
    strong_evidence: "Strong evidence",
    supported: "Supported",
    weak_evidence: "Weak evidence",
    needs_verification: "Needs verification",
    not_found: "Not found",
  };
  return labels[status];
}

function categoryLabel(category: string | null): SkillCategory {
  const categories: Record<string, SkillCategory> = {
    language: "Languages",
    framework: "Frameworks",
    database: "Databases",
    cloud: "Cloud/Infrastructure",
    platform: "Cloud/Infrastructure",
    tool: "Tools",
  };
  return categories[category ?? ""] ?? "Tools";
}

function strengthFor(status: ResumeSkillResponse["status"]): EvidenceStrength {
  if (status === "strong_evidence") return "High";
  if (status === "supported") return "Moderate";
  if (status === "not_found") return "None";
  return "Low";
}

function source(sectionTypes: string[], label: string, evidence: ResumeSkillResponse["evidence"]): SourceAuditItem {
  const matching = evidence.filter((item) => sectionTypes.includes(item.section_type));
  const first = matching[0];
  return {
    present: matching.length > 0,
    label,
    detail: first ? `${first.reason}: ${first.excerpt}` : "No resume evidence found in this source.",
    citation: first ? `Resume line ${first.line_number}` : undefined,
  };
}

export function presentResumeSkills(skills: ResumeSkillResponse[]): SkillItem[] {
  return skills.map((skill) => ({
    id: skill.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name: skill.name,
    category: categoryLabel(skill.category),
    status: statusLabel(skill.status),
    strength: strengthFor(skill.status),
    sources: {
      skillsSection: source(["skills"], "Skills Section", skill.evidence),
      project: source(["projects"], "Project", skill.evidence),
      experience: source(["experience"], "Experience", skill.evidence),
      certification: source(["certifications", "education"], "Certification / Education", skill.evidence),
      github: {
        present: false,
        label: "GitHub",
        detail: "No GitHub evidence is included in this resume intelligence response.",
      },
    },
    explanation: skill.explanation,
    extractedClaim: skill.evidence[0]?.excerpt,
  }));
}
