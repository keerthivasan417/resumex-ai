"use client";

import * as React from "react";
import Link from "next/link";
import { SkillItem } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { getStatusBadgeVariant } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

interface EvidenceDetailPanelProps {
  skill: SkillItem;
  onClose?: () => void;
  showLedgerLink?: boolean;
}

export function EvidenceDetailPanel({
  skill,
  onClose,
  showLedgerLink = false,
}: EvidenceDetailPanelProps) {
  const sourcesList = [
    { key: "skillsSection", ...skill.sources.skillsSection },
    { key: "project", ...skill.sources.project },
    { key: "experience", ...skill.sources.experience },
    { key: "certification", ...skill.sources.certification },
    { key: "github", ...skill.sources.github },
  ];

  return (
    <div className="space-y-6">
      {/* Panel Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
              {skill.name}
            </h2>
            <Badge variant="neutral" className="text-xs font-mono">
              {skill.category}
            </Badge>
            <Badge variant={getStatusBadgeVariant(skill.status)} className="text-xs">
              {skill.status}
            </Badge>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            Evidence Strength:{" "}
            <span
              className={cn(
                "font-semibold",
                skill.strength === "High" && "text-emerald-700",
                skill.strength === "Moderate" && "text-brand-700",
                skill.strength === "Low" && "text-amber-700",
                skill.strength === "None" && "text-zinc-400"
              )}
            >
              {skill.strength}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {showLedgerLink && (
            <Link href={`/app/evidence?skill=${skill.id}`}>
              <Button size="sm" variant="outline" className="text-xs">
                Open in Ledger
                <Icons.arrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md hover:bg-zinc-100 transition-colors"
              aria-label="Close panel"
            >
              <Icons.x className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Explanation Callout */}
      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 space-y-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Deterministic Verification Audit
        </span>
        <p className="text-xs text-zinc-700 leading-relaxed font-mono">
          &ldquo;{skill.explanation}&rdquo;
        </p>
      </div>

      {/* Extracted Claim (if present) */}
      {skill.extractedClaim && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Extracted Resume Claim
          </span>
          <div className="rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-800 italic border-l-2 border-l-brand-600">
            &ldquo;{skill.extractedClaim}&rdquo;
          </div>
        </div>
      )}

      {/* Evidence Sources Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900 font-mono">
            Evidence Sources Audit
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            5 Channels Scanned
          </span>
        </div>

        <div className="divide-y divide-zinc-200 rounded-md border border-zinc-200 bg-white overflow-hidden text-xs">
          {sourcesList.map((src) => (
            <div
              key={src.key}
              className="flex items-start justify-between gap-3 p-3.5 transition-colors hover:bg-zinc-50/60"
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold mt-0.5",
                    src.present
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-zinc-100 text-zinc-400"
                  )}
                >
                  {src.present ? "✓" : "✕"}
                </div>
                <div>
                  <p className="font-semibold text-zinc-900">{src.label}</p>
                  <p className="text-zinc-500 mt-0.5">{src.detail}</p>
                  {src.citation && (
                    <p className="text-[11px] font-mono text-brand-800 mt-1">
                      Ref: {src.citation}
                    </p>
                  )}
                </div>
              </div>

              <Badge
                variant={src.present ? "success" : "neutral"}
                className="text-[10px] shrink-0 font-mono"
              >
                {src.present ? "Present" : "Absent"}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Verifiable Code / Repository Artifact */}
      {skill.sampleCodeOrCommit && (
        <Card className="border-brand-200/80 bg-brand-50/30">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-900">
                <Icons.gitBranch className="h-4 w-4 text-brand-700" />
                <CardTitle className="text-xs font-semibold font-mono">
                  {skill.sampleCodeOrCommit.repo}
                </CardTitle>
              </div>
              {skill.sampleCodeOrCommit.commitHash && (
                <Badge variant="brand" className="text-[10px] font-mono">
                  commit {skill.sampleCodeOrCommit.commitHash}
                </Badge>
              )}
            </div>
            {skill.sampleCodeOrCommit.description && (
              <CardDescription className="text-xs text-zinc-600 mt-1 font-mono">
                {skill.sampleCodeOrCommit.description}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
