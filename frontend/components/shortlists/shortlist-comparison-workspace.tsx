import React from "react";
import Link from "next/link";
import { ShortlistEntry } from "@/types/shortlist";
import { PipelineStage } from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  getStageBadgeVariant,
  getEvaluationStatusBadgeVariant,
  getEvidenceStrengthBadgeVariant,
} from "@/lib/mock-candidates";
import { cn } from "@/lib/utils";

interface ShortlistComparisonWorkspaceProps {
  entries: ShortlistEntry[];
  onClose: () => void;
  onClearSelection: () => void;
  onStageChange: (entryId: string, stage: PipelineStage) => void;
  onSelectDetail: (entry: ShortlistEntry) => void;
}

// Key common technical skills to compare across requisitions
const BENCHMARK_SKILLS = [
  { name: "Go (Golang)", priority: "Must have" as const },
  { name: "Apache Kafka", priority: "Must have" as const },
  { name: "PostgreSQL", priority: "Must have" as const },
  { name: "Python", priority: "Must have" as const },
  { name: "FastAPI", priority: "Preferred" as const },
  { name: "Docker", priority: "Preferred" as const },
  { name: "AWS", priority: "Preferred" as const },
  { name: "Kubernetes", priority: "Nice to have" as const },
  { name: "Terraform", priority: "Nice to have" as const },
];

