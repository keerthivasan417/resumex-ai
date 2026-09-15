import * as React from "react";
import { JobAlignmentReportItem } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAlignmentStatusBadgeVariant } from "@/lib/mock-matching";

interface ReportJobAlignmentProps {
  items: JobAlignmentReportItem[];
}

export function ReportJobAlignment({ items }: ReportJobAlignmentProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs print-card print-break-inside-avoid">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-800 text-xs font-mono font-bold">
              4
            </span>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Job Requisition Requirements Alignment
            </CardTitle>
          </div>
          <Badge variant="neutral" className="text-[10px] font-mono">
            {items.length} BENCHMARK CRITERIA
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="rounded-md border border-zinc-200 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Requisition Requirement
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Candidate Capability
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Alignment Status
                </th>
                <th scope="col" className="py-2.5 px-3 font-medium">
                  Supporting Evidence / Gap Callout
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
                  {/* Requisition Requirement */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-900">{item.requirement}</span>
                      <Badge
                        variant={
                          item.priority === "Must have"
                            ? "brand"
                            : item.priority === "Preferred"
                            ? "neutral"
                            : "outline"
                        }
                        className="text-[9px] font-mono"
                      >
                        {item.priority}
                      </Badge>
                    </div>
                  </td>

                  {/* Candidate Capability */}
                  <td className="py-2.5 px-3 font-mono text-zinc-800 font-medium">
                    {item.candidateCapability}
                  </td>

                  {/* Status Badge */}
                  <td className="py-2.5 px-3">
                    <Badge variant={getAlignmentStatusBadgeVariant(item.status)} className="text-[10px]">
                      {item.status}
                    </Badge>
                  </td>

                  {/* Supporting Evidence / Gap */}
                  <td className="py-2.5 px-3 text-zinc-600 font-mono text-[11px] max-w-sm leading-relaxed">
                    <p>{item.supportingEvidence}</p>
                    {item.gapCallout && (
                      <p className="text-amber-700 text-[10px] mt-0.5 font-semibold">
                        Delta: {item.gapCallout}
                      </p>
                    )}
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
