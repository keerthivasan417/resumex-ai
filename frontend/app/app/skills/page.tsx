"use client";

import * as React from "react";
import Link from "next/link";
import { ApiError, getResumeSkills } from "@/lib/api/client";
import { getStoredResumeId } from "@/lib/resume-session";
import { presentResumeSkills } from "@/lib/resume-skill-presentation";
import { SkillItem } from "@/types/analysis";
import { SkillsOverviewCards } from "@/components/skills/skills-overview-cards";
import { SkillsFilterBar } from "@/components/skills/skills-filter-bar";
import { SkillsTable } from "@/components/skills/skills-table";
import { EvidenceDetailPanel } from "@/components/evidence/evidence-detail-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export default function SkillsPage() {
  const [skills, setSkills] = React.useState<SkillItem[]>([]);
  const [resumeId, setResumeId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [categoryFilter, setCategoryFilter] = React.useState("All Categories");
  const [selectedSkill, setSelectedSkill] = React.useState<SkillItem | null>(null);

  React.useEffect(() => {
    const storedResumeId = getStoredResumeId();
    setResumeId(storedResumeId);
    if (!storedResumeId) { setLoading(false); return; }
    getResumeSkills(storedResumeId)
      .then((response) => setSkills(presentResumeSkills(response.skills)))
      .catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : "Could not load resume skills."))
      .finally(() => setLoading(false));
  }, []);

  const filteredSkills = React.useMemo(() => skills.filter((skill) => {
    const matchesSearch = !searchQuery.trim() || [skill.name, skill.category, skill.explanation].some((value) => value.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "All" || skill.status === statusFilter || (statusFilter === "Supported" && (skill.status === "Strong evidence" || skill.status === "Supported"));
    return matchesSearch && matchesStatus && (categoryFilter === "All Categories" || skill.category === categoryFilter);
  }), [skills, searchQuery, statusFilter, categoryFilter]);
  const supportedCount = skills.filter((skill) => skill.status === "Strong evidence" || skill.status === "Supported").length;
  const verificationCount = skills.filter((skill) => skill.status === "Needs verification").length;
  const missingCount = skills.filter((skill) => skill.status === "Not found").length;

  return <div className="space-y-8">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200"><div><div className="flex items-center gap-2 mb-1"><h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Skill Intelligence & Grounding</h1><Badge variant="brand" className="text-[11px] font-mono">VERIFIED TAXONOMY</Badge></div><div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500"><span className="flex items-center gap-1.5 font-medium text-zinc-800"><Icons.fileText className="h-3.5 w-3.5 text-zinc-400" />{resumeId ? `Resume ${resumeId}` : "No resume selected"}</span><span>•</span><span className="text-emerald-700 font-medium">{loading ? "Loading analysis..." : "Live backend evidence"}</span></div></div><div className="flex items-center gap-2.5"><Link href="/app/evidence"><Button variant="outline" size="sm" className="text-xs"><Icons.checkCircle className="mr-1.5 h-3.5 w-3.5 text-brand-600" />Open Evidence Ledger</Button></Link><Link href="/app/resume"><Button size="sm" variant="ghost" className="text-xs"><Icons.refresh className="mr-1.5 h-3.5 w-3.5" />Upload New Resume</Button></Link></div></div>
    {!resumeId && !loading && <EmptyState message="Upload a resume first to view its skill intelligence." />}
    {error && <EmptyState message={error} error />}
    {loading && <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center text-xs text-zinc-500">Loading skill intelligence from ResumeX...</div>}
    {!loading && resumeId && !error && <><SkillsOverviewCards totalDetected={skills.length} supportedCount={supportedCount} needsVerificationCount={verificationCount} missingCount={missingCount} activeStatusFilter={statusFilter} onSelectFilter={setStatusFilter} /><SkillsFilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} selectedStatus={statusFilter} onStatusChange={setStatusFilter} selectedCategory={categoryFilter} onCategoryChange={setCategoryFilter} totalResults={filteredSkills.length} />{skills.length === 0 ? <EmptyState message="The backend returned no catalog-backed skills for this resume." /> : <SkillsTable skills={filteredSkills} selectedSkill={selectedSkill} onSelectSkill={setSelectedSkill} />}</>}
    {selectedSkill && <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex justify-end bg-zinc-950/20 backdrop-blur-xs" onClick={() => setSelectedSkill(null)}><div className="w-full max-w-xl h-full bg-white border-l border-zinc-200 p-6 shadow-xl overflow-y-auto" onClick={(event) => event.stopPropagation()}><EvidenceDetailPanel skill={selectedSkill} onClose={() => setSelectedSkill(null)} showLedgerLink /></div></div>}
  </div>;
}

function EmptyState({ message, error = false }: { message: string; error?: boolean }) {
  return <div className={`rounded-lg border p-8 text-center text-sm ${error ? "border-red-200 bg-red-50 text-red-800" : "border-zinc-200 bg-white text-zinc-500"}`}>{message}</div>;
}
