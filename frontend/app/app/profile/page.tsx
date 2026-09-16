"use client";

import * as React from "react";
import { ApiError, getDeveloperIntelligence } from "@/lib/api/client";
import { presentDeveloperProfile } from "@/lib/developer-profile-presentation";
import { getStoredCandidateId } from "@/lib/resume-session";
import type { DeveloperProfile } from "@/types/profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInsightsCard } from "@/components/profile/profile-insights-card";
import { LanguageDistributionCard } from "@/components/profile/language-distribution-card";
import { TechnicalBreadthMatrix } from "@/components/profile/technical-breadth-matrix";
import { RepositoriesProjectsList } from "@/components/profile/repositories-projects-list";
import { CodingProfilesCard } from "@/components/profile/coding-profiles-card";
import { DevelopmentActivityTimeline } from "@/components/profile/development-activity-timeline";

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<DeveloperProfile | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    const candidateId = getStoredCandidateId();
    if (!candidateId) {
      setMessage("No resume-session candidate ID is available. Upload a resume before viewing developer intelligence.");
      return;
    }

    let current = true;
    getDeveloperIntelligence(candidateId)
      .then((response) => {
        if (!current) return;
        if (!response.profile) {
          setMessage("No GitHub data is available for this candidate.");
          return;
        }
        setProfile(presentDeveloperProfile(response));
      })
      .catch((error: unknown) => {
        if (!current) return;
        setMessage(error instanceof ApiError ? error.message : "Could not load developer intelligence.");
      });
    return () => { current = false; };
  }, []);

  if (message) {
    return <ProfileState message={message} />;
  }

  if (!profile) {
    return <ProfileState message="Loading developer intelligence..." />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Header with Identity, Summary, and Cross-Navigation */}
      <ProfileHeader profile={profile} />

      {/* 2. Profile Insights Synthesis */}
      <ProfileInsightsCard insights={profile.insights} />

      {/* 3. Language Distribution Visualization */}
      <LanguageDistributionCard distribution={profile.languageDistribution} />

      {/* 4. Technical Breadth & Verification Fingerprint */}
      <TechnicalBreadthMatrix categories={profile.technicalBreadth} />

      {/* 5. Verified Repositories & Projects */}
      <RepositoriesProjectsList projects={profile.projects} />

      {/* 6. Competitive & Algorithmic Coding Platforms */}
      <CodingProfilesCard profiles={profile.codingProfiles} />

      {/* 7. Development Activity & Cadence Timeline */}
      <DevelopmentActivityTimeline activities={profile.recentActivity} />
    </div>
  );
}

function ProfileState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">
      {message}
    </div>
  );
}
