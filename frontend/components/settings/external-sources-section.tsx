import React from "react";
import { ExternalEvidenceSource } from "@/types/settings";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface ExternalSourcesSectionProps {
  sources: ExternalEvidenceSource[];
  onToggleSource: (sourceId: string) => void;
}

export function ExternalSourcesSection({
  sources,
  onToggleSource,
}: ExternalSourcesSectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-950">
          External Evidence Sources
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Configure how ResumeX inspects external developer identities and public profile artifacts.
        </p>
      </div>

      {/* Integration Notice Alert */}
      <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-3.5 space-y-1">
        <div className="flex items-center gap-2">
          <Icons.code className="h-4 w-4 text-brand-700" />
          <span className="text-xs font-semibold text-brand-950">
            Passive Public Artifact Extraction
          </span>
        </div>
        <p className="text-xs text-brand-900/80 leading-relaxed">
          ResumeX inspects publicly accessible profiles and repository links provided by candidates on their resumes. Direct OAuth API integrations can be configured later per workspace.
        </p>
      </div>

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sources.map((source) => {
          return (
            <div
              key={source.id}
              className={cn(
                "rounded-lg border p-4 transition-all space-y-2.5",
                source.enabled
                  ? "border-zinc-300 bg-white shadow-2xs"
                  : "border-zinc-200 bg-zinc-50/70 opacity-80"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-950">
                      {source.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      ({source.category})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        source.status === "Available" ? "success" : "neutral"
                      }
                    >
                      {source.status}
                    </Badge>
                    <span className="text-[11px] text-zinc-500">
                      {source.connectionType}
                    </span>
                  </div>
                </div>

                {/* Enable/Disable Toggle Switch */}
                <button
                  type="button"
                  onClick={() => onToggleSource(source.id)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    source.enabled ? "bg-brand-600" : "bg-zinc-300"
                  )}
                  title={source.enabled ? "Disable Source" : "Enable Source"}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      source.enabled ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </button>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {source.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-400">
                <span>Verification Role</span>
                <span className="font-medium text-zinc-700">
                  {source.enabled ? "Active for Parsing" : "Ignored in Evidence"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
