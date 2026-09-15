import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShortlistEntry } from "@/types/shortlist";
import { PipelineStage } from "@/types/candidate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  getStageBadgeVariant,
  getEvaluationStatusBadgeVariant,
  getEvidenceStrengthBadgeVariant,
} from "@/lib/mock-candidates";
import { cn } from "@/lib/utils";

interface ShortlistDetailPanelProps {
  entry: ShortlistEntry | null;
  onClose: () => void;
  onStageChange: (entryId: string, stage: PipelineStage) => void;
  onNotesChange: (entryId: string, notes: string) => void;
  onRemoveFromShortlist: (entryId: string) => void;
}

const STAGES: PipelineStage[] = [
  "Screening",
  "Technical Review",
  "Interview",
  "Shortlisted",
  "Rejected",
];

export function ShortlistDetailPanel({
  entry,
  onClose,
  onStageChange,
  onNotesChange,
  onRemoveFromShortlist,
}: ShortlistDetailPanelProps) {
  const [notesText, setNotesText] = useState("");
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  useEffect(() => {
    if (entry) {
      setNotesText(entry.recruiterNotes || "");
      setIsSavedNotice(false);
    }
  }, [entry]);

  if (!entry) return null;

  const { candidate } = entry;

  const handleSaveNotes = () => {
    onNotesChange(entry.id, notesText);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

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
                <span className="rounded bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                  <Icons.bookmark className="h-3 w-3 fill-amber-600 text-amber-600" />
                  Shortlisted Candidate
                </span>
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
                <Badge variant={getStageBadgeVariant(entry.pipelineStage)}>
                  {entry.pipelineStage}
                </Badge>
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

          {/* Quick Action Strip & Stage Selector */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-200/70 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-700">Advance Stage:</span>
              <div className="relative">
                <select
                  value={entry.pipelineStage}
                  onChange={(e) =>
                    onStageChange(entry.id, e.target.value as PipelineStage)
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

            <div className="flex items-center gap-2">
              <Link href={`/app/candidates?jobId=${entry.targetJobId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-zinc-600 hover:text-zinc-950"
                >
                  <Icons.users className="h-3.5 w-3.5 mr-1" />
                  <span>View in Pool</span>
                </Button>
              </Link>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onRemoveFromShortlist(entry.id);
                  onClose();
                }}
                className="h-8 text-xs text-red-600 hover:bg-red-50 border-red-200"
              >
                <Icons.trash className="h-3.5 w-3.5 mr-1" />
                <span>Remove from Shortlist</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SECTION 1: RECRUITER NOTES (Interactive & Editable) */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/40 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Icons.edit className="h-4 w-4 text-amber-700" />
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                  Recruiter Review Notes (Local Session)
                </span>
              </div>
              {isSavedNotice && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 animate-in fade-in">
                  ✓ Notes Saved
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add key observations, compensation expectations, or focus questions for the interview panel..."
              className="w-full rounded-md border border-amber-300 bg-white p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 leading-relaxed"
            />

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400">
                Notes persist in local state for your review session.
              </span>
              <Button
                size="sm"
                onClick={handleSaveNotes}
                className="h-7 text-xs bg-amber-700 hover:bg-amber-800 text-white"
              >
                Save Notes
              </Button>
            </div>
          </div>

          {/* SECTION 2: MATCH OVERVIEW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Match Diagnostics & Compatibility
              </h3>
              <span className="text-xs text-zinc-400">
                Target Role: {entry.targetJob.title}
              </span>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "flex h-16 w-16 flex-col items-center justify-center rounded-lg border font-mono font-bold text-xl",
                    entry.matchScore >= 85
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : entry.matchScore >= 70
                      ? "border-brand-200 bg-brand-50 text-brand-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  )}
                >
                  <span>{entry.matchScore}%</span>
                  <span className="text-[9px] uppercase font-sans font-medium text-zinc-400">
                    Match
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-semibold text-zinc-950 block">
                    {candidate.matchSummary.scoreLabel}
                  </span>
                  <p className="text-xs text-zinc-600 max-w-lg leading-relaxed">
                    {candidate.matchSummary.summaryNote}
                  </p>
                </div>
              </div>

              {/* 4 Pillars Matrix */}
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 border-t border-zinc-200 pt-3 text-center">
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Skill Coverage
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {entry.skillCoverage}
                  </span>
                </div>
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Evidence Strength
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {entry.evidenceStrength}
                  </span>
                </div>
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Project Relevance
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {entry.projectRelevance}
                  </span>
                </div>
                <div className="rounded bg-white p-2 border border-zinc-100">
                  <span className="text-[10px] uppercase font-semibold text-zinc-400 block">
                    Experience Match
                  </span>
                  <span className="text-xs font-semibold text-zinc-900 mt-0.5 block">
                    {candidate.experienceYears >= entry.targetJob.minExperienceYears
                      ? "Exceeds Baseline"
                      : "Below Target"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SKILLS BREAKDOWN */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Technical Skill Evidence Spectrum
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

          {/* SECTION 4: PROJECTS & PROFILE */}
          {candidate.projects && candidate.projects.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Verified Production Projects
                </h3>
                <Link href="/app/profile">
                  <span className="text-xs text-brand-700 hover:underline flex items-center gap-1">
                    <Icons.code className="h-3 w-3" />
                    Open Developer Profile
                  </span>
                </Link>
              </div>

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
                        ⚡ {proj.metrics}
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
              Evaluation Decision & Verification Focus
            </h3>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                    <span>✓</span> Confirmed Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-700">
                    {entry.strengths.map((str, idx) => (
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
                    <span>⚠</span> Known Concerns / Gaps
                  </span>
                  {entry.concerns.length === 0 ? (
                    <p className="text-xs text-zinc-400 italic">
                      No concerns flagged.
                    </p>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-zinc-700">
                      {entry.concerns.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-600 shrink-0">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Verification Topics */}
              {entry.verificationTopics.length > 0 && (
                <div className="space-y-1.5 border-t border-zinc-200 pt-3">
                  <span className="text-xs font-semibold text-zinc-800 block">
                    Interview Panel Verification Topics:
                  </span>
                  <ul className="space-y-1 text-xs text-zinc-600">
                    {entry.verificationTopics.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-brand-600 shrink-0">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Next Step */}
              <div className="rounded-md border border-brand-200 bg-white p-3 space-y-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                  Recommended Next Step
                </span>
                <p className="text-xs font-semibold text-zinc-900">
                  {candidate.decisionNotes.recommendedNextStep}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-zinc-100">
                  <Button
                    size="sm"
                    onClick={() =>
                      onStageChange(entry.id, "Technical Review")
                    }
                    className="h-8 text-xs"
                  >
                    Move to Technical Review
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onStageChange(entry.id, "Interview")}
                    className="h-8 text-xs"
                  >
                    Move to Interview Loop
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onStageChange(entry.id, "Rejected")}
                    className="h-8 text-xs text-zinc-500 hover:text-red-700"
                  >
                    Do Not Advance
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: CROSS MODULE NAVIGATION */}
          <div className="rounded-lg border border-brand-200 bg-brand-50/50 p-3.5 space-y-2">
            <span className="text-xs font-semibold text-brand-900 block">
              Direct Module Verification Links:
            </span>
            <div className="flex flex-wrap items-center gap-2">
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
              <Link href="/app/candidates">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs bg-white text-zinc-700 hover:text-brand-700"
                >
                  <Icons.users className="h-3 w-3 mr-1 text-brand-600" />
                  <span>Candidate Pool</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-zinc-200 px-6 py-3 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
          <span>Shortlist ID: {entry.id}</span>
          <span>Added: {entry.shortlistedAt}</span>
        </div>
      </div>
    </div>
  );
}
