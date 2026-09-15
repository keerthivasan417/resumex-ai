import React from "react";
import { JobStatus, JobLevel } from "@/types/job";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface JobFiltersBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: JobStatus | "All";
  onStatusFilterChange: (status: JobStatus | "All") => void;
  departmentFilter: string;
  onDepartmentFilterChange: (dept: string) => void;
  levelFilter: JobLevel | "All";
  onLevelFilterChange: (level: JobLevel | "All") => void;
  availableDepartments: string[];
  totalResults: number;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS: Array<JobStatus | "All"> = [
  "All",
  "Active",
  "Draft",
  "Paused",
  "Closed",
];

const LEVEL_OPTIONS: Array<JobLevel | "All"> = [
  "All",
  "Junior",
  "Mid",
  "Senior",
  "Staff",
  "Lead",
  "Principal",
];

export function JobFiltersBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  levelFilter,
  onLevelFilterChange,
  availableDepartments,
  totalResults,
  onClearFilters,
  hasActiveFilters,
}: JobFiltersBarProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search role title, department, or required skill..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-9 pr-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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

        {/* Dropdown Filters & Clear */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department Filter */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => onDepartmentFilterChange(e.target.value)}
              className="h-9 appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-8 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Departments</option>
              {availableDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <Icons.chevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

          {/* Level Filter */}
          <div className="relative">
            <select
              value={levelFilter}
              onChange={(e) =>
                onLevelFilterChange(e.target.value as JobLevel | "All")
              }
              className="h-9 appearance-none rounded-md border border-zinc-200 bg-white pl-3 pr-8 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Seniorities</option>
              {LEVEL_OPTIONS.filter((l) => l !== "All").map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
            <Icons.chevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          </div>

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

      {/* Status Filter Pills and Count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-100">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {STATUS_OPTIONS.map((status) => {
            const isSelected = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => onStatusFilterChange(status)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  isSelected
                    ? "bg-zinc-900 text-white shadow-xs"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                )}
              >
                {status}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-zinc-500">
          Showing <span className="font-semibold text-zinc-900">{totalResults}</span> {totalResults === 1 ? "requisition" : "requisitions"}
        </div>
      </div>
    </div>
  );
}
