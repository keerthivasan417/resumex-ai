"use client";

import * as React from "react";
import { ApiError, getCandidate, getEvaluationReport, getJob, listJobs } from "@/lib/api/client";
import type { JobResponse } from "@/lib/api/types";
import { getStoredJobId, getStoredResumeId } from "@/lib/resume-session";
import { presentEvaluationReport } from "@/lib/report-presentation";
import type { CandidateEvaluationReport } from "@/types/report";
import { ReportHeader } from "@/components/reports/report-header";
import { ReportExecutiveSummary } from "@/components/reports/report-executive-summary";
import { ReportResumeProfile } from "@/components/reports/report-resume-profile";
import { ReportSkillEvidenceTable } from "@/components/reports/report-skill-evidence-table";
import { ReportEvidenceNote } from "@/components/reports/report-evidence-note";
import { ReportJobAlignment } from "@/components/reports/report-job-alignment";
import { ReportSkillGaps } from "@/components/reports/report-skill-gaps";
import { ReportDeveloperIntelligence } from "@/components/reports/report-developer-intelligence";
import { ReportFinalAssessment } from "@/components/reports/report-final-assessment";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  const [resumeId, setResumeId] = React.useState<string | null>(null);
  const [jobId, setJobId] = React.useState("");
  const [report, setReport] = React.useState<CandidateEvaluationReport | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [jobs, setJobs] = React.useState<JobResponse[]>([]);
  React.useEffect(() => { setResumeId(getStoredResumeId()); setJobId(getStoredJobId() ?? ""); listJobs().then(setJobs).catch(() => undefined); }, []);
  const loadReport = async () => {
    if (!resumeId) { setError("No resume is selected. Upload and screen a resume first."); return; }
    if (!jobId.trim()) { setError("Enter the job UUID used for screening."); return; }
    setLoading(true); setError(null);
    try { const response = await getEvaluationReport(jobId.trim(), resumeId); const [candidate, job] = await Promise.all([getCandidate(response.candidate_id), getJob(response.job_id)]); setReport(presentEvaluationReport(response, { candidateName: candidate.full_name, jobTitle: job.title, companyName: job.company_name })); }
    catch (requestError) { setReport(null); setError(requestError instanceof ApiError ? requestError.message : "Could not load the evaluation report."); }
    finally { setLoading(false); }
  };
  return <div className="space-y-6 print-page">
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-xs print:hidden"><div className="flex flex-col sm:flex-row gap-3 sm:items-end"><label className="flex-1 space-y-1"><span className="text-xs font-semibold text-zinc-800">Job</span><select value={jobId} onChange={(event) => setJobId(event.target.value)} className="h-9 w-full rounded-md border border-zinc-200 px-3 text-xs"><option value="">Select a persisted job</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title} — {job.company_name}</option>)}</select></label><Button size="sm" onClick={() => void loadReport()} disabled={loading || !resumeId || !jobId}>{loading ? "Loading report..." : "Load Live Report"}</Button></div><p className="mt-2 text-[11px] text-zinc-500">{resumeId ? "Reports require a persisted screening for the selected job and resume." : "No resume selected."}</p></div>
    {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {loading && <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-xs text-zinc-500">Loading live evaluation report...</div>}
    {!loading && !report && !error && <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">Load a persisted screening report to view recruiter-ready evidence.</div>}
    {report && <><ReportHeader header={report.header} /><ReportExecutiveSummary summary={report.executiveSummary} /><ReportResumeProfile profile={report.resumeProfile} /><ReportSkillEvidenceTable skills={report.skillsEvidence} /><ReportEvidenceNote note={report.evidenceNote} /><ReportJobAlignment items={report.jobAlignment} /><ReportSkillGaps skillGaps={report.skillGaps} /><ReportDeveloperIntelligence data={report.developerIntelligence} /><ReportFinalAssessment assessment={report.finalAssessment} /></>}
  </div>;
}
