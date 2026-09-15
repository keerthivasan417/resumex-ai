import React from "react";
import {
  Candidate,
  PipelineStage,
} from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  getStageBadgeVariant,
  getEvaluationStatusBadgeVariant,
  getEvidenceStrengthBadgeVariant,
} from "@/lib/mock-candidates";
import { cn } from "@/lib/utils";

interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidateId?: string | null;
  onSelectCandidate: (candidate: Candidate) => void;
  onStageChange: (candidateId: string, stage: PipelineStage) => void;
  onToggleShortlist: (candidateId: string) => void;
  selectedIds: string[];
  onToggleSelectId: (id: string) => void;
  onToggleSelectAll: () => void;
}

const STAGES: PipelineStage[] = [
  "New",
  "Screening",
  "Technical Review",
  "Interview",
  "Shortlisted",
  "Rejected",
];

export function CandidateTable({
  candidates,
  selectedCandidateId,
  onSelectCandidate,
  onStageChange,
  onToggleShortlist,
  selectedIds,
  onToggleSelectId,
  onToggleSelectAll,
}: CandidateTableProps) {
  const isAllSelected =
    candidates.length > 0 && selectedIds.length === candidates.length;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      {/* Desktop & Tablet Table (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              <th className="py-3 pl-4 pr-2 w-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                />
              </th>
              <th className="py-3 px-3">Candidate</th>
              <th className="py-3 px-3">Current Role</th>
              <th className="py-3 px-3">Experience</th>
              <th className="py-3 px-3 text-center">Match</th>
              <th className="py-3 px-3">Skill Coverage</th>
              <th className="py-3 px-3">Evidence</th>
              <th className="py-3 px-3">Pipeline Stage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {candidates.map((cand) => {
              const isSelected = selectedCandidateId === cand.id;
              const isChecked = selectedIds.includes(cand.id);

              return (
                <tr
                  key={cand.id}
                  onClick={() => onSelectCandidate(cand)}
                  className={cn(
                    "group cursor-pointer transition-colors hover:bg-zinc-50/80",
                    isSelected && "bg-brand-50/40 hover:bg-brand-50/60"
                  )}
                >
                  {/* Selection Checkbox */}
                  <td
                    className="py-3.5 pl-4 pr-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleSelectId(cand.id)}
                      className="rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                    />
                  </td>

                  {/* Candidate Name & Contact */}
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-950 group-hover:text-brand-700 transition-colors">
                          {cand.name}
                        </span>
                        {cand.isShortlisted && (
                          <span title="Shortlisted candidate">
                            <Icons.bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        {cand.location}
                      </span>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-3 font-medium text-zinc-800">
                    {cand.currentRole}
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-3 text-zinc-600 whitespace-nowrap">
                    {cand.experience}
                  </td>

                  {/* Match Score */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono",
                        cand.matchSummary.score >= 85
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : cand.matchSummary.score >= 70
                          ? "bg-brand-50 text-brand-700 border border-brand-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      )}
                    >
                      {cand.matchSummary.score}%
                    </span>
                  </td>

                  {/* Skill Coverage */}
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={getEvaluationStatusBadgeVariant(
                        cand.skillCoverage
                      )}
                    >
                      {cand.skillCoverage}
                    </Badge>
                  </td>

                  {/* Evidence Strength */}
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={getEvidenceStrengthBadgeVariant(
                        cand.evidenceStrength
                      )}
                    >
                      {cand.evidenceStrength}
                    </Badge>
                  </td>

                  {/* Stage Dropdown */}
                  <td
                    className="py-3.5 px-3 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative inline-block">
                      <select
                        value={cand.pipelineStage}
                        onChange={(e) =>
                          onStageChange(
                            cand.id,
                            e.target.value as PipelineStage
                          )
                        }
                        className={cn(
                          "h-7 appearance-none rounded-md border px-2 pr-6 text-xs font-medium cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-brand-500",
                          cand.pipelineStage === "Interview" ||
                            cand.pipelineStage === "Shortlisted"
                            ? "bg-brand-50/70 border-brand-200 text-brand-800"
                            : cand.pipelineStage === "Technical Review"
                            ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                            : cand.pipelineStage === "Rejected"
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

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleShortlist(cand.id)}
                        className="h-7 w-7 p-0 text-zinc-400 hover:text-amber-600"
                        title={
                          cand.isShortlisted
                            ? "Remove from Shortlist"
                            : "Add to Shortlist"
                        }
                      >
                        <Icons.bookmark
                          className={cn(
                            "h-3.5 w-3.5",
                            cand.isShortlisted && "text-amber-500 fill-amber-500"
                          )}
                        />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectCandidate(cand)}
                        className="h-7 px-2 text-xs text-zinc-600 hover:text-zinc-950"
                        title="Open Candidate Evaluation Workspace"
                      >
                        <Icons.eye className="h-3.5 w-3.5 mr-1" />
                        <span>Inspect</span>
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
        {candidates.map((cand) => {
          const isSelected = selectedCandidateId === cand.id;
          const isChecked = selectedIds.includes(cand.id);

          return (
            <div
              key={cand.id}
              onClick={() => onSelectCandidate(cand)}
              className={cn(
                "p-4 transition-colors space-y-3",
                isSelected ? "bg-brand-50/40" : "bg-white hover:bg-zinc-50/60"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleSelectId(cand.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-semibold text-zinc-950">
                        {cand.name}
                      </h3>
                      {cand.isShortlisted && (
                        <Icons.bookmark className="h-3 w-3 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                    <p className="text-xs text-zinc-500">{cand.currentRole}</p>
                    <p className="text-[11px] text-zinc-400">
                      {cand.location} • {cand.experience}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-xs font-bold font-mono",
                    cand.matchSummary.score >= 85
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : cand.matchSummary.score >= 70
                      ? "bg-brand-50 text-brand-700 border border-brand-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  )}
                >
                  {cand.matchSummary.score}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-y border-zinc-100 py-2">
                <div>
                  <span className="text-zinc-400 block text-[11px]">
                    Skill Coverage
                  </span>
                  <Badge
                    variant={getEvaluationStatusBadgeVariant(
                      cand.skillCoverage
                    )}
                  >
                    {cand.skillCoverage}
                  </Badge>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">
                    Evidence
                  </span>
                  <Badge
                    variant={getEvidenceStrengthBadgeVariant(
                      cand.evidenceStrength
                    )}
                  >
                    {cand.evidenceStrength}
                  </Badge>
                </div>
              </div>

              {/* Mobile Stage Selector and Action */}
              <div
                className="flex items-center justify-between gap-2 pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <select
                    value={cand.pipelineStage}
                    onChange={(e) =>
                      onStageChange(cand.id, e.target.value as PipelineStage)
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
                    onClick={() => onToggleShortlist(cand.id)}
                    className="h-8 w-8 p-0 text-zinc-500"
                  >
                    <Icons.bookmark
                      className={cn(
                        "h-4 w-4",
                        cand.isShortlisted && "text-amber-500 fill-amber-500"
                      )}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectCandidate(cand)}
                    className="h-8 text-xs gap-1"
                  >
                    <Icons.eye className="h-3 w-3" />
                    <span>Inspect</span>
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
