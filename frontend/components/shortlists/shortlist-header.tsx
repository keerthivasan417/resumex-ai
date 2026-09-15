import React from "react";
import { JobRequisition } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface ShortlistHeaderProps {
  selectedJob: JobRequisition | null;
  shortlistCount: number;
  selectedCompareCount: number;
  onOpenCompare: () => void;
  onChangeRequisition: () => void;
}

export function ShortlistHeader({
  selectedJob,
  shortlistCount,
  selectedCompareCount,
  onOpenCompare,
  onChangeRequisition,
}: ShortlistHeaderProps) {
  const isCompareReady = selectedCompareCount >= 2 && selectedCompareCount <= 4;

  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Shortlists
          </h1>
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600">
            <span className="font-semibold text-zinc-900">
              {shortlistCount}
            </span>
            <span>candidates</span>
            <span className="text-zinc-300">•</span>
            <span className="font-medium text-amber-700">
              {selectedCompareCount} selected for comparison
            </span>
          </div>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          Review selected candidates and prepare the next evaluation step.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onChangeRequisition}
          className="gap-1.5 text-xs"
        >
          <Icons.briefcase className="h-3.5 w-3.5 text-zinc-500" />
          <span>Change Requisition</span>
        </Button>

        <Button
          onClick={onOpenCompare}
          disabled={!isCompareReady}
          size="sm"
          className="gap-1.5 text-xs shadow-xs"
        >
          <Icons.barChart className="h-3.5 w-3.5" />
          <span>
            {isCompareReady
              ? `Compare Candidates (${selectedCompareCount})`
              : "Compare Candidates (Select 2-4)"}
          </span>
        </Button>
      </div>
    </div>
  );
}
