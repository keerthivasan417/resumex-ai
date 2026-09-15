"use client";

import * as React from "react";
import { JobRequirement, SkillGapTier } from "@/types/matching";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { getAlignmentStatusBadgeVariant } from "@/lib/mock-matching";
import { cn } from "@/lib/utils";

interface SkillGapSectionProps {
  requirements: JobRequirement[];
  onSelectRequirement?: (req: JobRequirement) => void;
}

export function SkillGapSection({
  requirements,
  onSelectRequirement,
}: SkillGapSectionProps) {
  const strongMatches = requirements.filter((r) => r.gapTier === "Strong match");
  const needsStrengthening = requirements.filter(
    (r) => r.gapTier === "Needs strengthening"
  );
  const missingItems = requirements.filter((r) => r.gapTier === "Missing");

  const tiers: Array<{
    tier: SkillGapTier;
    title: string;
    description: string;
    items: JobRequirement[];
    badgeVariant: "success" | "warning" | "outline";
    borderClass: string;
  }> = [
    {
      tier: "Strong match",
      title: "Strong Match",
      description: "Requirements with verified tenure, production ownership, or AST codebase proof.",
      items: strongMatches,
      badgeVariant: "success",
      borderClass: "border-l-4 border-l-emerald-500",
    },
    {
      tier: "Needs strengthening",
      title: "Needs Strengthening",
      description: "Claimed or partially supported skills that lack comprehensive multi-channel proof.",
      items: needsStrengthening,
      badgeVariant: "warning",
      borderClass: "border-l-4 border-l-amber-500",
    },
    {
      tier: "Missing",
      title: "Missing",
      description: "Requisition competencies with no identified candidate resume or repository artifacts.",
      items: missingItems,
      badgeVariant: "outline",
      borderClass: "border-l-4 border-l-zinc-400",
    },
  ];

  return (
    <div className="space-y-4 pt-4 border-t border-zinc-200">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
            Skill Gap & Requisition Delta
          </h2>
          <Badge variant="brand" className="text-[10px] font-mono">
            DELTA AUDIT
          </Badge>
        </div>
        <p className="text-xs text-zinc-500 max-w-2xl">
          Deterministic breakdown of competencies satisfying target requirements versus areas requiring
          evidence reinforcement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {tiers.map((group) => (
          <div
            key={group.tier}
            className={`rounded-lg border border-zinc-200 bg-white p-4 shadow-xs space-y-3 flex flex-col justify-between ${group.borderClass}`}
          >
            {/* Tier Header */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-zinc-900">
                  {group.title}
                </span>
                <Badge variant={group.badgeVariant} className="text-[10px] font-mono">
                  {group.items.length} {group.items.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {group.description}
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-2.5 pt-2 flex-1">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectRequirement?.(item)}
                  className="p-3 rounded-md border border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100/70 transition-colors cursor-pointer space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">{item.name}</span>
                    <Badge
                      variant={getAlignmentStatusBadgeVariant(item.status)}
                      className="text-[10px] font-mono px-1.5 py-0"
                    >
                      {item.status}
                    </Badge>
                  </div>

                  {/* Reason */}
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-mono">
                    <span className="font-semibold text-zinc-700">Reason:</span>{" "}
                    {item.gapReason}
                  </p>

                  {/* Future recommendation placeholder */}
                  <div className="pt-1.5 border-t border-zinc-200/80 flex items-start gap-1.5 text-[11px] text-zinc-500">
                    <span className="text-brand-700 font-semibold shrink-0">Rec:</span>
                    <span className="font-mono">{item.futureRecommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
