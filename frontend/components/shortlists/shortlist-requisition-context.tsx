import React from "react";
import Link from "next/link";
import { JobRequisition } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getJobStatusBadgeVariant } from "@/lib/mock-jobs";

interface ShortlistRequisitionContextProps {
  selectedJob: JobRequisition | null;
  onChangeRequisition: () => void;
}

export function ShortlistRequisitionContext({
  selectedJob,
  onChangeRequisition,
}: ShortlistRequisitionContextProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-3.5 transition-colors">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {selectedJob ? (
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Evaluating Candidates For:
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
                {selectedJob.requirements.length} benchmark requirements
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Target Requisition:
            </span>
            <p className="text-xs text-zinc-700 font-medium">
              Viewing shortlisted candidates across all open company requisitions. Select a role to compare against specific criteria.
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
            {selectedJob ? "Switch Role" : "Select Job"}
          </Button>
        </div>
      </div>
    </div>
  );
}
