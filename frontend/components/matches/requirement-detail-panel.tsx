"use client";

import * as React from "react";
import Link from "next/link";
import { JobRequirement } from "@/types/matching";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { getAlignmentStatusBadgeVariant } from "@/lib/mock-matching";
import { cn } from "@/lib/utils";

interface RequirementDetailPanelProps {
  requirement: JobRequirement;
  onClose?: () => void;
}

export function RequirementDetailPanel({
  requirement,
  onClose,
}: RequirementDetailPanelProps) {
  const sourcesList = [
    { label: "Skills Section", present: requirement.evidence.skillsSection },
    { label: "Project Artifacts", present: requirement.evidence.project },
    { label: "Employment Experience", present: requirement.evidence.experience },
    { label: "Certifications", present: requirement.evidence.certification },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold tracking-tight text-zinc-950">
              {requirement.name}
            </h3>
            <Badge variant="neutral" className="text-xs font-mono">
              {requirement.category}
            </Badge>
            <Badge
              variant={getAlignmentStatusBadgeVariant(requirement.status)}
              className="text-xs"
            >
              {requirement.status}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            Requisition Priority:{" "}
            <span className="font-semibold text-zinc-800">
              {requirement.priority}
            </span>
          </p>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
            aria-label="Close detail panel"
          >
            <Icons.x className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Target Job Expectation */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Target Job Expectation
        </span>
        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5 text-xs text-zinc-800 italic border-l-2 border-l-brand-600">
          &ldquo;{requirement.jobDescriptionSnippet}&rdquo;
        </div>
      </div>

      {/* Candidate Evidence Checklist */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 font-mono">
          Candidate Evidence Checklist
        </span>

        <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white overflow-hidden text-xs">
          {sourcesList.map((src) => (
            <div
              key={src.label}
              className="flex items-center justify-between p-3 transition-colors hover:bg-zinc-50/50"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                    src.present
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-zinc-100 text-zinc-400"
                  )}
                >
                  {src.present ? "✓" : "✕"}
                </span>
                <span className="font-medium text-zinc-800">{src.label}</span>
              </div>
              <Badge
                variant={src.present ? "success" : "neutral"}
                className="text-[10px] font-mono px-2 py-0"
              >
                {src.present ? "Verified" : "Unidentified"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Related Candidate Projects */}
      {requirement.relatedProjects && requirement.relatedProjects.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Related Candidate Projects
          </span>
          <div className="rounded-md border border-zinc-200 bg-white p-3 space-y-1.5 text-xs">
            {requirement.relatedProjects.map((p) => (
              <div key={p} className="flex items-center gap-2 text-zinc-700">
                <Icons.code className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                <span className="font-mono text-xs">{p}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alignment Audit Explanation */}
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-1.5 text-xs">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Alignment Rationale
        </span>
        <p className="text-zinc-700 leading-relaxed font-mono">
          &ldquo;{requirement.explanation}&rdquo;
        </p>
      </div>

      {/* Navigation Actions to existing frontend routes */}
      <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {requirement.candidateSkillId && (
            <Link href={`/app/evidence?skill=${requirement.candidateSkillId}`}>
              <Button size="sm" variant="default" className="text-xs">
                <Icons.checkCircle className="mr-1.5 h-3.5 w-3.5" />
                View in Evidence Ledger
              </Button>
            </Link>
          )}

          <Link href="/app/skills">
            <Button size="sm" variant="outline" className="text-xs">
              <Icons.cpu className="mr-1.5 h-3.5 w-3.5 text-zinc-500" />
              View in Skills Workspace
            </Button>
          </Link>
        </div>

        {onClose && (
          <Button size="sm" variant="ghost" onClick={onClose} className="text-xs text-zinc-500">
            Close Panel
          </Button>
        )}
      </div>
    </div>
  );
}
