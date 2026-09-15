import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface DangerZoneSectionProps {
  onResetWorkspace: () => void;
  onClearAnalysisData: () => void;
}

export function DangerZoneSection({
  onResetWorkspace,
  onClearAnalysisData,
}: DangerZoneSectionProps) {
  const [confirmAction, setConfirmAction] = useState<
    "reset-workspace" | "clear-analysis" | null
  >(null);

  const handleExecute = () => {
    if (confirmAction === "reset-workspace") {
      onResetWorkspace();
    } else if (confirmAction === "clear-analysis") {
      onClearAnalysisData();
    }
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-red-200 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-red-950">
          Danger Zone
        </h2>
        <p className="text-xs text-red-700 mt-1">
          Irreversible actions for resetting demo environment state and clearing local cache.
        </p>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50/30 divide-y divide-red-100 overflow-hidden">
        {/* Action 1: Reset Demo Workspace */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-zinc-950">
              Reset Demo Workspace to Default Benchmark
            </h3>
            <p className="text-xs text-zinc-500">
              Restores standard engineering requisitions, baseline evaluation rules, and default mock team settings.
            </p>
            <span className="text-[10px] text-amber-700 font-medium block">
              ⚠ Affects local demo session state only. No remote data is altered.
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction("reset-workspace")}
            className="h-8 text-xs text-red-700 hover:bg-red-50 border-red-300 shrink-0"
          >
            Reset Workspace
          </Button>
        </div>

        {/* Action 2: Clear Local Analysis Cache */}
        <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="text-xs font-bold text-zinc-950">
              Purge Local Candidate Evaluation Cache
            </h3>
            <p className="text-xs text-zinc-500">
              Clears locally saved recruiter notes, candidate stage overrides, and in-memory comparison selections.
            </p>
            <span className="text-[10px] text-amber-700 font-medium block">
              ⚠ Candidate profiles will re-initialize to their default states on page refresh.
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setConfirmAction("clear-analysis")}
            className="h-8 text-xs text-red-700 hover:bg-red-50 border-red-300 shrink-0"
          >
            Purge Analysis Cache
          </Button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-700">
              <Icons.alertCircle className="h-5 w-5" />
              <h3 className="text-sm font-bold text-zinc-950">
                {confirmAction === "reset-workspace"
                  ? "Confirm Workspace Reset"
                  : "Confirm Cache Purge"}
              </h3>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              {confirmAction === "reset-workspace"
                ? "Are you sure you want to reset all workspace settings, matching weights, and evaluation sensitivity to default values? This action takes effect immediately in your local session."
                : "Are you sure you want to purge local analysis data, recruiter notes, and stage overrides? All evaluation profiles will reload from initial baseline mocks."}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmAction(null)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleExecute}
                className="h-8 text-xs bg-red-700 hover:bg-red-800 text-white"
              >
                {confirmAction === "reset-workspace"
                  ? "Yes, Reset Workspace"
                  : "Yes, Purge Cache"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
