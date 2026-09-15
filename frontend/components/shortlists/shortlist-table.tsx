import React from "react";
import Link from "next/link";
import { ShortlistEntry } from "@/types/shortlist";
import { PipelineStage } from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  getEvaluationStatusBadgeVariant,
  getEvidenceStrengthBadgeVariant,
} from "@/lib/mock-candidates";
import { cn } from "@/lib/utils";

interface ShortlistTableProps {
  shortlists: ShortlistEntry[];
  selectedEntryId?: string | null;
  onSelectEntry: (entry: ShortlistEntry) => void;
  onStageChange: (entryId: string, stage: PipelineStage) => void;
  onRemoveFromShortlist: (entryId: string) => void;
  compareIds: string[];
  onToggleCompareId: (id: string) => void;
}

const STAGES: PipelineStage[] = [
  "Screening",
  "Technical Review",
  "Interview",
  "Shortlisted",
  "Rejected",
];

export function ShortlistTable({
  shortlists,
  selectedEntryId,
  onSelectEntry,
  onStageChange,
  onRemoveFromShortlist,
  compareIds,
  onToggleCompareId,
}: ShortlistTableProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      {/* Desktop & Tablet Table (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              <th className="py-3 pl-4 pr-2 w-12 text-center" title="Select for comparison (2 to 4 candidates)">
                Compare
              </th>
              <th className="py-3 px-3">Candidate & Skills</th>
              <th className="py-3 px-3 text-center">Match</th>
              <th className="py-3 px-3">Skill Coverage</th>
              <th className="py-3 px-3">Evidence</th>
              <th className="py-3 px-3">Pipeline Stage</th>
              <th className="py-3 px-3">Shortlisted</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {shortlists.map((entry) => {
              const isSelected = selectedEntryId === entry.id;
              const isComparing = compareIds.includes(entry.id);
              const { candidate } = entry;

              return (
                <tr
                  key={entry.id}
                  onClick={() => onSelectEntry(entry)}
                  className={cn(
                    "group cursor-pointer transition-colors hover:bg-zinc-50/80",
                    isSelected && "bg-brand-50/40 hover:bg-brand-50/60",
                    isComparing && "bg-amber-50/20"
                  )}
                >
                  {/* Compare Selection Checkbox */}
                  <td
                    className="py-3.5 pl-4 pr-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={() => onToggleCompareId(entry.id)}
                      className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                      title="Select for comparison"
                    />
                  </td>

                  {/* Candidate Name, Current Role, Experience & Key Skills */}
                  <td className="py-3.5 px-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-950 group-hover:text-brand-700 transition-colors">
                          {candidate.name}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {candidate.currentRole}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-[11px] text-zinc-500">
                          {candidate.experience}
                        </span>
                      </div>

                      {/* Key Skills Preview */}
                      <div className="flex flex-wrap items-center gap-1">
                        {candidate.keySkills.slice(0, 4).map((sk) => (
                          <span
                            key={sk.name}
                            className={cn(
                              "rounded px-1.5 py-0.2 text-[10px] font-medium border",
                              sk.status === "Matched"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
                                : sk.status === "Supported"
                                ? "bg-brand-50 text-brand-700 border-brand-200/80"
                                : sk.status === "Needs verification"
                                ? "bg-amber-50 text-amber-700 border-amber-200/80"
                                : "bg-zinc-100 text-zinc-500 border-zinc-200"
                            )}
                          >
                            {sk.name}
                          </span>
                        ))}
                        {candidate.keySkills.length > 4 && (
                          <span className="text-[10px] text-zinc-400">
                            +{candidate.keySkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Match Score */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono",
                        entry.matchScore >= 85
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : entry.matchScore >= 70
                          ? "bg-brand-50 text-brand-700 border border-brand-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      )}
                    >
                      {entry.matchScore}%
                    </span>
                  </td>

                  {/* Skill Coverage */}
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={getEvaluationStatusBadgeVariant(
                        entry.skillCoverage
                      )}
                    >
                      {entry.skillCoverage}
                    </Badge>
                  </td>

                  {/* Evidence Strength */}
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={getEvidenceStrengthBadgeVariant(
                        entry.evidenceStrength
                      )}
                    >
                      {entry.evidenceStrength}
                    </Badge>
                  </td>

                  {/* Stage Dropdown */}
                  <td
                    className="py-3.5 px-3 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative inline-block">
                      <select
                        value={entry.pipelineStage}
                        onChange={(e) =>
                          onStageChange(
                            entry.id,
                            e.target.value as PipelineStage
                          )
                        }
                        className={cn(
                          "h-7 appearance-none rounded-md border px-2 pr-6 text-xs font-medium cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500",
                          entry.pipelineStage === "Interview"
                            ? "bg-brand-50/70 border-brand-200 text-brand-800"
                            : entry.pipelineStage === "Technical Review"
                            ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                            : entry.pipelineStage === "Rejected"
                            ? "bg-zinc-100 border-zinc-200 text-zinc-500"
                            : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                        )}
                      >
                        {STAGES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <Icons.chevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
                    </div>
                  </td>

                  {/* Added Date */}
                  <td className="py-3.5 px-3 text-zinc-500 whitespace-nowrap text-[11px]">
                    {entry.shortlistedAt}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectEntry(entry)}
                        className="h-7 px-2 text-xs text-zinc-600 hover:text-zinc-950"
                        title="Open Review Workspace"
                      >
                        <Icons.eye className="h-3.5 w-3.5 mr-1" />
                        <span>Review</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveFromShortlist(entry.id)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-red-600"
                        title="Remove from shortlist"
                      >
                        <Icons.trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (below md) */}
      <div className="md:hidden divide-y divide-zinc-200">
        {shortlists.map((entry) => {
          const isSelected = selectedEntryId === entry.id;
          const isComparing = compareIds.includes(entry.id);
          const { candidate } = entry;

          return (
            <div
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className={cn(
                "p-4 transition-colors space-y-3",
                isSelected ? "bg-brand-50/40" : "bg-white hover:bg-zinc-50/60",
                isComparing && "bg-amber-50/20"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isComparing}
                    onChange={() => onToggleCompareId(entry.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-950">
                      {candidate.name}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {candidate.currentRole} • {candidate.experience}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Shortlisted {entry.shortlistedAt}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-bold font-mono",
                    entry.matchScore >= 85
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : entry.matchScore >= 70
                      ? "bg-brand-50 text-brand-700 border border-brand-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  )}
                >
                  {entry.matchScore}%
                </span>
              </div>

              {/* Key Skills preview */}
              <div className="flex flex-wrap gap-1">
                {candidate.keySkills.slice(0, 3).map((sk) => (
                  <span
                    key={sk.name}
                    className="rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] text-zinc-700"
                  >
                    {sk.name}
                  </span>
                ))}
              </div>

              {/* Diagnostics badges */}
              <div className="grid grid-cols-2 gap-2 text-xs border-y border-zinc-100 py-2">
                <div>
                  <span className="text-zinc-400 block text-[11px]">
                    Coverage
                  </span>
                  <Badge
                    variant={getEvaluationStatusBadgeVariant(
                      entry.skillCoverage
                    )}
                  >
                    {entry.skillCoverage}
                  </Badge>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">
                    Evidence
                  </span>
                  <Badge
                    variant={getEvidenceStrengthBadgeVariant(
                      entry.evidenceStrength
                    )}
                  >
                    {entry.evidenceStrength}
                  </Badge>
                </div>
              </div>

              {/* Mobile Actions */}
              <div
                className="flex items-center justify-between gap-2 pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <select
                    value={entry.pipelineStage}
                    onChange={(e) =>
                      onStageChange(entry.id, e.target.value as PipelineStage)
                    }
                    className="h-8 appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 text-xs font-medium text-zinc-800"
                  >
                    {STAGES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  <Icons.chevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFromShortlist(entry.id)}
                    className="h-8 w-8 p-0 text-zinc-400 hover:text-red-600"
                  >
                    <Icons.trash className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectEntry(entry)}
                    className="h-8 text-xs gap-1"
                  >
                    <Icons.eye className="h-3 w-3" />
                    <span>Review</span>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
