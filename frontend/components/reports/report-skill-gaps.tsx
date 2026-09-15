import * as React from "react";
import { SkillGapReportItem } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ReportSkillGapsProps {
  skillGaps: SkillGapReportItem[];
}

export function ReportSkillGaps({ skillGaps }: ReportSkillGapsProps) {
  const strongMatches = skillGaps.filter((g) => g.tier === "Strong match");
  const needsStrengthening = skillGaps.filter((g) => g.tier === "Needs strengthening");
  const missing = skillGaps.filter((g) => g.tier === "Missing");

  const groups = [
    {
      title: "Strong Match",
      tier: "Strong match",
      badgeVariant: "success" as const,
      borderClass: "border-l-3 border-l-emerald-500",
      items: strongMatches,
    },
    {
      title: "Needs Strengthening",
      tier: "Needs strengthening",
      badgeVariant: "warning" as const,
      borderClass: "border-l-3 border-l-amber-500",
      items: needsStrengthening,
    },
    {
      title: "Missing / Requisition Gap",
      tier: "Missing",
      badgeVariant: "outline" as const,
      borderClass: "border-l-3 border-l-zinc-400",
      items: missing,
    },
  ];

  return (
    <Card className="border-zinc-200 bg-white shadow-xs print-card print-break-inside-avoid">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-800 text-xs font-mono font-bold">
              5
            </span>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Skill Gap & Candidate Development Analysis
            </CardTitle>
          </div>
          <Badge variant="brand" className="text-[10px] font-mono">
            3-TIER DELTA
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {groups.map((grp) => (
            <div
              key={grp.title}
              className={`rounded-md border border-zinc-200 bg-zinc-50/40 p-3.5 space-y-3 ${grp.borderClass}`}
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-1.5">
                <span className="text-xs font-semibold text-zinc-900">{grp.title}</span>
                <Badge variant={grp.badgeVariant} className="text-[9px] font-mono">
                  {grp.items.length} {grp.items.length === 1 ? "Item" : "Items"}
                </Badge>
              </div>

              <div className="space-y-2.5">
                {grp.items.map((item) => (
                  <div
                    key={item.skill}
                    className="p-2.5 rounded border border-zinc-200 bg-white space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">{item.skill}</span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-600 font-mono leading-relaxed">
                      {item.reason}
                    </p>

                    <p className="text-[10px] text-brand-800 font-mono pt-1 border-t border-zinc-100">
                      <strong>Rec:</strong> {item.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
