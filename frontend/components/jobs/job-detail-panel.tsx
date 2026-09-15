import React from "react";
import Link from "next/link";
import { JobRequisition } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  getJobStatusBadgeVariant,
  getPriorityBadgeVariant,
} from "@/lib/mock-jobs";

interface JobDetailPanelProps {
  job: JobRequisition | null;
  onClose: () => void;
  onEdit: (job: JobRequisition) => void;
  onDuplicate: (job: JobRequisition) => void;
  onStatusToggle: (job: JobRequisition) => void;
}

export function JobDetailPanel({
  job,
  onClose,
  onEdit,
  onDuplicate,
  onStatusToggle,
}: JobDetailPanelProps) {
  if (!job) return null;

  const mustHaves = job.requirements.filter((r) => r.priority === "Must have");
  const preferred = job.requirements.filter((r) => r.priority === "Preferred");
  const niceToHave = job.requirements.filter(
    (r) => r.priority === "Nice to have"
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/30 backdrop-blur-2xs animate-in fade-in duration-150">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Content Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-2xl flex-col bg-white border-l border-zinc-200 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="border-b border-zinc-200 p-6 pb-5 space-y-3 bg-zinc-50/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant={getJobStatusBadgeVariant(job.status)}>
                  {job.status}
                </Badge>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs text-zinc-500">{job.department}</span>
                <span className="text-xs text-zinc-400">•</span>
                <span className="rounded bg-zinc-100 px-1.5 py-0.2 text-[10px] font-medium text-zinc-700 border border-zinc-200">
                  {job.level}
                </span>
              </div>

              <h2 className="mt-2 text-xl font-bold tracking-tight text-zinc-950">
                {job.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"
            >
              <Icons.x className="h-5 w-5" />
            </button>
          </div>

          {/* Metadata badges strip */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 pt-1">
            <span className="flex items-center gap-1.5">
              <Icons.mapPin className="h-3.5 w-3.5 text-zinc-400" />
              {job.location} ({job.workArrangement})
            </span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-1.5">
              <Icons.briefcase className="h-3.5 w-3.5 text-zinc-400" />
              {job.employmentType}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="flex items-center gap-1.5">
              <Icons.clock className="h-3.5 w-3.5 text-zinc-400" />
              {job.minExperienceYears}+ years experience required
            </span>
          </div>

          {/* Top Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-200/80">
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(job)}
                className="h-8 gap-1.5 text-xs"
              >
                <Icons.edit className="h-3.5 w-3.5 text-zinc-500" />
                <span>Edit</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(job)}
                className="h-8 gap-1.5 text-xs"
              >
                <Icons.copy className="h-3.5 w-3.5 text-zinc-500" />
                <span>Duplicate</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusToggle(job)}
                className="h-8 gap-1 text-xs text-zinc-700 hover:text-zinc-950"
              >
                {job.status === "Active" ? (
                  <>
                    <Icons.pause className="h-3.5 w-3.5 text-amber-600" />
                    <span>Pause Role</span>
                  </>
                ) : (
                  <>
                    <Icons.play className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Activate Role</span>
                  </>
                )}
              </Button>
            </div>

            {/* Navigation links */}
            <div className="flex items-center gap-2">
              <Link href={`/app/matches?jobId=${job.id}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1 text-xs text-brand-700 border-brand-200 hover:bg-brand-50"
                >
                  <Icons.barChart className="h-3.5 w-3.5" />
                  <span>View Matching</span>
                </Button>
              </Link>

              <Link href={`/app/candidates?jobId=${job.id}`}>
                <Button
                  size="sm"
                  className="h-8 gap-1 text-xs"
                >
                  <Icons.users className="h-3.5 w-3.5" />
                  <span>View Candidates ({job.candidateCount})</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Candidate Pipeline Summary Card */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-900 block">
                  Candidate Pipeline Benchmark
                </span>
                <span className="text-xs text-zinc-500">
                  Real-time evidence verification and match scoring against this profile
                </span>
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                Live Alignment
              </span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3 border-t border-zinc-200 pt-3 text-center">
              <div>
                <span className="block text-xl font-bold text-zinc-900">
                  {job.candidateCount}
                </span>
                <span className="text-[11px] text-zinc-500">Candidates Evaluated</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-brand-700">
                  {job.shortlistCount}
                </span>
                <span className="text-[11px] text-zinc-500">Shortlisted for Review</span>
              </div>
              <div>
                <span className="block text-xl font-bold text-zinc-900">
                  {job.requirements.length}
                </span>
                <span className="text-[11px] text-zinc-500">Evaluation Criteria</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Role Overview
            </h3>
            <p className="text-xs leading-relaxed text-zinc-700 whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Key Responsibilities
              </h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2.5 text-xs text-zinc-700"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements & Criteria */}
          <div className="space-y-4 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Required Technical Evidence ({job.requirements.length} Skills)
              </h3>
              <span className="text-[11px] text-zinc-400">
                Used to compute verified claim coverage
              </span>
            </div>

            {/* Must Have */}
            {mustHaves.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                  <span className="h-2 w-2 rounded-full bg-brand-600" />
                  <span>Must-Have Skills ({mustHaves.length})</span>
                </div>
                <div className="space-y-1.5">
                  {mustHaves.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-md border border-brand-200/80 bg-brand-50/40 p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-brand-950">
                          {req.name}
                        </span>
                        <Badge variant="brand">Must have</Badge>
                      </div>
                      {req.description && (
                        <p className="mt-1 text-[11px] text-brand-900/80">
                          {req.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preferred */}
            {preferred.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                  <span className="h-2 w-2 rounded-full bg-zinc-500" />
                  <span>Preferred Skills ({preferred.length})</span>
                </div>
                <div className="space-y-1.5">
                  {preferred.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-md border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-900">
                          {req.name}
                        </span>
                        <Badge variant="neutral">Preferred</Badge>
                      </div>
                      {req.description && (
                        <p className="mt-1 text-[11px] text-zinc-600">
                          {req.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nice to have */}
            {niceToHave.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                  <span className="h-2 w-2 rounded-full bg-zinc-300" />
                  <span>Nice-to-Have Skills ({niceToHave.length})</span>
                </div>
                <div className="space-y-1.5">
                  {niceToHave.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-md border border-zinc-200 bg-white p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-zinc-800">
                          {req.name}
                        </span>
                        <Badge variant="outline">Nice to have</Badge>
                      </div>
                      {req.description && (
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {req.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-zinc-200 px-6 py-3.5 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Requisition ID: {job.id}</span>
          <span>Last modified: {job.updatedAt}</span>
        </div>
      </div>
    </div>
  );
}
