import * as React from "react";
import { ActivityTimelineItem } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface DevelopmentActivityTimelineProps {
  activities: ActivityTimelineItem[];
}

export function DevelopmentActivityTimeline({
  activities,
}: DevelopmentActivityTimelineProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Verified Development Activity & Cadence
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Chronological code events and PR merges linked to verified repositories.
            </p>
          </div>
          <Badge variant="neutral" className="text-[10px] font-mono">
            CADENCE: HIGH CONSISTENCY
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        <div className="relative pl-6 space-y-4 border-l border-zinc-200">
          {activities.map((act) => (
            <div key={act.id} className="relative group">
              {/* Dot */}
              <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-600 shadow-xs" />

              <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3.5 space-y-1.5 hover:bg-zinc-50 transition-colors text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-semibold text-zinc-900">{act.title}</span>
                  <span className="font-mono text-[11px] text-zinc-400 shrink-0">
                    {act.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-brand-800">
                  <Icons.gitBranch className="h-3.5 w-3.5 text-brand-600" />
                  <span>{act.repoOrContext}</span>
                </div>

                <p className="text-zinc-600 text-[11px] font-mono leading-relaxed pt-0.5">
                  {act.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
