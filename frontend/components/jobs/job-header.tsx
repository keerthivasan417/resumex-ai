import React from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface JobHeaderProps {
  totalCount: number;
  activeCount: number;
  onCreateRequisition: () => void;
}

export function JobHeader({
  totalCount,
  activeCount,
  onCreateRequisition,
}: JobHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Job Requisitions
          </h1>
          <div className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs text-zinc-600">
            <span className="font-semibold text-zinc-900">{totalCount}</span>
            <span>roles</span>
            <span className="text-zinc-300">•</span>
            <span className="font-medium text-emerald-700">{activeCount} active</span>
          </div>
        </div>
        <p className="mt-1 text-sm text-zinc-500">
          Manage target roles and their requirements for candidate evaluation.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onCreateRequisition}
          className="gap-2 shadow-xs"
          size="sm"
        >
          <Icons.plus className="h-4 w-4" />
          <span>Create Requisition</span>
        </Button>
      </div>
    </div>
  );
}
