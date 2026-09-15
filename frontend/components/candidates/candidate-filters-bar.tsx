import React from "react";
import {
  PipelineStage,
  EvaluationStatus,
  EvidenceStrength,
} from "@/types/candidate";
import { Icons } from "@/components/ui/icons";

interface CandidateFiltersBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  stageFilter: PipelineStage | "All";
  onStageFilterChange: (stage: PipelineStage | "All") => void;
  evaluationFilter: EvaluationStatus | "All";
  onEvaluationFilterChange: (status: EvaluationStatus | "All") => void;
  evidenceFilter: EvidenceStrength | "All";
  onEvidenceFilterChange: (strength: EvidenceStrength | "All") => void;
  experienceFilter: string;
  onExperienceFilterChange: (val: string) => void;
  totalResults: number;
  totalCandidates: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STAGE_OPTIONS: Array<PipelineStage | "All"> = [
  "All",
  "New",
  "Screening",
  "Technical Review",
  "Interview",
  "Shortlisted",
  "Rejected",
];

const EVALUATION_OPTIONS: Array<EvaluationStatus | "All"> = [
  "All",
  "Strong",
  "Good",
  "Needs review",
  "Weak",
];

const EVIDENCE_OPTIONS: Array<EvidenceStrength | "All"> = [
  "All",
  "Strong",
  "Moderate",
  "Needs verification",
  "Weak",
];

const EXPERIENCE_OPTIONS = [
  { label: "All Experience", value: "All" },
  { label: "Junior (1-3 yrs)", value: "1-3" },
  { label: "Mid-Senior (4-6 yrs)", value: "4-6" },
  { label: "Staff+ (7+ yrs)", value: "7+" },
];

export function CandidateFiltersBar({
  searchQuery,
  onSearchChange,
  stageFilter,
  onStageFilterChange,
  evaluationFilter,
  onEvaluationFilterChange,
  evidenceFilter,
  onEvidenceFilterChange,
  experienceFilter,
  onExperienceFilterChange,
  totalResults,
  totalCandidates,
  onClearFilters,
  hasActiveFilters,
}: CandidateFiltersBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search candidate name, role, or verified skill..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-8 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              title="Clear search"
            >
              <Icons.x className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pipeline Stage */}
          <div className="relative">
            <select
              value={stageFilter}
              onChange={(e) =>
                onStageFilterChange(e.target.value as PipelineStage | "All")
              }
              className="h-9 appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-8 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Stages</option>
              {STAGE_OPTIONS.filter((s) => s !== "All").map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            <Icons.chevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Evaluation Status */}
          <div className="relative">
            <select
              value={evaluationFilter}
              onChange={(e) =>
                onEvaluationFilterChange(
                  e.target.value as EvaluationStatus | "All"
                )
              }
              className="h-9 appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-8 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Statuses</option>
              {EVALUATION_OPTIONS.filter((e) => e !== "All").map((status) => (
                <option key={status} value={status}>
                  {status} Status
                </option>
              ))}
            </select>
            <Icons.chevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Evidence Strength */}
          <div className="relative">
            <select
              value={evidenceFilter}
              onChange={(e) =>
                onEvidenceFilterChange(
                  e.target.value as EvidenceStrength | "All"
                )
              }
              className="h-9 appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-8 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Evidence</option>
              {EVIDENCE_OPTIONS.filter((ev) => ev !== "All").map((ev) => (
                <option key={ev} value={ev}>
                  {ev} Evidence
                </option>
              ))}
            </select>
            <Icons.chevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Experience Filter */}
          <div className="relative">
            <select
              value={experienceFilter}
              onChange={(e) => onExperienceFilterChange(e.target.value)}
              className="h-9 appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-8 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <Icons.chevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
            >
              <Icons.refresh className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count and Summary */}
      <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-xs text-zinc-500">
        <div>
          Showing <span className="font-semibold text-zinc-900">{totalResults}</span> of{" "}
          <span className="font-medium text-zinc-700">{totalCandidates}</span> candidates
        </div>
      </div>
    </div>
  );
}
