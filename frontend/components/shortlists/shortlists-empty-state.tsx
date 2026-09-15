import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface ShortlistsEmptyStateProps {
  type: "no-shortlists" | "no-search-results" | "compare-hint";
  onClearFilters?: () => void;
  selectedJobId?: string | null;
}

export function ShortlistsEmptyState({
  type,
  onClearFilters,
  selectedJobId,
}: ShortlistsEmptyStateProps) {
  if (type === "no-search-results") {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
          <Icons.search className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900">
          No matching shortlisted candidates
        </h3>
        <p className="mt-1 max-w-sm text-xs text-zinc-500">
          No shortlisted candidates match your active search terms or filter criteria.
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

  if (type === "compare-hint") {
    return (
      <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-8 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 mb-2">
          <Icons.barChart className="h-5 w-5" />
        </div>
        <h4 className="text-xs font-semibold text-amber-950 uppercase tracking-wider">
          Comparison Mode
        </h4>
        <p className="text-xs text-amber-800 max-w-sm mx-auto mt-1">
          Select 2 to 4 candidates using the checkboxes in the shortlist table to compare them side-by-side.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-zinc-50/50 py-16 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3 border border-amber-100">
        <Icons.bookmark className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-zinc-950">
        No shortlisted candidates for this role
      </h3>
      <p className="mt-1 max-w-md text-xs text-zinc-500">
        Shortlist high-matching candidates from the Candidate Pool to run side-by-side comparisons and prepare the next interview steps.
      </p>
      <div className="mt-5 flex items-center gap-2">
        <Link
          href={
            selectedJobId
              ? `/app/candidates?jobId=${selectedJobId}`
              : "/app/candidates"
          }
        >
          <Button size="sm" className="gap-1.5 shadow-xs">
            <Icons.users className="h-4 w-4" />
            <span>Open Candidate Pool</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
