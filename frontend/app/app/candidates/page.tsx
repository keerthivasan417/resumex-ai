"use client";

import * as React from "react";
import { ApiError, getCandidateScreening, getJobCandidates, updateRecruiterState } from "@/lib/api/client";
import type { JobCandidateScreeningResponse } from "@/lib/api/types";
import { getStoredJobId } from "@/lib/resume-session";
import { presentRecruiterCandidate, recruiterStageForPipeline } from "@/lib/recruiter-presentation";
import type { Candidate, PipelineStage } from "@/types/candidate";
import { CandidateHeader } from "@/components/candidates/candidate-header";
import { CandidateFiltersBar } from "@/components/candidates/candidate-filters-bar";
import { CandidateBulkActions } from "@/components/candidates/candidate-bulk-actions";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { CandidateDetailPanel } from "@/components/candidates/candidate-detail-panel";
import { CandidatesEmptyState } from "@/components/candidates/candidates-empty-state";
import { Button } from "@/components/ui/button";

export default function CandidatesPage() {
  const [jobId, setJobId] = React.useState("");
  const [rows, setRows] = React.useState<JobCandidateScreeningResponse[]>([]);
  const [selectedCandidate, setSelectedCandidate] = React.useState<Candidate | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [stageFilter, setStageFilter] = React.useState<PipelineStage | "All">("All");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => setJobId(getStoredJobId() ?? ""), []);
  const candidates = React.useMemo(() => rows.map((item) => presentRecruiterCandidate(item, jobId)), [rows, jobId]);
  const filtered = React.useMemo(() => candidates.filter((candidate) => (!searchQuery.trim() || candidate.name.toLowerCase().includes(searchQuery.toLowerCase())) && (stageFilter === "All" || candidate.pipelineStage === stageFilter)), [candidates, searchQuery, stageFilter]);
  const loadCandidates = async () => { if (!jobId.trim()) { setError("Enter a job UUID to load its persisted candidates."); return; } setLoading(true); setError(null); try { setRows((await getJobCandidates(jobId.trim())).candidates); setSelectedCandidate(null); setSelectedIds([]); } catch (requestError) { setRows([]); setError(requestError instanceof ApiError ? requestError.message : "Could not load candidates."); } finally { setLoading(false); } };
  const inspectCandidate = async (candidate: Candidate) => { if (!jobId) return; try { const detail = await getCandidateScreening(jobId, candidate.id); setRows((current) => current.map((item) => item.candidate_id === detail.candidate_id ? detail : item)); setSelectedCandidate(presentRecruiterCandidate(detail, jobId)); } catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : "Could not load candidate screening."); } };
  const updateCandidate = async (candidateId: string, update: Partial<Pick<JobCandidateScreeningResponse, "recruiter_stage" | "shortlisted">>) => { const current = rows.find((item) => item.candidate_id === candidateId); if (!current) return; try { const state = await updateRecruiterState(current.screening_result_id, update); const next = { ...current, ...state }; setRows((items) => items.map((item) => item.candidate_id === candidateId ? next : item)); setSelectedCandidate((selected) => selected?.id === candidateId ? presentRecruiterCandidate(next, jobId) : selected); } catch (requestError) { setError(requestError instanceof ApiError ? requestError.message : "Could not update recruiter state."); } };
  const clearFilters = () => { setSearchQuery(""); setStageFilter("All"); };
  return <div className="space-y-6 pb-12">
    <CandidateHeader selectedJob={null} totalCandidates={candidates.length} shortlistedCount={rows.filter((item) => item.shortlisted).length} onChangeRequisition={() => undefined} />
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-xs"><div className="flex flex-col sm:flex-row sm:items-end gap-3"><label className="flex-1 space-y-1"><span className="text-xs font-semibold text-zinc-800">Job ID</span><input value={jobId} onChange={(event) => setJobId(event.target.value)} placeholder="Existing job UUID" className="h-9 w-full rounded-md border border-zinc-200 px-3 font-mono text-xs" /></label><Button size="sm" onClick={() => void loadCandidates()} disabled={loading}>{loading ? "Loading..." : "Load Candidates"}</Button></div><p className="mt-2 text-[11px] text-zinc-500">Candidate records come only from persisted screening results for this job.</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {candidates.length > 0 && <CandidateFiltersBar searchQuery={searchQuery} onSearchChange={setSearchQuery} stageFilter={stageFilter} onStageFilterChange={setStageFilter} evaluationFilter="All" onEvaluationFilterChange={() => undefined} evidenceFilter="All" onEvidenceFilterChange={() => undefined} experienceFilter="All" onExperienceFilterChange={() => undefined} totalResults={filtered.length} totalCandidates={candidates.length} onClearFilters={clearFilters} hasActiveFilters={Boolean(searchQuery || stageFilter !== "All")} />}
    <CandidateBulkActions selectedCount={selectedIds.length} totalCount={filtered.length} onSelectAll={() => setSelectedIds(filtered.map((item) => item.id))} onClearSelection={() => setSelectedIds([])} onBulkStageChange={(stage) => selectedIds.forEach((id) => void updateCandidate(id, { recruiter_stage: recruiterStageForPipeline(stage) }))} onBulkShortlist={(shortlisted) => selectedIds.forEach((id) => void updateCandidate(id, { shortlisted }))} />
    {loading ? <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-xs text-zinc-500">Loading recruiter candidates...</div> : !jobId ? <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">Enter a job UUID to load real candidate screenings.</div> : candidates.length === 0 ? <CandidatesEmptyState type="no-candidates-for-job" /> : filtered.length === 0 ? <CandidatesEmptyState type="no-search-results" onClearFilters={clearFilters} /> : <CandidateTable candidates={filtered} selectedCandidateId={selectedCandidate?.id} onSelectCandidate={(candidate) => void inspectCandidate(candidate)} onStageChange={(id, stage) => void updateCandidate(id, { recruiter_stage: recruiterStageForPipeline(stage) })} onToggleShortlist={(id) => { const current = rows.find((item) => item.candidate_id === id); if (current) void updateCandidate(id, { shortlisted: !current.shortlisted }); }} selectedIds={selectedIds} onToggleSelectId={(id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])} onToggleSelectAll={() => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map((item) => item.id))} />}
    <CandidateDetailPanel candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onStageChange={(id, stage) => void updateCandidate(id, { recruiter_stage: recruiterStageForPipeline(stage) })} onToggleShortlist={(id) => { const current = rows.find((item) => item.candidate_id === id); if (current) void updateCandidate(id, { shortlisted: !current.shortlisted }); }} />
  </div>;
}
