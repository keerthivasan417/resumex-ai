"use client";

import * as React from "react";
import { ApiError, getSkillGap, runScreening } from "@/lib/api/client";
import { getStoredResumeId } from "@/lib/resume-session";
import { presentMatchingReport } from "@/lib/matching-presentation";
import type { MatchingReport, JobRequirement } from "@/types/matching";
import { MatchHeader } from "@/components/matches/match-header";
import { MatchSummaryArea } from "@/components/matches/match-summary-area";
import { RequirementsAlignmentList } from "@/components/matches/requirements-alignment-list";
import { RequirementDetailPanel } from "@/components/matches/requirement-detail-panel";
import { SkillGapSection } from "@/components/matches/skill-gap-section";
import { NoJobEmptyState } from "@/components/matches/no-job-empty-state";
import { Button } from "@/components/ui/button";

export default function MatchesPage() {
  const [resumeId, setResumeId] = React.useState<string | null>(null);
  const [jobIdInput, setJobIdInput] = React.useState("");
  const [report, setReport] = React.useState<MatchingReport | null>(null);
  const [selectedRequirement, setSelectedRequirement] = React.useState<JobRequirement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => setResumeId(getStoredResumeId()), []);

  const loadMatch = async (jobId: string) => {
    if (!resumeId) { setError("No resume is selected. Upload a resume before running a job match."); return; }
    if (!jobId.trim()) { setError("Enter a job UUID before running a match."); return; }
    setLoading(true); setError(null); setSelectedRequirement(null);
    try {
      const screening = await runScreening(jobId.trim(), resumeId);
      const gaps = await getSkillGap(jobId.trim(), resumeId);
      setReport(presentMatchingReport(screening, gaps));
    } catch (requestError) {
      setReport(null);
      setError(requestError instanceof ApiError ? requestError.message : "Could not run the job match.");
    } finally { setLoading(false); }
  };

  const targetJob = report?.targetJob ?? null;
  return <div className="space-y-8">
    <MatchHeader targetJob={targetJob} candidateName={report?.candidateName ?? "No candidate loaded"} documentName={report?.documentName ?? "No resume selected"} analyzedAt={report?.analyzedAt ?? "Not evaluated"} availableJobs={[]} onSelectJob={(jobId) => { if (jobId) { setJobIdInput(jobId); void loadMatch(jobId); } else { setReport(null); } }} />
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-xs"><div className="flex flex-col sm:flex-row gap-3 sm:items-end"><label className="flex-1 space-y-1.5"><span className="text-xs font-semibold text-zinc-800">Target job ID</span><input value={jobIdInput} onChange={(event) => setJobIdInput(event.target.value)} placeholder="Existing job UUID from ResumeX" className="h-9 w-full rounded-md border border-zinc-200 px-3 font-mono text-xs" /></label><Button size="sm" onClick={() => void loadMatch(jobIdInput)} disabled={loading || !resumeId}>{loading ? "Running match..." : "Run Live Match"}</Button></div><p className="mt-2 text-[11px] text-zinc-500">{resumeId ? `Selected resume: ${resumeId}` : "No resume selected. Upload a resume first."} The current backend has no job-list endpoint, so enter an existing job UUID to load its real screening data.</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {loading && <div className="rounded-lg border border-zinc-200 bg-white p-10 text-center text-xs text-zinc-500">Running deterministic screening and loading skill gaps...</div>}
    {!loading && !targetJob && !error && <NoJobEmptyState availableJobs={[]} onSelectJob={(jobId) => { setJobIdInput(jobId); void loadMatch(jobId); }} />}
    {!loading && targetJob && <div className="space-y-8"><MatchSummaryArea summary={targetJob.summary} /><div className="space-y-4"><div className="flex items-center justify-between pb-1 border-b border-zinc-200"><div><h2 className="text-lg font-semibold tracking-tight text-zinc-950">Role Requirements Alignment</h2><p className="text-xs text-zinc-500">Structured visual audit connecting live backend requirements to candidate evidence.</p></div></div><RequirementsAlignmentList requirements={targetJob.requirements} selectedRequirement={selectedRequirement} onSelectRequirement={setSelectedRequirement} /></div><SkillGapSection requirements={targetJob.requirements} onSelectRequirement={setSelectedRequirement} /></div>}
    {selectedRequirement && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex justify-end bg-zinc-950/20 backdrop-blur-xs" onClick={() => setSelectedRequirement(null)}><div className="w-full max-w-xl h-full bg-white border-l border-zinc-200 p-6 shadow-xl overflow-y-auto" onClick={(event) => event.stopPropagation()}><RequirementDetailPanel requirement={selectedRequirement} onClose={() => setSelectedRequirement(null)} /></div></div>}
  </div>;
}
