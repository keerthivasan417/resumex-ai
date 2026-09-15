import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface CandidatesEmptyStateProps {
  type: "no-search-results" | "no-candidates-for-job" | "no-candidates-overall";
  onClearFilters?: () => void;
  onChangeRequisition?: () => void;
}

export function CandidatesEmptyState({
  type,
  onClearFilters,
  onChangeRequisition,
}: CandidatesEmptyStateProps) {
  if (type === "no-search-results") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
          <Icons.search className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">
          No matching candidates found
        </h3>
        <p className="mt-1 max-w-sm text-xs text-zinc-500">
          No candidates match your current search terms or filter criteria. Try adjusting your parameters.
        </p>
        {onClearFilters && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="gap-1.5 text-xs"
            >
              <Icons.refresh className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (type === "no-candidates-for-job") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
          <Icons.users className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">
          No candidates in this requisition pool
        </h3>
        <p className="mt-1 max-w-sm text-xs text-zinc-500">
          There are currently no candidate applications or evaluations linked to this target role.
        </p>
        <div className="mt-4 flex items-center gap-2">
          {onChangeRequisition && (
            <Button
              variant="outline"
              size="sm"
              onClick={onChangeRequisition}
              className="gap-1.5 text-xs"
            >
              <Icons.briefcase className="h-3.5 w-3.5" />
              <span>Switch Requisition</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
        <Icons.users className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900">
        No candidates in database
      </h3>
      <p className="mt-1 max-w-sm text-xs text-zinc-500">
        Candidates will appear here once submitted and verified against defined requisitions.
      </p>
    </div>
  );
}
