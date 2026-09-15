export type ExternalPlatformStatus = "connected" | "linked" | "not_connected";

export interface ExternalProfileItem {
  platform:
    | "GitHub"
    | "LinkedIn"
    | "LeetCode"
    | "Codeforces"
    | "CodeChef"
    | "HackerRank"
    | "AtCoder";
  handle: string;
  status: ExternalPlatformStatus;
  profileUrl: string;
  details?: {
    solvedCount?: number;
    rating?: number;
    rank?: string;
    topLanguages?: string[];
    lastActive?: string;
  };
}

export interface LanguageDistributionItem {
  name: string;
  percentage: number;
  color: string;
  linesOfCode: string;
  primaryFocus: string;
}

export interface ActivityTimelineItem {
  id: string;
  type: "commit" | "pr" | "repo_release" | "resume_update";
  title: string;
  repoOrContext: string;
  timestamp: string;
  detail: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  architectureScope: string;
  technologies: string[];
  repoUrl: string;
  relevance: string;
  evidenceBadge: string;
}

export interface TechnicalCategory {
  name: string;
  skills: Array<{
    name: string;
    evidenceCount: number;
    status: "Verified" | "Supported" | "Exploratory";
  }>;
}

export interface DeveloperProfile {
  candidateName: string;
  headline: string;
  location: string;
  experienceYears: string;
  summary: string;
  profileStrength: {
    rating: string;
    level: "High" | "Moderate" | "Developing";
    verifiedChannelsCount: number;
    totalChannelsCount: number;
    description: string;
  };
  insights: string[];
  languageDistribution: LanguageDistributionItem[];
  technicalBreadth: TechnicalCategory[];
  projects: ProjectItem[];
  recentActivity: ActivityTimelineItem[];
  codingProfiles: ExternalProfileItem[];
  socialProfiles: ExternalProfileItem[];
}
