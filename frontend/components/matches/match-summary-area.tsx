import * as React from "react";
import { TargetJob } from "@/types/matching";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface MatchSummaryAreaProps {
  summary: TargetJob["summary"];
}

export function MatchSummaryArea({ summary }: MatchSummaryAreaProps) {
  const metrics = [
    {
      label: "Overall Compatibility",
      value: summary.overallCompatibility,
      badge: "Holistic Match",
      badgeVariant: "brand" as const,
      icon: "briefcase",
    },
    {
      label: "Skill Requirements Coverage",
      value: summary.skillCoverage,
      badge: `${summary.matchedCount} Matched / ${summary.supportedCount} Supported`,
      badgeVariant: "success" as const,
      icon: "cpu",
    },
    {
      label: "Experience Alignment",
      value: summary.experienceAlignment,
      badge: "Tenure & Domain",
      badgeVariant: "neutral" as const,
      icon: "fileText",
    },
    {
      label: "Project Relevance",
      value: summary.projectRelevance,
      badge: "Architecture Scope",
      badgeVariant: "neutral" as const,
      icon: "code",
    },
    {
      label: "Evidence Grounding Strength",
      value: summary.evidenceStrength,
      badge: "AST Verified",
      badgeVariant: "brand" as const,
      icon: "checkCircle",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 font-mono">
          Requisition Alignment Evaluation
        </span>
        <span className="text-[11px] font-mono text-zinc-400">
          Deterministic Evidence Scoring
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {metrics.map((m, idx) => (
          <Card
            key={m.label}
            className={`border-zinc-200 bg-white shadow-xs flex flex-col justify-between overflow-hidden ${
              idx === 0 ? "md:col-span-2 lg:col-span-1 border-brand-200 bg-brand-50/20" : ""
            }`}
          >
            <CardContent className="p-4 space-y-2 flex flex-col justify-between h-full min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1.5 min-w-0">
                <span className="text-xs font-medium text-zinc-500 leading-tight min-w-0">
                  {m.label}
                </span>
                <Badge
                  variant={m.badgeVariant}
                  className="text-[10px] font-mono px-1.5 py-0.5 whitespace-normal max-w-full"
                >
                  {m.badge}
                </Badge>
              </div>

              <div className="pt-2 min-w-0">
                <p className="text-sm font-semibold text-zinc-900 leading-snug font-mono break-words">
                  {m.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
