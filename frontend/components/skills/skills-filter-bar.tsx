"use client";

import * as React from "react";
import { EvidenceStatus, SkillCategory } from "@/types/analysis";
import { getCategories } from "@/lib/mock-analysis";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface SkillsFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  totalResults: number;
}

export function SkillsFilterBar({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  totalResults,
}: SkillsFilterBarProps) {
  const statusFilters = [
    "All",
    "Strong evidence",
    "Supported",
    "Needs verification",
    "Not found",
  ];

  const categories = ["All Categories", ...getCategories()];

  return (
    <div className="space-y-3">
      {/* Top row: Search input & Category dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search skills, frameworks, or tools..."
            className="w-full h-9 pl-9 pr-8 rounded-md border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
              aria-label="Clear search"
            >
              <Icons.x className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 font-medium whitespace-nowrap">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="h-9 px-3 rounded-md border border-zinc-200 bg-white text-xs font-medium text-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-600 transition-all cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          {statusFilters.map((st) => {
            const isActive = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onStatusChange(st)}
                className={cn(
                  "px-3 py-1.5 rounded-md font-medium text-xs transition-colors whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-zinc-900 text-white shadow-xs font-semibold"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                )}
              >
                {st}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-mono text-zinc-400 whitespace-nowrap hidden md:inline">
          Showing {totalResults} {totalResults === 1 ? "skill" : "skills"}
        </span>
      </div>
    </div>
  );
}
