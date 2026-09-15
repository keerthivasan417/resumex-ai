import * as React from "react";
import { CandidateEvaluationReport } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface ReportDeveloperIntelligenceProps {
  data: CandidateEvaluationReport["developerIntelligence"];
}

export function ReportDeveloperIntelligence({ data }: ReportDeveloperIntelligenceProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs print-card print-break-inside-avoid">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-800 text-xs font-mono font-bold">
              6
            </span>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Developer Intelligence & Repository Profiling
            </CardTitle>
          </div>
          <Badge variant="brand" className="text-[10px] font-mono">
            CODEBASE ARTIFACTS
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 text-xs">
        {/* Commit Summary Callout */}
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 font-mono text-xs text-zinc-700 leading-relaxed">
          <span className="font-semibold text-zinc-900 block mb-0.5 text-[11px] uppercase tracking-wider">
            Repository Activity Cadence:
          </span>
          {data.commitSummary}
        </div>

        {/* Language Distribution Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-zinc-900 font-mono text-xs uppercase tracking-wider">
              Scanned Language Volume (157,500 LOC Total)
            </span>
          </div>

          {/* Bar */}
          <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-zinc-100 gap-0.5 p-0.5">
            {data.languageDistribution.map((lang) => (
              <div
                key={lang.name}
                style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                className="h-full first:rounded-l-full last:rounded-r-full"
                title={`${lang.name}: ${lang.percentage}%`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-zinc-600">
            {data.languageDistribution.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="font-semibold text-zinc-800">{lang.name}</span>
                <span className="text-zinc-400">({lang.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Key Verified Projects */}
          <div className="space-y-2.5">
            <span className="font-semibold text-zinc-900 font-mono text-xs uppercase tracking-wider block">
              Core Verified Codebases
            </span>
            <div className="space-y-2">
              {data.keyProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3 rounded-md border border-zinc-200 bg-zinc-50/50 space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900 text-xs">
                      {proj.name}
                    </span>
                    <Badge variant="success" className="text-[9px]">
                      {proj.evidenceBadge}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-1 py-0.5 rounded bg-zinc-200/70 text-zinc-800 text-[10px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitive Coding Platform Benchmarks */}
          <div className="space-y-2.5">
            <span className="font-semibold text-zinc-900 font-mono text-xs uppercase tracking-wider block">
              Competitive Coding Benchmarks
            </span>
            <div className="space-y-2">
              {data.codingProfiles
                .filter((cp) => cp.status !== "not_connected")
                .map((cp) => (
                  <div
                    key={cp.platform}
                    className="p-3 rounded-md border border-zinc-200 bg-zinc-50/50 flex items-center justify-between font-mono"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-900 text-xs">
                          {cp.platform}
                        </span>
                        <span className="text-[11px] text-zinc-500">(@{cp.handle})</span>
                      </div>
                      <p className="text-[11px] text-zinc-600 mt-0.5">
                        {cp.details?.rank || "Verified Profile"} • {cp.details?.solvedCount} Solved
                      </p>
                    </div>

                    <div className="text-right">
                      {cp.details?.rating && (
                        <span className="font-semibold text-brand-800 text-sm block">
                          {cp.details.rating}
                        </span>
                      )}
                      <Badge variant="brand" className="text-[9px]">
                        {cp.status === "connected" ? "Verified Link" : "Profile Linked"}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
