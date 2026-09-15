import * as React from "react";
import { SkillEvidenceReportItem } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeVariant } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

interface ReportSkillEvidenceTableProps {
  skills: SkillEvidenceReportItem[];
}

export function ReportSkillEvidenceTable({ skills }: ReportSkillEvidenceTableProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs print-card print-break-inside-avoid">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-800 text-xs font-mono font-bold">
              3
            </span>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Technical Skill Evidence Ledger
            </CardTitle>
          </div>
          <Badge variant="neutral" className="text-[10px] font-mono">
            {skills.length} EVALUATED SKILLS
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="rounded-md border border-zinc-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Skill & Category
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Evidence Status
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Strength
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Sources Grounded
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Empirical Proof / Audit Citation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {skills.map((skill) => (
                <tr key={skill.name} className="hover:bg-zinc-50/60 transition-colors">
                  {/* Skill & Category */}
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-zinc-900 block">{skill.name}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {skill.category}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3">
                    <Badge variant={getStatusBadgeVariant(skill.status)} className="text-[10px]">
                      {skill.status}
                    </Badge>
                  </td>

                  {/* Strength */}
                  <td className="py-2.5 px-3 font-mono text-xs">
                    <span
                      className={cn(
                        "font-semibold",
                        skill.strength === "High" && "text-emerald-700",
                        skill.strength === "Moderate" && "text-brand-700",
                        skill.strength === "Low" && "text-amber-700",
                        skill.strength === "None" && "text-zinc-400"
                      )}
                    >
                      {skill.strength}
                    </span>
                  </td>

                  {/* Sources Grounded */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <span
                        title="Skills Section"
                        className={cn(
                          "px-1 py-0.5 rounded",
                          skill.sources.skillsSection ? "bg-emerald-50 text-emerald-800 font-bold" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        S{skill.sources.skillsSection ? "✓" : "✕"}
                      </span>
                      <span
                        title="Project"
                        className={cn(
                          "px-1 py-0.5 rounded",
                          skill.sources.project ? "bg-emerald-50 text-emerald-800 font-bold" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        P{skill.sources.project ? "✓" : "✕"}
                      </span>
                      <span
                        title="Experience"
                        className={cn(
                          "px-1 py-0.5 rounded",
                          skill.sources.experience ? "bg-emerald-50 text-emerald-800 font-bold" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        E{skill.sources.experience ? "✓" : "✕"}
                      </span>
                      <span
                        title="GitHub"
                        className={cn(
                          "px-1 py-0.5 rounded",
                          skill.sources.github ? "bg-emerald-50 text-emerald-800 font-bold" : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        G{skill.sources.github ? "✓" : "✕"}
                      </span>
                    </div>
                  </td>

                  {/* Key Proof */}
                  <td className="py-2.5 px-3 text-zinc-600 font-mono text-[11px] max-w-xs leading-relaxed">
                    {skill.keyProof}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
