"use client";

import * as React from "react";
import Link from "next/link";
import { TargetJob } from "@/types/matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface MatchHeaderProps {
  targetJob: TargetJob | null;
  candidateName: string;
  documentName: string;
  analyzedAt: string;
  availableJobs: Array<{ id: string; title: string; company: string; level: string }>;
  onSelectJob: (jobId: string | null) => void;
}

export function MatchHeader({
  targetJob,
  candidateName,
  documentName,
  analyzedAt,
  availableJobs,
  onSelectJob,
}: MatchHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <div className="space-y-4 pb-4 border-b border-zinc-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Role & Company Context */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {targetJob ? targetJob.title : "Target Role Alignment"}
            </h1>
            {targetJob && (
              <Badge variant="brand" className="text-[11px] font-mono">
                {targetJob.level}
              </Badge>
            )}
            <Badge variant="neutral" className="text-[11px] font-mono">
              ROLE BENCHMARK
            </Badge>
          </div>

          {targetJob ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 font-mono">
              <span className="font-medium text-zinc-800">
                {targetJob.company} • {targetJob.department}
              </span>
              <span>•</span>
              <span>{targetJob.location}</span>
              <span>•</span>
              <span className="text-zinc-600">
                Candidate: <strong>{candidateName}</strong> ({documentName})
              </span>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 font-mono">
              No target job requisition selected. Select a role to evaluate candidate alignment.
            </p>
          )}
        </div>

        {/* Right: Actions & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Change Role Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-xs"
            >
              <Icons.briefcase className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
              Change Target Role
              <Icons.chevronDown className="ml-1.5 h-3.5 w-3.5 text-zinc-400" />
            </Button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-72 rounded-md border border-zinc-200 bg-white shadow-lg z-30 p-1.5 text-xs"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold border-b border-zinc-100 mb-1">
                  Available Job Requisitions
                </div>
                {availableJobs.map((j) => (
                  <button
                    key={j.id}
                    type="button"
                    onClick={() => onSelectJob(j.id)}
                    className="w-full text-left p-2 rounded hover:bg-zinc-50 flex flex-col gap-0.5 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-zinc-900 truncate">
                      {j.title}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      {j.company} • {j.level}
                    </span>
                  </button>
                ))}
                <div className="pt-1 mt-1 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => onSelectJob(null)}
                    className="w-full text-left p-2 rounded text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 text-xs transition-colors cursor-pointer"
                  >
                    Clear Target Job (View Empty State)
                  </button>
                </div>
              </div>
            )}
          </div>

          <Link href="/app/resume">
            <Button variant="ghost" size="sm" className="text-xs">
              <Icons.fileText className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
              View Resume
            </Button>
          </Link>

          <Link href="/app/evidence">
            <Button variant="ghost" size="sm" className="text-xs">
              <Icons.checkCircle className="mr-1.5 h-3.5 w-3.5 text-brand-600" />
              View Evidence
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
