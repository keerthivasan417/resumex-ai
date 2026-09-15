import { WorkspaceSettings } from "@/types/settings";

export const defaultSettings: WorkspaceSettings = {
  workspaceName: "Acme Platform Engineering",
  workspaceSlug: "acme-eng",
  evaluationMode: "Evidence-first",
  evidenceSensitivity: "Standard",
  minEvidenceThreshold: 70,
  skillVerification: {
    requireProjectEvidence: true,
    considerExperienceEvidence: true,
    considerCertificationEvidence: false,
    considerExternalProfileEvidence: true,
  },
  matchingWeights: {
    skillRequirements: "High",
    experience: "Medium",
    projectRelevance: "High",
    evidenceStrength: "High",
    semanticRelevance: "Medium",
  },
  externalSources: [
    {
      id: "src-github",
      name: "GitHub",
      category: "Version Control",
      status: "Available",
      enabled: true,
      connectionType: "Candidate-provided link",
      description:
        "Inspect verified repositories, commit frequency, AST authorship, and language usage depth.",
    },
    {
      id: "src-linkedin",
      name: "LinkedIn",
      category: "Professional",
      status: "Available",
      enabled: true,
      connectionType: "Candidate-provided link",
      description:
        "Cross-reference company tenure, job titles, promotion history, and stated project descriptions.",
    },
    {
      id: "src-leetcode",
      name: "LeetCode",
      category: "Competitive Coding",
      status: "Not configured",
      enabled: false,
      connectionType: "Not connected",
      description:
        "Verify contest rating, solved algorithm difficulty distributions, and submission languages.",
    },
    {
      id: "src-codechef",
      name: "CodeChef",
      category: "Competitive Coding",
      status: "Not configured",
      enabled: false,
      connectionType: "Configure later",
      description:
        "Benchmark star ratings, division rankings, and competitive algorithm challenge submissions.",
    },
    {
      id: "src-codeforces",
      name: "Codeforces",
      category: "Competitive Coding",
      status: "Not configured",
      enabled: false,
      connectionType: "Configure later",
      description:
        "Import contest rating history, max tier, and competitive problem-solving consistency.",
    },
    {
      id: "src-hackerrank",
      name: "HackerRank",
      category: "Competitive Coding",
      status: "Not configured",
      enabled: false,
      connectionType: "Not connected",
      description:
        "Inspect verified skill badges, problem points, and domain assessment certificates.",
    },
    {
      id: "src-hackerearth",
      name: "HackerEarth",
      category: "Competitive Coding",
      status: "Not configured",
      enabled: false,
      connectionType: "Configure later",
      description:
        "Verify hackathon submissions, competitive rank, and developer assessment scores.",
    },
    {
      id: "src-atcoder",
      name: "AtCoder",
      category: "Competitive Coding",
      status: "Not configured",
      enabled: false,
      connectionType: "Not connected",
      description:
        "Track algorithm contest performance, rating color tier, and problem solution logs.",
    },
  ],
  verificationPolicy: {
    minimumEvidenceSources: 2,
    externalEvidenceConsidered: true,
    certificationsAsPrimary: false,
    projectEvidenceRequiredForTech: true,
    minimumConfidenceThreshold: 75,
  },
  teamMembers: [
    {
      id: "tm-1",
      name: "Sarah Connor",
      email: "sarah.c@acme.engineering",
      role: "Admin",
      accessLevel: "Full Access & Billing",
      lastActive: "Active now",
    },
    {
      id: "tm-2",
      name: "Maya Patel",
      email: "maya.p@acme.engineering",
      role: "Recruiter",
      accessLevel: "Recruiting & Pipeline Evaluation",
      lastActive: "1 hour ago",
    },
    {
      id: "tm-3",
      name: "David Zhang",
      email: "david.z@acme.engineering",
      role: "Recruiter",
      accessLevel: "Recruiting & Pipeline Evaluation",
      lastActive: "Yesterday",
    },
    {
      id: "tm-4",
      name: "Alex Chen",
      email: "alex.chen@acme.engineering",
      role: "Reviewer",
      accessLevel: "Read-Only Candidate Review",
      lastActive: "3 days ago",
    },
  ],
};
