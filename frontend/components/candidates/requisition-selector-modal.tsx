import React from "react";
import { JobRequisition } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getJobStatusBadgeVariant } from "@/lib/mock-jobs";

interface RequisitionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  requisitions: JobRequisition[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string | null) => void;
}

export function RequisitionSelectorModal({
  isOpen,
  onClose,
  requisitions,
  selectedJobId,
  onSelectJob,
}: RequisitionSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl border border-zinc-200 bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-zinc-950">
              Select Target Requisition
            </h2>
            <p className="text-xs text-zinc-500">
              Filter and benchmark candidates against specific role criteria.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <Icons.x className="h-4 w-4" />
          </button>
        </div>

        {/* Requisition List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Option: All Requisitions */}
          <div
            onClick={() => {
              onSelectJob(null);
              onClose();
            }}
            className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-colors ${
              selectedJobId === null
                ? "border-brand-500 bg-brand-50/50 shadow-xs"
                : "border-zinc-200 bg-white hover:bg-zinc-50"
            }`}
          >
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-zinc-950">
                  All Active Requisitions
                </span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600">
                  Company Wide
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                View all candidate profiles across every open hiring requisition.
              </p>
            </div>
            {selectedJobId === null && (
              <span className="text-xs font-semibold text-brand-700">
                Selected
              </span>
            )}
          </div>

          {/* Individual Requisitions */}
          {requisitions.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <div
                key={job.id}
                onClick={() => {
                  onSelectJob(job.id);
                  onClose();
                }}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-colors ${
                  isSelected
                    ? "border-brand-500 bg-brand-50/50 shadow-xs"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-950">
                      {job.title}
                    </span>
                    <Badge variant={getJobStatusBadgeVariant(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span>{job.level}</span>
                    <span>•</span>
                    <span>
                      {job.location} ({job.workArrangement})
                    </span>
                    <span>•</span>
                    <span>{job.requirements.length} requirements</span>
                  </div>
                </div>

                <div className="text-right">
                  {isSelected ? (
                    <span className="text-xs font-semibold text-brand-700">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-400">
                      {job.candidateCount} candidates
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-zinc-200 px-6 py-3 bg-zinc-50/50">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
