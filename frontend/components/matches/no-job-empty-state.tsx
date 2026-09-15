import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface NoJobEmptyStateProps {
  availableJobs: Array<{ id: string; title: string; company: string; level: string }>;
  onSelectJob: (jobId: string) => void;
}

export function NoJobEmptyState({ availableJobs, onSelectJob }: NoJobEmptyStateProps) {
  return (
    <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto space-y-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 border border-zinc-200">
          <Icons.briefcase className="h-6 w-6" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-base font-semibold text-zinc-900">
            No Target Job Requisition Selected
          </h2>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Requirements alignment and skill gap delta evaluation require a target job requisition.
            Select an engineering role to evaluate the candidate against defined technical criteria.
          </p>
        </div>

        <div className="w-full space-y-2 pt-2 text-left">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block text-center">
            Select an Engineering Benchmark Requisition:
          </span>
          <div className="space-y-2">
            {availableJobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => onSelectJob(job.id)}
                className="w-full p-3 rounded-md border border-zinc-200 bg-white hover:border-brand-500 hover:bg-brand-50/30 transition-all text-left flex items-center justify-between gap-3 cursor-pointer shadow-xs"
              >
                <div>
                  <p className="text-xs font-semibold text-zinc-900">{job.title}</p>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    {job.company} • {job.level}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs h-7 pointer-events-none">
                  Load Profile
                  <Icons.arrowRight className="ml-1 h-3 w-3" />
                </Button>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