export function ShortlistComparisonWorkspace({
  entries,
  onClose,
  onClearSelection,
  onStageChange,
  onSelectDetail,
}: ShortlistComparisonWorkspaceProps) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Comparison Workspace Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-950">
              Candidate Comparison Workspace
            </h2>
            <span className="rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700 border border-brand-200">
              Comparing {entries.length} Candidates
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Side-by-side evaluation of verified skills, evidence strength, and recruiter observations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClearSelection}
            className="h-8 text-xs text-zinc-600"
          >
            Clear Selection
          </Button>
          <Button
            size="sm"
            onClick={onClose}
            className="h-8 gap-1.5 text-xs"
          >
            <Icons.arrowRight className="h-3.5 w-3.5 rotate-180" />
            <span>Return to Shortlist Table</span>
          </Button>
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              {/* Row 1: Candidate Headers */}
              <tr className="border-b border-zinc-200 bg-zinc-50/80">
                <th className="py-4 px-4 w-48 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider sticky left-0 bg-zinc-50/95 z-10 border-r border-zinc-200">
                  Evaluation Metric
                </th>
                {entries.map((entry) => (
                  <th
                    key={entry.id}
                    className="py-4 px-4 min-w-[220px] text-zinc-900 border-r border-zinc-100 last:border-r-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-zinc-950">
                          {entry.candidate.name}
                        </span>
                        <Badge
                          variant={getStageBadgeVariant(entry.pipelineStage)}
                        >
                          {entry.pipelineStage}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 font-normal">
                        {entry.candidate.currentRole}
                      </p>
                      <p className="text-[11px] text-zinc-400 font-normal">
                        {entry.candidate.location} • {entry.candidate.experience}
                      </p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {/* Overall Match */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-zinc-900 sticky left-0 bg-white z-10 border-r border-zinc-200">
                  Overall Compatibility
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3 px-4 border-r border-zinc-100 last:border-r-0"
                  >
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold font-mono",
                        entry.matchScore >= 85
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : entry.matchScore >= 70
                          ? "bg-brand-50 text-brand-700 border border-brand-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      )}
                    >
                      {entry.matchScore}% Match
                    </span>
                  </td>
                ))}
              </tr>

              {/* Skill Coverage */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-zinc-900 sticky left-0 bg-white z-10 border-r border-zinc-200">
                  Skill Coverage
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3 px-4 border-r border-zinc-100 last:border-r-0"
                  >
                    <Badge
                      variant={getEvaluationStatusBadgeVariant(
                        entry.skillCoverage
                      )}
                    >
                      {entry.skillCoverage}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Evidence Strength */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-zinc-900 sticky left-0 bg-white z-10 border-r border-zinc-200">
                  Evidence Strength
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3 px-4 border-r border-zinc-100 last:border-r-0"
                  >
                    <Badge
                      variant={getEvidenceStrengthBadgeVariant(
                        entry.evidenceStrength
                      )}
                    >
                      {entry.evidenceStrength}
                    </Badge>
                  </td>
                ))}
              </tr>

              {/* Experience */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-zinc-900 sticky left-0 bg-white z-10 border-r border-zinc-200">
                  Total Experience
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3 px-4 border-r border-zinc-100 last:border-r-0"
                  >
                    <span className="font-medium text-zinc-900">
                      {entry.candidate.experience}
                    </span>
                    <span className="text-[11px] text-zinc-400 ml-1.5">
                      ({entry.candidate.experienceYears >= 4 ? "Qualified" : "Borderline"})
                    </span>
                  </td>
                ))}
              </tr>

              {/* Project Relevance */}
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-3 px-4 font-semibold text-zinc-900 sticky left-0 bg-white z-10 border-r border-zinc-200">
                  Project Relevance
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3 px-4 border-r border-zinc-100 last:border-r-0 font-medium text-zinc-800"
                  >
                    {entry.projectRelevance} Relevance
                  </td>
                ))}
              </tr>

              {/* Section Divider: Key Skills Matrix */}
              <tr className="bg-zinc-100/70">
                <td
                  colSpan={entries.length + 1}
                  className="py-2.5 px-4 font-bold text-[11px] uppercase tracking-wider text-zinc-700"
                >
                  Technical Skill Alignment Matrix
                </td>
              </tr>

              {/* Benchmark Skills Rows */}
              {BENCHMARK_SKILLS.map((skill) => (
                <tr
                  key={skill.name}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="py-2.5 px-4 sticky left-0 bg-white z-10 border-r border-zinc-200">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-zinc-900">
                        {skill.name}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] font-medium px-1 rounded",
                          skill.priority === "Must have"
                            ? "bg-brand-50 text-brand-700"
                            : "bg-zinc-100 text-zinc-600"
                        )}
                      >
                        {skill.priority}
                      </span>
                    </div>
                  </td>

                  {entries.map((entry) => {
                    const candSkill = entry.candidate.keySkills.find(
                      (s) => s.name.toLowerCase() === skill.name.toLowerCase()
                    );

                    let displayIcon = (
                      <span className="text-zinc-400 font-bold">✕ missing</span>
                    );
                    let badgeClass = "text-zinc-400 bg-zinc-50";

                    if (candSkill?.status === "Matched") {
                      displayIcon = (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="font-bold">✓</span> supported
                        </span>
                      );
                      badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    } else if (candSkill?.status === "Supported") {
                      displayIcon = (
                        <span className="text-brand-700 font-semibold flex items-center gap-1">
                          <span className="font-bold">✓</span> supported
                        </span>
                      );
                      badgeClass = "bg-brand-50 text-brand-700 border-brand-200";
                    } else if (candSkill?.status === "Needs verification") {
                      displayIcon = (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <span className="font-bold">⚠</span> needs verification
                        </span>
                      );
                      badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
                    }

                    return (
                      <td
                        key={entry.id}
                        className="py-2.5 px-4 border-r border-zinc-100 last:border-r-0"
                      >
                        <div className="inline-flex items-center rounded border px-2 py-0.5 text-xs">
                          {displayIcon}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Recruiter Review Notes Row */}
              <tr className="bg-amber-50/20">
                <td className="py-3.5 px-4 font-semibold text-zinc-900 sticky left-0 bg-amber-50/40 z-10 border-r border-zinc-200">
                  Recruiter Review Notes
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3.5 px-4 border-r border-zinc-100 last:border-r-0 text-xs text-zinc-600 italic leading-relaxed"
                  >
                    "{entry.recruiterNotes}"
                  </td>
                ))}
              </tr>

              {/* Recommended Next Step Row */}
              <tr className="bg-zinc-50/30">
                <td className="py-3.5 px-4 font-semibold text-zinc-900 sticky left-0 bg-zinc-50/80 z-10 border-r border-zinc-200">
                  Recommended Action
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3.5 px-4 border-r border-zinc-100 last:border-r-0"
                  >
                    <span className="font-semibold text-xs text-zinc-900 block">
                      {entry.candidate.decisionNotes.recommendedNextStep}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Action Buttons Row */}
              <tr className="bg-zinc-50/60">
                <td className="py-3.5 px-4 font-semibold text-zinc-500 sticky left-0 bg-zinc-50/90 z-10 border-r border-zinc-200">
                  Candidate Actions
                </td>
                {entries.map((entry) => (
                  <td
                    key={entry.id}
                    className="py-3.5 px-4 border-r border-zinc-100 last:border-r-0"
                  >
                    <div className="flex flex-col gap-1.5">
                      <Button
                        size="sm"
                        onClick={() => onSelectDetail(entry)}
                        className="h-7 text-xs w-full"
                      >
                        <Icons.eye className="h-3 w-3 mr-1" />
                        <span>Inspect Full Review</span>
                      </Button>

                      <div className="flex items-center gap-1">
                        <Link
                          href="/app/reports"
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] w-full bg-white"
                          >
                            Report
                          </Button>
                        </Link>
                        <Link
                          href="/app/evidence"
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-[11px] w-full bg-white"
                          >
                            Evidence
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
