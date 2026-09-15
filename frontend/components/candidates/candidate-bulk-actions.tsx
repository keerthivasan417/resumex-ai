import React from "react";
import { PipelineStage } from "@/types/candidate";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface CandidateBulkActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkStageChange: (stage: PipelineStage) => void;
  onBulkShortlist: (shortlist: boolean) => void;
}

const BULK_STAGES: PipelineStage[] = [
  "Screening",
  "Technical Review",
  "Interview",
  "Shortlisted",
  "Rejected",
];

export function CandidateBulkActions({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkStageChange,
  onBulkShortlist,
}: CandidateBulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-brand-200 bg-brand-50/70 p-2.5 text-xs text-brand-950 animate-in fade-in duration-150">
      <div className="flex items-center gap-2.5">
        <span className="font-semibold text-brand-900">
          {selectedCount} of {totalCount} candidates selected
        </span>

        <button
          onClick={onClearSelection}
          className="text-brand-700 hover:text-brand-950 underline underline-offset-2 text-[11px]"
        >
          Clear
        </button>

        {selectedCount < totalCount && (
          <>
            <span className="text-brand-300">•</span>
            <button
              onClick={onSelectAll}
              className="text-brand-700 hover:text-brand-950 underline underline-offset-2 text-[11px]"
            >
              Select all visible ({totalCount})
            </button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Bulk Stage Mover */}
        <div className="relative">
          <select
            defaultValue=""
            onChange={(e) => {
              if (e.target.value) {
                onBulkStageChange(e.target.value as PipelineStage);
                e.target.value = "";
              }
            }}
            className="h-8 appearance-none rounded-md border border-brand-300 bg-white pl-2.5 pr-7 text-xs font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50 focus:border-brand-500 focus:outline-none"
          >
            <option value="" disabled>
              Move Stage...
            </option>
            {BULK_STAGES.map((st) => (
              <option key={st} value={st}>
                Move to {st}
              </option>
            ))}
          </select>
          <Icons.chevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
        </div>

        {/* Bulk Shortlist */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onBulkShortlist(true)}
          className="h-8 gap-1 text-xs bg-white border-brand-300 text-brand-900 hover:bg-brand-50 shadow-2xs"
        >
          <Icons.bookmark className="h-3.5 w-3.5 text-brand-600" />
          <span>Add to Shortlist</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onBulkShortlist(false)}
          className="h-8 text-xs text-zinc-600 hover:text-zinc-900"
        >
          Remove Shortlist
        </Button>
      </div>
    </div>
  );
}
