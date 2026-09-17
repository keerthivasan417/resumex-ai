"use client";

import React from "react";
import { ApiError, createJob, listJobs } from "@/lib/api/client";
import { presentJob } from "@/lib/job-presentation";
import type { JobRequisition } from "@/types/job";
import { JobHeader } from "@/components/jobs/job-header";
import { JobFiltersBar } from "@/components/jobs/job-filters-bar";
import { JobListTable } from "@/components/jobs/job-list-table";
import { JobDetailPanel } from "@/components/jobs/job-detail-panel";
import { CreateJobModal } from "@/components/jobs/create-job-modal";
import { JobsEmptyState } from "@/components/jobs/jobs-empty-state";

export default function JobsPage() {
  const [jobs, setJobs] = React.useState<JobRequisition[]>([]); const [selectedJob, setSelectedJob] = React.useState<JobRequisition | null>(null); const [search, setSearch] = React.useState(""); const [status, setStatus] = React.useState<JobRequisition["status"] | "All">("All"); const [creating, setCreating] = React.useState(false); const [loading, setLoading] = React.useState(true); const [error, setError] = React.useState<string | null>(null);
  const load = React.useCallback(async () => { setLoading(true); setError(null); try { setJobs((await listJobs()).map(presentJob)); } catch (value) { setError(value instanceof ApiError ? value.message : "Could not load jobs."); } finally { setLoading(false); } }, []);
  React.useEffect(() => { void load(); }, [load]);
  const visible = jobs.filter((job) => (status === "All" || job.status === status) && (!search.trim() || [job.title, job.department, job.location, ...job.requirements.map((item) => item.name)].join(" ").toLowerCase().includes(search.toLowerCase())));
  const create = async (draft: Partial<JobRequisition>) => { if (!draft.title || !draft.description) return; setError(null); try { await createJob({ title: draft.title, description: draft.description, company_name: draft.department || "Unspecified", location: draft.location === "Not provided" ? null : draft.location, requirements: (draft.requirements ?? []).map((item) => ({ description: item.description || item.name, importance: item.priority === "Must have" ? "required" : "preferred", skill: item.name })) }); setCreating(false); await load(); } catch (value) { setError(value instanceof ApiError ? value.message : "Could not create the job."); } };
  const unavailable = () => setError("This action is unavailable because the current backend exposes only job creation and reads.");
  return <div className="space-y-6 pb-12">
    <JobHeader totalCount={jobs.length} activeCount={jobs.filter((job) => job.status === "Active").length} onCreateRequisition={() => setCreating(true)} />
    {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
    {!loading && jobs.length > 0 && <JobFiltersBar searchQuery={search} onSearchChange={setSearch} statusFilter={status} onStatusFilterChange={setStatus} departmentFilter="All" onDepartmentFilterChange={() => undefined} levelFilter="All" onLevelFilterChange={() => undefined} availableDepartments={[]} totalResults={visible.length} onClearFilters={() => { setSearch(""); setStatus("All"); }} hasActiveFilters={Boolean(search || status !== "All")} />}
    {loading ? <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-sm text-zinc-500">Loading persisted job requisitions...</div> : jobs.length === 0 ? <JobsEmptyState isFiltered={false} onCreateRequisition={() => setCreating(true)} /> : <JobListTable requisitions={visible} selectedJobId={selectedJob?.id} onSelectJob={setSelectedJob} onEditJob={unavailable} onDuplicateJob={unavailable} onStatusToggle={unavailable} />}
    <JobDetailPanel job={selectedJob} onClose={() => setSelectedJob(null)} onEdit={unavailable} onDuplicate={unavailable} onStatusToggle={unavailable} />
    <CreateJobModal isOpen={creating} onClose={() => setCreating(false)} onSave={(job) => void create(job)} />
  </div>;
}
