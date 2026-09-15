import React from "react";
import Link from "next/link";
import { Candidate, PipelineStage } from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  getStageBadgeVariant,
  getEvaluationStatusBadgeVariant,
  getEvidenceStrengthBadgeVariant,
} from "@/lib/mock-candidates";
import { cn } from "@/lib/utils";

interface CandidateDetailPanelProps {
  candidate: Candidate | null;
  onClose: () => void;
  onStageChange: (candidateId: string, stage: PipelineStage) => void;
  onToggleShortlist: (candidateId: string) => void;
}

const STAGES: PipelineStage[] = [
  "New",
  "Screening",
  "Technical Review",
  "Interview",
  "Shortlisted",
  "Rejected",
];

export function CandidateDetailPanel({
  candidate,
  onClose,
  onStageChange,
  onToggleShortlist,
}: CandidateDetailPanelProps) {
  if (!candidate) return null;

  const matchedSkills = candidate.keySkills.filter(
    (s) => s.status === "Matched"
  );
  const supportedSkills = candidate.keySkills.filter(
    (s) => s.status === "Supported"
  );
  const needsVerificationSkills = candidate.keySkills.filter(
    (s) => s.status === "Needs verification"
  );
  const missingSkills = candidate.keySkills.filter(
    (s) => s.status === "Missing"
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/30 backdrop-blur-2xs animate-in fade-in duration-150">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Content Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-3xl flex-col bg-white border-l border-zinc-200 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="border-b border-zinc-200 p-6 pb-4 space-y-3 bg-zinc-50/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={getStageBadgeVariant(candidate.pipelineStage)}
                >
                  {candidate.pipelineStage}
                </Badge>
                <span className="text-xs text-zinc-400">•</span>
                <span className="text-xs text-zinc-500 font-medium">
                  {candidate.currentRole}
                </span>
                <span className="text-zinc-400">•</span>
                <span className="text-xs text-zinc-500">
                  {candidate.experience}
                </span>
              </div>

              <h2 className="mt-1.5 text-xl font-bold tracking-tight text-zinc-950 flex items-center gap-2">
                <span>{candidate.name}</span>
                {candidate.isShortlisted && (
                  <span
                    className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200"
                    title="Shortlisted candidate"
                  >
                    <Icons.bookmark className="h-3 w-3 fill-amber-500 text-amber-500" />
                    Shortlisted
                  </span>
                )}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700"
              title="Close drawer"
            >
              <Icons.x className="h-5 w-5" />
            </button>
          </div>

          {/* Contact & Links Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-zinc-600 border-t border-zinc-200/70">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5">
                <Icons.mapPin className="h-3.5 w-3.5 text-zinc-400" />
                {candidate.location}
              </span>
              <span className="text-zinc-300">•</span>
              <span>{candidate.email}</span>
              {candidate.phone && (
                <>
                  <span className="text-zinc-300">•</span>
                  <span>{candidate.phone}</span>
                </>
              )}
            </div>

            {/* Profile & Resume Links */}
            <div className="flex items-center gap-2">
              {candidate.profileLinks.github && (
                <a
                  href={candidate.profileLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-brand-600 flex items-center gap-1"
                >
                  <Icons.code className="h-3.5 w-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {candidate.profileLinks.linkedin && (
                <a
                  href={candidate.profileLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-zinc-500 hover:text-brand-600 flex items-center gap-1"
                >
                  <Icons.externalLink className="h-3.5 w-3.5" />
                  <span>LinkedIn</span>
                </a>
              )}
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600 border border-zinc-200">
                📄 {candidate.resumeFile.name}
              </span>
            </div>
          </div>

          {/* Quick Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700">
                Stage:
              </span>
              <div className="relative">
                <select
                  value={candidate.pipelineStage}
                  onChange={(e) =>
                    onStageChange(
                      candidate.id,
                      e.target.value as PipelineStage
                    )
                  }
                  className="h-8 appearance-none rounded-md border border-zinc-200 bg-white pl-2.5 pr-7 text-xs font-medium text-zinc-800 shadow-2xs hover:bg-zinc-50 focus:border-brand-500 focus:outline-none"
                >
                  {STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <Icons.chevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            <Button
              variant={candidate.isShortlisted ? "default" : "outline"}
              size="sm"
              onClick={() => onToggleShortlist(candidate.id)}
              className={cn(
                "h-8 gap-1.5 text-xs shadow-2xs",
                candidate.isShortlisted &&
                  "bg-amber-600 hover:bg-amber-700 text-white"
              )}
            >
              <Icons.bookmark
                className={cn(
                  "h-3.5 w-3.5",
                  candidate.isShortlisted && "fill-white"
                )}
              />
              <span>
                {candidate.isShortlisted
                  ? "In Shortlist"
                  : "Add to Shortlist"}
              </span>
            </Button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: MATCH OVERVIEW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                1. Match Overview & Diagnostic Scores
              </h3>
              <span className="text-[11px] text-zinc-400">
                Benchmarked against active target requisition
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-14 w-14 flex-col items-center justify-center rounded-lg border font-mono font-bold text-lg",
                      candidate.matchSummary.score >= 85
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : candidate.matchSummary.score >= 70
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    )}
                  >
                    <span>{candidate.matchSummary.score}%</span>
                    <span className="text-[9px] uppercase font-sans font-medium text-zinc-400">
                      Match
                    </span>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-zinc-950 block">
                      {candidate.matchSummary.scoreLabel}
                    </span>
                    <p className="text-xs text-zinc-600 max-w-md mt-0.5 leading-relaxed">
                      {candidate.matchSummary.summaryNote}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-200">
                  <span className="text-xs text-zinc-500 block">
                    Applied: {candidate.appliedAt}
                  </span>
                  <span className="text-xs text-zinc-400 block">
                    Active: {candidate.lastActive}
                  </span>
                </div>
              </div>

              {/* 4 Pillars Matrix */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-zinc-200 pt-3 text-center">
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Skill Coverage
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {candidate.skillCoverage}
                  </span>
                </div>
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Evidence Strength
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {candidate.evidenceStrength}
                  </span>
                </div>
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Project Relevance
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {candidate.projectRelevance}
                  </span>
                </div>
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Experience Match
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {candidate.experienceYears >= 4
                      ? "Exceeds Baseline"
                      : "Below Target"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: KEY SKILLS BREAKDOWN */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              2. Key Skills & Evidence Spectrum
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Matched / Supported */}
              <div className="rounded-lg border border-zinc-200 bg-white p-3 space-y-2">
                <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  Matched & Supported ({matchedSkills.length + supportedSkills.length})
                </span>
                <div className="space-y-1.5">
                  {[...matchedSkills, ...supportedSkills].map((sk) => (
                    <div
                      key={sk.name}
                      className="rounded border border-zinc-100 bg-zinc-50 p-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-900">
                          {sk.name}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {sk.status}
                        </span>
                      </div>
                      {sk.evidenceSnippet && (
                        <p className="mt-0.5 text-[10px] text-zinc-500 leading-tight">
                          {sk.evidenceSnippet}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Needs Verification */}
              <div className="rounded-lg border border-zinc-200 bg-white p-3 space-y-2">
                <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Needs Verification ({needsVerificationSkills.length})
                </span>
                {needsVerificationSkills.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic py-1">
                    No unverified skills.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {needsVerificationSkills.map((sk) => (
                      <div
                        key={sk.name}
                        className="rounded border border-amber-100 bg-amber-50/50 p-1.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-zinc-900">
                            {sk.name}
                          </span>
                          <span className="text-[10px] text-amber-700 font-medium">
                            Verify
                          </span>
                        </div>
                        {sk.evidenceSnippet && (
                          <p className="mt-0.5 text-[10px] text-zinc-600 leading-tight">
                            {sk.evidenceSnippet}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Missing Requirements */}
              <div className="rounded-lg border border-zinc-200 bg-white p-3 space-y-2">
                <span className="text-xs font-semibold text-zinc-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-300" />
                  Missing Requirements ({missingSkills.length})
                </span>
                {missingSkills.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic py-1">
                    All requirements met.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {missingSkills.map((sk) => (
                      <div
                        key={sk.name}
                        className="rounded border border-zinc-200/80 bg-zinc-50 p-1.5 text-xs text-zinc-600"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-zinc-700">
                            {sk.name}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            Missing
                          </span>
                        </div>
                        {sk.evidenceSnippet && (
                          <p className="mt-0.5 text-[10px] text-zinc-400 leading-tight">
                            {sk.evidenceSnippet}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: EVIDENCE FLAGS & DEEP LINKS */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                3. Evidence Flags & Claim Ledger
              </h3>
              <span className="text-[11px] text-zinc-400">
                Verified claims from codebase & resume
              </span>
            </div>

            <div className="space-y-2">
              {candidate.verificationFlags.map((flag) => (
                <div
                  key={flag.id}
                  className="flex items-start gap-2.5 rounded-lg border border-zinc-200 bg-white p-3 text-xs"
                >
                  <span className="mt-0.5 shrink-0 text-sm">
                    {flag.status === "strong" ? (
                      <span className="text-emerald-600 font-bold">✓</span>
                    ) : flag.status === "supported" ? (
                      <span className="text-brand-600 font-bold">✓</span>
                    ) : flag.status === "warning" ? (
                      <span className="text-amber-500 font-bold">⚠</span>
                    ) : (
                      <span className="text-zinc-400 font-bold">✕</span>
                    )}
                  </span>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">
                        {flag.skill} — {flag.label}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-medium px-1.5 py-0.2 rounded uppercase",
                          flag.status === "strong"
                            ? "bg-emerald-50 text-emerald-700"
                            : flag.status === "supported"
                            ? "bg-brand-50 text-brand-700"
                            : flag.status === "warning"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-zinc-100 text-zinc-600"
                        )}
                      >
                        {flag.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600 leading-normal">
                      {flag.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Cross-Navigation to ResumeX Analysis Modules */}
            <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-3">
              <span className="text-[11px] font-semibold text-brand-900 block mb-2">
                Inspect Raw Verification Evidence Across ResumeX:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Link href="/app/skills">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white text-zinc-700 hover:text-brand-700"
                  >
                    <Icons.cpu className="h-3 w-3 mr-1 text-brand-600" />
                    <span>Skills Workspace</span>
                  </Button>
                </Link>
                <Link href="/app/evidence">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white text-zinc-700 hover:text-brand-700"
                  >
                    <Icons.shieldCheck className="h-3 w-3 mr-1 text-brand-600" />
                    <span>Evidence Ledger</span>
                  </Button>
                </Link>
                <Link href="/app/matches">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white text-zinc-700 hover:text-brand-700"
                  >
                    <Icons.barChart className="h-3 w-3 mr-1 text-brand-600" />
                    <span>Job Matching</span>
                  </Button>
                </Link>
                <Link href="/app/profile">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white text-zinc-700 hover:text-brand-700"
                  >
                    <Icons.code className="h-3 w-3 mr-1 text-brand-600" />
                    <span>Developer Profile</span>
                  </Button>
                </Link>
                <Link href="/app/reports">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs bg-white text-zinc-700 hover:text-brand-700"
                  >
                    <Icons.fileText className="h-3 w-3 mr-1 text-brand-600" />
                    <span>Evaluation Report</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* SECTION 4: PROJECTS */}
          {candidate.projects && candidate.projects.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                4. Verified Production Projects
              </h3>
              <div className="space-y-2.5">
                {candidate.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-lg border border-zinc-200 bg-white p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-xs text-zinc-950">
                          {proj.title}
                        </span>
                        <span className="text-[11px] text-zinc-500 ml-2">
                          ({proj.role})
                        </span>
                      </div>
                      <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 border border-zinc-200">
                        {proj.relevance} Relevance
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {proj.description}
                    </p>
                    {proj.metrics && (
                      <p className="text-[11px] font-medium text-brand-700">
                        ⚡ Impact: {proj.metrics}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded bg-zinc-100 px-2 py-0.5 text-[10px] font-mono text-zinc-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: DECISION AREA */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              5. Recruiter Decision & Recommended Action
            </h3>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 space-y-4">
              {/* Strengths & Concerns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <span className="font-bold">✓</span> Key Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    {candidate.decisionNotes.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 shrink-0">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Concerns */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                    <span className="font-bold">⚠</span> Potential Concerns
                  </span>
                  {candidate.decisionNotes.concerns.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">
                      No red flags identified.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      {candidate.decisionNotes.concerns.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 shrink-0">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Verification Items */}
              {candidate.decisionNotes.verificationItems.length > 0 && (
                <div className="space-y-1.5 border-t border-zinc-200 pt-3">
                  <span className="text-xs font-semibold text-zinc-800 block">
                    Recommended Verification Topics for Interview Panel:
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-600">
                    {candidate.decisionNotes.verificationItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-brand-600 shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Next Step Banner */}
              <div className="rounded-md border border-brand-200 bg-white p-3 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Recommended Pipeline Action
                </span>
                <p className="text-xs font-semibold text-zinc-900">
                  {candidate.decisionNotes.recommendedNextStep}
                </p>

                {/* Stage Progression Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100">
                  <Button
                    size="sm"
                    onClick={() =>
                      onStageChange(candidate.id, "Technical Review")
                    }
                    className="h-8 text-xs"
                  >
                    Advance to Technical Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStageChange(candidate.id, "Interview")}
                    className="h-8 text-xs"
                  >
                    Move to Interview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStageChange(candidate.id, "Rejected")}
                    className="h-8 text-xs text-zinc-500 hover:text-red-700"
                  >
                    Reject Candidate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-zinc-200 px-6 py-3 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Candidate ID: {candidate.id}</span>
          <span>Target Requisition: {candidate.targetJobId}</span>
        </div>
      </div>
    </div>
  );
}
