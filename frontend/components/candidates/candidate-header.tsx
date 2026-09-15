import React from "react";
import Link from "next/link";
import { JobRequisition } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getJobStatusBadgeVariant } from "@/lib/mock-jobs";

interface CandidateHeaderProps {
  selectedJob: JobRequisition | null;
  totalCandidates: number;
  shortlistedCount: number;
  onChangeRequisition: () => void;
}

export function CandidateHeader({
  selectedJob,
  totalCandidates,
  shortlistedCount,
  onChangeRequisition,
}: CandidateHeaderProps) {
  return (
    <div className="space-y-4 border-b border-zinc-200 pb-5">
      {/* Top Title & Global Counter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Candidate Pool
            </h1>
            <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600">
              <span className="font-semibold text-zinc-900">
                {totalCandidates}
              </span>
              <span>candidates</span>
              <span className="text-zinc-300">•</span>
              <span className="font-medium text-brand-700">
                {shortlistedCount} shortlisted
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            Review, compare, and advance candidates against active requisitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onChangeRequisition}
            className="gap-1.5 text-xs shadow-xs"
          >
            <Icons.briefcase className="h-3.5 w-3.5 text-zinc-500" />
            <span>Change Requisition</span>
          </Button>
        </div>
      </div>

      {/* 2. Requisition Context Card */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-3.5 transition-colors">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          {selectedJob ? (
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Target Requisition:
                </span>
                <span className="text-sm font-semibold text-zinc-950">
                  {selectedJob.title}
                </span>
                <Badge variant={getJobStatusBadgeVariant(selectedJob.status)}>
                  {selectedJob.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-600">
                <span className="font-medium text-zinc-800">
                  {selectedJob.department}
                </span>
                <span className="text-zinc-300">•</span>
                <span>{selectedJob.level} Level</span>
                <span className="text-zinc-300">•</span>
                <span>
                  {selectedJob.location} ({selectedJob.workArrangement})
                </span>
                <span className="text-zinc-300">•</span>
                <span className="font-medium text-brand-700">
                  {selectedJob.requirements.length} evaluation requirements
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Target Requisition:
              </span>
              <p className="text-xs text-zinc-700 font-medium">
                Viewing candidates across all company requisitions. Select a specific role to benchmark claim alignment.
              </p>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {selectedJob && (
              <Link href="/app/jobs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs text-zinc-600 hover:text-zinc-900"
                >
                  <Icons.externalLink className="h-3.5 w-3.5" />
                  <span>View Job</span>
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onChangeRequisition}
              className="h-8 text-xs bg-white"
            >
              {selectedJob ? "Switch Role" : "Select Specific Job"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
