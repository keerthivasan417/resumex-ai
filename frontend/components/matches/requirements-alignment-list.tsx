"use client";

import * as React from "react";
import { JobRequirement, RequirementAlignmentStatus } from "@/types/matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getAlignmentStatusBadgeVariant } from "@/lib/mock-matching";
import { cn } from "@/lib/utils";

interface RequirementsAlignmentListProps {
  requirements: JobRequirement[];
  selectedRequirement: JobRequirement | null;
  onSelectRequirement: (req: JobRequirement) => void;
}

export function RequirementsAlignmentList({
  requirements,
  selectedRequirement,
  onSelectRequirement,
}: RequirementsAlignmentListProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");

  const statusFilters: Array<"All" | RequirementAlignmentStatus> = [
    "All",
    "Matched",
    "Supported",
    "Partial",
    "Needs verification",
    "Missing",
  ];

  const filteredRequirements = React.useMemo(() => {
    return requirements.filter((req) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.jobDescriptionSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.explanation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === "All" || req.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [requirements, searchQuery, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* Controls Bar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-1">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search role requirements..."
            className="w-full h-9 pl-9 pr-3 rounded-md border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statusFilters.map((st) => {
            const isActive = selectedStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                className={cn(
                  "px-2.5 py-1 rounded font-medium text-xs transition-colors whitespace-nowrap cursor-pointer",
                  isActive
                    ? "bg-zinc-900 text-white font-semibold shadow-xs"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-950"
                )}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Alignment Flow Subheader */}
      <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-md text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
        <div className="col-span-4">1. Job Requisition Requirement</div>
        <div className="col-span-4">2. Candidate Capability Mapping</div>
        <div className="col-span-4 text-right">3. Grounded Evidence Status</div>
      </div>

      {/* Requirements List */}
      <div className="space-y-2.5">
        {filteredRequirements.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-xs text-zinc-500">
            No requirements match the current filter or search criteria.
          </div>
        ) : (
          filteredRequirements.map((req) => {
            const isSelected = selectedRequirement?.id === req.id;
            return (
              <div
                key={req.id}
                onClick={() => onSelectRequirement(req)}
                className={cn(
                  "group rounded-lg border p-4 transition-all duration-150 cursor-pointer bg-white shadow-xs",
                  isSelected
                    ? "border-brand-600 ring-1 ring-brand-600 bg-brand-50/20"
                    : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50"
                )}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                  {/* Column 1: Job Requirement */}
                  <div className="lg:col-span-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-900">
                        {req.name}
                      </span>
                      <Badge
                        variant={
                          req.priority === "Must have"
                            ? "brand"
                            : req.priority === "Preferred"
                            ? "neutral"
                            : "outline"
                        }
                        className="text-[10px] font-mono"
                      >
                        {req.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                      &ldquo;{req.jobDescriptionSnippet}&rdquo;
                    </p>
                  </div>

                  {/* Column 2: Candidate Skill Mapping */}
                  <div className="lg:col-span-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-zinc-400 font-mono">Matched to:</span>
                      <span className="font-semibold text-zinc-800 font-mono">
                        {req.candidateSkillName || "Not present in profile"}
                      </span>
                    </div>

                    {/* Evidence Source checklist */}
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                      <span className="text-zinc-400">Sources:</span>
                      <span
                        title={`Skills section: ${req.evidence.skillsSection ? "✓" : "✕"}`}
                        className={cn(
                          "px-1.5 py-0.5 rounded",
                          req.evidence.skillsSection ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        Skill {req.evidence.skillsSection ? "✓" : "✕"}
                      </span>
                      <span
                        title={`Project: ${req.evidence.project ? "✓" : "✕"}`}
                        className={cn(
                          "px-1.5 py-0.5 rounded",
                          req.evidence.project ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        Project {req.evidence.project ? "✓" : "✕"}
                      </span>
                      <span
                        title={`Experience: ${req.evidence.experience ? "✓" : "✕"}`}
                        className={cn(
                          "px-1.5 py-0.5 rounded",
                          req.evidence.experience ? "bg-emerald-50 text-emerald-700 font-semibold" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        Exp {req.evidence.experience ? "✓" : "✕"}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Status & Action */}
                  <div className="lg:col-span-4 flex items-center justify-between lg:justify-end gap-3">
                    <Badge
                      variant={getAlignmentStatusBadgeVariant(req.status)}
                      className="text-xs px-2.5 py-0.5"
                    >
                      {req.status}
                    </Badge>

                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRequirement(req);
                      }}
                      className="text-xs h-8"
                    >
                      Audit Proof
                      <Icons.chevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
