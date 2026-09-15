"use client";

import * as React from "react";
import { getMockDeveloperProfile } from "@/lib/mock-profile";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileInsightsCard } from "@/components/profile/profile-insights-card";
import { LanguageDistributionCard } from "@/components/profile/language-distribution-card";
import { TechnicalBreadthMatrix } from "@/components/profile/technical-breadth-matrix";
import { RepositoriesProjectsList } from "@/components/profile/repositories-projects-list";
import { CodingProfilesCard } from "@/components/profile/coding-profiles-card";
import { DevelopmentActivityTimeline } from "@/components/profile/development-activity-timeline";

export default function ProfilePage() {
  const profile = React.useMemo(() => getMockDeveloperProfile(), []);

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
