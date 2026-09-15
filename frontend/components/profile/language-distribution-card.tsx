import * as React from "react";
import { LanguageDistributionItem } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LanguageDistributionCardProps {
  distribution: LanguageDistributionItem[];
}

export function LanguageDistributionCard({
  distribution,
}: LanguageDistributionCardProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Repository Language Distribution
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Codebase volume and AST complexity scanned across 6 public and verified private repositories.
            </p>
          </div>
          <Badge variant="neutral" className="text-[10px] font-mono">
            157,500 TOTAL LOC
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* Continuous Stacked Horizontal Language Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-100 p-0.5 gap-0.5">
            {distribution.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
                className="h-full rounded-xs transition-all first:rounded-l-full last:rounded-r-full"
                title={`${lang.name}: ${lang.percentage}% (${lang.linesOfCode})`}
              />
            ))}
          </div>

          {/* Inline Legend */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[11px] font-mono text-zinc-600">
            {distribution.map((lang) => (
              <div key={lang.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="font-semibold text-zinc-800">{lang.name}</span>
                <span className="text-zinc-400">{lang.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Linguistic Breakdown Table */}
        <div className="divide-y divide-zinc-100 rounded-md border border-zinc-200 overflow-hidden text-xs">
          {distribution.map((lang) => (
            <div
              key={lang.name}
              className="p-3 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center hover:bg-zinc-50/50 transition-colors"
            >
              <div className="sm:col-span-3 flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="font-semibold text-zinc-900">{lang.name}</span>
              </div>

              <div className="sm:col-span-2 text-zinc-500 font-mono text-[11px]">
                {lang.linesOfCode}
              </div>

              <div className="sm:col-span-7 text-zinc-600 text-xs">
                {lang.primaryFocus}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
