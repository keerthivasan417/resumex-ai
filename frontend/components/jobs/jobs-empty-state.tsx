import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface JobsEmptyStateProps {
  isFiltered: boolean;
  onClearFilters?: () => void;
  onCreateRequisition: () => void;
}

export function JobsEmptyState({
  isFiltered,
  onClearFilters,
  onCreateRequisition,
}: JobsEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
          <Icons.filter className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">
          No matching requisitions found
        </h3>
        <p className="mt-1 max-w-sm text-xs text-zinc-500">
          No job requisitions match your active search terms or filter criteria. Try adjusting or clearing your filters.
        </p>
        <div className="mt-4 flex items-center gap-2">
          {onClearFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="gap-1.5 text-xs"
            >
              <Icons.refresh className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </Button>
          )}
          <Button
            size="sm"
            onClick={onCreateRequisition}
            className="gap-1.5 text-xs"
          >
            <Icons.plus className="h-3.5 w-3.5" />
            <span>Create New Requisition</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600 mb-3 border border-brand-100">
        <Icons.briefcase className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900">
        No active job requisitions
      </h3>
      <p className="mt-1 max-w-md text-xs text-zinc-500">
        Define target roles, seniority criteria, and verified skill expectations to benchmark candidates and run evidence-backed evaluations.
      </p>
      <div className="mt-5">
        <Button
          size="sm"
          onClick={onCreateRequisition}
          className="gap-1.5 shadow-xs"
        >
          <Icons.plus className="h-4 w-4" />
          <span>Create First Requisition</span>
        </Button>
      </div>
    </div>
  );
}
