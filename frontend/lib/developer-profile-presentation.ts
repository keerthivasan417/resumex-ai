import type { DeveloperIntelligenceResponse, DeveloperSignalResponse } from "@/lib/api/types";
import type { DeveloperProfile, ExternalProfileItem, LanguageDistributionItem, ProjectItem, TechnicalCategory } from "@/types/profile";

const LANGUAGE_COLORS = ["#0d9488", "#2563eb", "#4f46e5", "#d97706", "#db2777"];

export function presentDeveloperProfile(data: DeveloperIntelligenceResponse): DeveloperProfile {
  const sourceMetadata = data.source_metadata;
  const fetchedAt = sourceMetadata?.fetched_at ?? data.fetched_at;
  const githubProfile = data.profile;

  return {
    candidateName: githubProfile?.name ?? data.profile_name ?? githubProfile?.username ?? data.username ?? "Not provided",
    headline: "Not provided",
    location: "Not provided",
    experienceYears: "Not provided",
    summary: sourceMetadata
      ? `Source: ${sourceMetadata.source}. Fetched: ${formatTimestamp(sourceMetadata.fetched_at)}. Derived: ${formatTimestamp(sourceMetadata.derived_at)}.`
      : "Not provided",
    profileStrength: { rating: "Not provided", level: "Not provided", verifiedChannelsCount: 0, totalChannelsCount: 0, description: "Not provided" },
    insights: presentInsights(data.strengths, sourceMetadata?.source ?? data.source, fetchedAt),
    languageDistribution: presentLanguages(data.languages),
    technicalBreadth: presentStrengths(data.strengths),
    projects: presentRepositories(data),
    recentActivity: presentActivity(data.activity?.signals ?? []),
    codingProfiles: [],
    socialProfiles: presentSocialProfiles(githubProfile, data, fetchedAt),
  };
}

function presentInsights(strengths: DeveloperSignalResponse[], source: string | null, fetchedAt: string | null): string[] {
  const insights = strengths.map((strength) => {
    const count = numberDetail(strength, "repository_count");
    return `${strength.normalized_skill ?? strength.label}: reported by ${count ?? "Not provided"} public repositories.`;
  });
  if (source) insights.push(`Source metadata: ${source}${fetchedAt ? `; fetched ${formatTimestamp(fetchedAt)}.` : "."}`);
  return insights.length > 0 ? insights : ["Not provided by the developer-intelligence source."];
}

function presentLanguages(signals: DeveloperSignalResponse[]): LanguageDistributionItem[] {
  const languages = signals.filter((signal) => signal.signal_type === "github_language");
  const total = languages.reduce((sum, language) => sum + (numberDetail(language, "repository_count") ?? 0), 0);
  return languages.map((language, index) => {
    const repositories = numberDetail(language, "repository_count");
    return {
      name: language.normalized_skill ?? language.label,
      percentage: total > 0 && repositories !== null ? Math.round((repositories / total) * 100) : 0,
      color: LANGUAGE_COLORS[index % LANGUAGE_COLORS.length],
      linesOfCode: repositories === null ? "Not provided" : `${repositories} repositories`,
      primaryFocus: stringDetail(language, "reported_language") ?? "Not provided",
    };
  });
}

function presentStrengths(strengths: DeveloperSignalResponse[]): TechnicalCategory[] {
  if (strengths.length === 0) return [];
  return [{ name: "Developer strengths", skills: strengths.map((strength) => ({
    name: strength.normalized_skill ?? strength.label,
    evidenceCount: numberDetail(strength, "repository_count") ?? 0,
    status: "Supported" as const,
  })) }];
}

function presentRepositories(data: DeveloperIntelligenceResponse): ProjectItem[] {
  return data.repositories.map(({ repository, quality }) => ({
    id: repository.id,
    name: repository.label,
    description: stringDetail(repository, "description") ?? "Not provided",
    architectureScope: repositoryMetadata(repository, quality),
    technologies: [stringDetail(repository, "language") ?? "Not provided"],
    repoUrl: repository.source_url ?? "",
    relevance: "Source: GitHub public data",
    evidenceBadge: quality ? `Quality score: ${numberDetail(quality, "quality_score") ?? "Not provided"}` : "Not provided",
  }));
}

function repositoryMetadata(repository: DeveloperSignalResponse, quality: DeveloperSignalResponse | null): string {
  const values = [
    `Stars: ${numberDetail(repository, "stars") ?? "Not provided"}`,
    `Forks: ${numberDetail(repository, "forks") ?? "Not provided"}`,
    `Updated: ${formatTimestamp(stringDetail(repository, "updated_at"))}`,
  ];
  if (quality) values.push(`Recent activity: ${booleanDetail(quality, "recent_activity") ?? "Not provided"}`);
  return values.join(" · ");
}

function presentActivity(signals: DeveloperSignalResponse[]) {
  return signals.map((signal) => ({
    id: signal.id,
    type: "activity" as const,
    title: signal.label,
    repoOrContext: signal.source_url ?? "Not provided",
    timestamp: formatTimestamp(stringDetail(signal, "latest_repository_activity") ?? signal.observed_at),
    detail: `Public repositories: ${numberDetail(signal, "public_repository_count") ?? "Not provided"}; retrieved: ${numberDetail(signal, "retrieved_repository_count") ?? "Not provided"}; recent: ${numberDetail(signal, "recent_repository_count") ?? "Not provided"}.`,
  }));
}

function presentSocialProfiles(profile: DeveloperIntelligenceResponse["profile"], data: DeveloperIntelligenceResponse, fetchedAt: string | null): ExternalProfileItem[] {
  const profileUrl = profile?.profile_url ?? data.github_profile_url;
  const username = profile?.username ?? data.username;
  if (!profileUrl || !username) return [];
  return [{
    platform: "GitHub",
    handle: username,
    status: "connected",
    profileUrl,
    details: {
      solvedCount: profile?.public_repository_count,
      rank: data.source ?? "Not provided",
      lastActive: fetchedAt ? `Fetched ${formatTimestamp(fetchedAt)}` : "Not provided",
    },
  }];
}

function stringDetail(signal: DeveloperSignalResponse, key: string): string | null {
  const value = signal.details[key];
  return typeof value === "string" && value.trim() ? value : null;
}

function numberDetail(signal: DeveloperSignalResponse, key: string): number | null {
  const value = signal.details[key];
  return typeof value === "number" ? value : null;
}

function booleanDetail(signal: DeveloperSignalResponse, key: string): boolean | null {
  const value = signal.details[key];
  return typeof value === "boolean" ? value : null;
}

function formatTimestamp(value: string | null): string {
  if (!value) return "Not provided";
  const timestamp = new Date(value);
  return Number.isNaN(timestamp.getTime()) ? value : timestamp.toLocaleString();
}
