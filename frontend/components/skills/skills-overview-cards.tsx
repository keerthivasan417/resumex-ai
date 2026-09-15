import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface SkillsOverviewCardsProps {
  totalDetected: number;
  supportedCount: number;
  needsVerificationCount: number;
  missingCount: number;
  activeStatusFilter?: string;
  onSelectFilter?: (status: string) => void;
}

export function SkillsOverviewCards({
  totalDetected,
  supportedCount,
  needsVerificationCount,
  missingCount,
  activeStatusFilter = "All",
  onSelectFilter,
}: SkillsOverviewCardsProps) {
  const cards = [
    {
      label: "Total Skills Evaluated",
      count: totalDetected,
      statusKey: "All",
      badgeText: "Taxonomy Pool",
      badgeVariant: "neutral" as const,
      icon: "cpu",
      borderColor: activeStatusFilter === "All" ? "border-zinc-950 ring-1 ring-zinc-950" : "border-zinc-200",
    },
    {
      label: "Supported / Verified",
      count: supportedCount,
      statusKey: "Supported",
      badgeText: "Strong & Supported",
      badgeVariant: "success" as const,
      icon: "checkCircle",
      borderColor:
        activeStatusFilter === "Supported" || activeStatusFilter === "Strong evidence"
          ? "border-emerald-600 ring-1 ring-emerald-600"
          : "border-zinc-200",
    },
    {
      label: "Needs Verification",
      count: needsVerificationCount,
      statusKey: "Needs verification",
      badgeText: "Uncorroborated Claims",
      badgeVariant: "warning" as const,
      icon: "alertCircle",
      borderColor:
        activeStatusFilter === "Needs verification"
          ? "border-amber-600 ring-1 ring-amber-600"
          : "border-zinc-200",
    },
    {
      label: "Not Found / Missing",
      count: missingCount,
      statusKey: "Not found",
      badgeText: "Benchmark Gaps",
      badgeVariant: "outline" as const,
      icon: "search",
      borderColor:
        activeStatusFilter === "Not found"
          ? "border-zinc-600 ring-1 ring-zinc-600"
          : "border-zinc-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card
          key={c.label}
          onClick={() => onSelectFilter?.(c.statusKey)}
          className={`cursor-pointer transition-all hover:border-zinc-400 bg-white shadow-xs ${c.borderColor}`}
        >
          <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">{c.label}</span>
              <Badge variant={c.badgeVariant} className="text-[10px] font-mono">
                {c.badgeText}
              </Badge>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-semibold tracking-tight text-zinc-950 font-mono">
                {c.count}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">
                {c.statusKey === "All" ? "eval items" : "claims"}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
