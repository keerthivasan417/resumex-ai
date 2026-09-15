import * as React from "react";
import { ExecutiveSummaryData } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface ReportExecutiveSummaryProps {
  summary: ExecutiveSummaryData;
}

export function ReportExecutiveSummary({ summary }: ReportExecutiveSummaryProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs print-card print-break-inside-avoid">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-800 text-xs font-mono font-bold">
              1
            </span>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Executive Evaluation Summary
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Compatibility:</span>
            <Badge variant="success" className="text-xs font-mono">
              {summary.overallCompatibility}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Technical Verdict Statement */}
        <div className="rounded-md border border-zinc-200 bg-zinc-50/70 p-4 text-xs text-zinc-800 leading-relaxed font-mono">
          <span className="font-semibold text-zinc-950 uppercase tracking-wider text-[10px] block mb-1">
            Deterministic Screening Verdict
          </span>
          &ldquo;{summary.verdictSummary}&rdquo;
        </div>

        {/* 3-Column Core Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Strongest Areas */}
          <div className="rounded-md border border-zinc-200 bg-white p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
              <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <Icons.checkCircle className="h-3.5 w-3.5 text-emerald-600" />
                Strongest Areas
              </span>
              <Badge variant="success" className="text-[9px] font-mono">
                {summary.strongestAreas.length} Verified
              </Badge>
            </div>
            <ul className="space-y-1.5 text-zinc-600 text-[11px] font-mono leading-relaxed">
              {summary.strongestAreas.map((area, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas Needing Verification */}
          <div className="rounded-md border border-zinc-200 bg-white p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
              <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <Icons.alertCircle className="h-3.5 w-3.5 text-amber-600" />
                Needs Verification
              </span>
              <Badge variant="warning" className="text-[9px] font-mono">
                {summary.areasNeedingVerification.length} Audit Items
              </Badge>
            </div>
            <ul className="space-y-1.5 text-zinc-600 text-[11px] font-mono leading-relaxed">
              {summary.areasNeedingVerification.map((area, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold shrink-0">!</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Major Skill Gaps */}
          <div className="rounded-md border border-zinc-200 bg-white p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-1.5">
              <span className="font-semibold text-zinc-900 flex items-center gap-1.5">
                <Icons.search className="h-3.5 w-3.5 text-zinc-400" />
                Major Skill Gaps
              </span>
              <Badge variant="outline" className="text-[9px] font-mono">
                {summary.majorSkillGaps.length} Gaps
              </Badge>
            </div>
            <ul className="space-y-1.5 text-zinc-600 text-[11px] font-mono leading-relaxed">
              {summary.majorSkillGaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-zinc-400 font-bold shrink-0">✕</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
