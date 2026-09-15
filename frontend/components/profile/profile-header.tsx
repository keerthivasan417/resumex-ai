"use client";

import * as React from "react";
import Link from "next/link";
import { DeveloperProfile } from "@/types/profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface ProfileHeaderProps {
  profile: DeveloperProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="space-y-4 pb-6 border-b border-zinc-200">
      {/* Top Banner & Name */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
              {profile.candidateName}
            </h1>
            <Badge variant="brand" className="text-xs font-mono">
              DEVELOPER INTELLIGENCE
            </Badge>
            <Badge variant="success" className="text-xs font-mono">
              {profile.profileStrength.rating}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-600">
            <span className="font-semibold text-zinc-900">{profile.headline}</span>
            <span>•</span>
            <span>{profile.location}</span>
            <span>•</span>
            <span>{profile.experienceYears}</span>
          </div>

          <p className="text-xs text-zinc-600 leading-relaxed font-normal pt-1">
            {profile.summary}
          </p>
        </div>

        {/* Evidence Cross-Navigation Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <Link href="/app/skills">
            <Button size="sm" variant="default" className="w-full text-xs justify-between">
              <span className="flex items-center gap-1.5">
                <Icons.cpu className="h-3.5 w-3.5" />
                View Skill Evidence
              </span>
              <Icons.chevronRight className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </Link>

          <Link href="/app/evidence">
            <Button size="sm" variant="outline" className="w-full text-xs justify-between">
              <span className="flex items-center gap-1.5">
                <Icons.checkCircle className="h-3.5 w-3.5 text-brand-600" />
                View Evidence Ledger
              </span>
              <Icons.chevronRight className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </Link>

          <Link href="/app/matches">
            <Button size="sm" variant="outline" className="w-full text-xs justify-between">
              <span className="flex items-center gap-1.5">
                <Icons.briefcase className="h-3.5 w-3.5 text-zinc-500" />
                View Job Alignment
              </span>
              <Icons.chevronRight className="h-3.5 w-3.5 opacity-60" />
            </Button>
          </Link>
        </div>
      </div>

      {/* External Profile Indicators */}
      <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider font-semibold mr-1">
          Connected Profiles:
        </span>
        {profile.socialProfiles.map((sp) => (
          <a
            key={sp.platform}
            href={sp.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                sp.status === "connected" ? "bg-emerald-500" : "bg-brand-500"
              }`}
            />
            <span className="font-medium font-mono text-xs">{sp.platform}</span>
            <span className="text-[11px] text-zinc-400 font-mono">({sp.handle})</span>
          </a>
        ))}

        {profile.codingProfiles
          .filter((cp) => cp.status !== "not_connected")
          .map((cp) => (
            <a
              key={cp.platform}
              href={cp.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  cp.status === "connected" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span className="font-medium font-mono text-xs">{cp.platform}</span>
              {cp.details?.rating && (
                <span className="text-[11px] text-zinc-500 font-mono">
                  {cp.details.rating}
                </span>
              )}
            </a>
          ))}
      </div>
    </div>
  );
}
