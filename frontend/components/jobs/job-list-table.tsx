import React from "react";
import Link from "next/link";
import { JobRequisition, JobStatus } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getJobStatusBadgeVariant } from "@/lib/mock-jobs";
import { cn } from "@/lib/utils";

interface JobListTableProps {
  requisitions: JobRequisition[];
  selectedJobId?: string | null;
  onSelectJob: (job: JobRequisition) => void;
  onEditJob: (job: JobRequisition) => void;
  onDuplicateJob: (job: JobRequisition) => void;
  onStatusToggle: (job: JobRequisition) => void;
}

export function JobListTable({
  requisitions,
  selectedJobId,
  onSelectJob,
  onEditJob,
  onDuplicateJob,
  onStatusToggle,
}: JobListTableProps) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      {/* Desktop & Tablet Table (md and up) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
              <th className="py-3 px-4">Role & Level</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Requirements</th>
              <th className="py-3 px-4 text-center">Candidates</th>
              <th className="py-3 px-4">Updated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {requisitions.map((job) => {
              const isSelected = selectedJobId === job.id;
              const mustHaves = job.requirements.filter(
                (r) => r.priority === "Must have"
              );
              const nextStatusAction =
                job.status === "Active"
                  ? "Pause"
                  : job.status === "Paused"
                  ? "Activate"
                  : null;

              return (
                <tr
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className={cn(
                    "group cursor-pointer transition-colors hover:bg-zinc-50/80",
                    isSelected && "bg-brand-50/40 hover:bg-brand-50/60"
                  )}
                >
                  {/* Role & Level */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-950 group-hover:text-brand-700 transition-colors">
                          {job.title}
                        </span>
                        <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 border border-zinc-200/80">
                          {job.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <span>{job.employmentType}</span>
                        <span>•</span>
                        <span>{job.minExperienceYears}+ yrs exp</span>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3.5 px-4 font-medium text-zinc-800">
                    {job.department}
                  </td>

                  {/* Location & Arrangement */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col text-[11px]">
                      <span className="text-zinc-800">{job.location}</span>
                      <span className="text-zinc-500">{job.workArrangement}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={getJobStatusBadgeVariant(job.status)}>
                      {job.status}
                    </Badge>
                  </td>

                  {/* Requirements Summary */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-zinc-900">
                        {job.requirements.length} criteria
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        {mustHaves.length} must-have
                      </span>
                    </div>
                  </td>

                  {/* Candidate Count */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-semibold text-zinc-900">
                        {job.candidateCount}
                      </span>
                      <span className="text-[10px] text-zinc-400">evaluated</span>
                    </div>
                  </td>

                  {/* Updated */}
                  <td className="py-3.5 px-4 text-[11px] text-zinc-500 whitespace-nowrap">
                    {job.updatedAt}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSelectJob(job)}
                        className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-900"
                        title="View Requisition Details"
                      >
                        <Icons.eye className="h-3.5 w-3.5" />
                      </Button>

                      {nextStatusAction && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onStatusToggle(job)}
                          className="h-7 px-2 text-[11px] text-zinc-600 hover:text-zinc-900"
                          title={`${nextStatusAction} role`}
                        >
                          {job.status === "Active" ? (
                            <Icons.pause className="h-3 w-3 mr-1" />
                          ) : (
                            <Icons.play className="h-3 w-3 mr-1" />
                          )}
                          <span>{nextStatusAction}</span>
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditJob(job)}
                        className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-900"
                        title="Edit Requisition"
                      >
                        <Icons.edit className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDuplicateJob(job)}
                        className="h-7 w-7 p-0 text-zinc-500 hover:text-zinc-900"
                        title="Duplicate Requisition"
                      >
                        <Icons.copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View (below md) */}
      <div className="md:hidden divide-y divide-zinc-200">
        {requisitions.map((job) => {
          const isSelected = selectedJobId === job.id;
          const mustHaves = job.requirements.filter(
            (r) => r.priority === "Must have"
          );

          return (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className={cn(
                "p-4 transition-colors space-y-3",
                isSelected ? "bg-brand-50/40" : "bg-white hover:bg-zinc-50/60"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                    <span>{job.department}</span>
                    <span>•</span>
                    <span className="font-medium text-zinc-700">
                      {job.level}
                    </span>
                  </div>
                </div>
                <Badge variant={getJobStatusBadgeVariant(job.status)}>
                  {job.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-y border-zinc-100 py-2">
                <div>
                  <span className="text-zinc-400 block text-[11px]">Location</span>
                  <span className="font-medium text-zinc-800">
                    {job.location} ({job.workArrangement})
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">
                    Requirements
                  </span>
                  <span className="font-medium text-zinc-800">
                    {job.requirements.length} total ({mustHaves.length} must)
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">
                    Candidates
                  </span>
                  <span className="font-medium text-zinc-800">
                    {job.candidateCount} evaluated
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[11px]">Updated</span>
                  <span className="font-medium text-zinc-800">
                    {job.updatedAt}
                  </span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div
                className="flex items-center justify-between pt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectJob(job)}
                  className="h-8 text-xs gap-1.5"
                >
                  <Icons.eye className="h-3.5 w-3.5" />
                  <span>Inspect Details</span>
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStatusToggle(job)}
                    className="h-8 px-2 text-xs text-zinc-600"
                  >
                    {job.status === "Active" ? "Pause" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditJob(job)}
                    className="h-8 w-8 p-0 text-zinc-500"
                  >
                    <Icons.edit className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
