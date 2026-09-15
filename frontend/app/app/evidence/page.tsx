"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ApiError, getResumeSkills } from "@/lib/api/client";
import { getStoredResumeId } from "@/lib/resume-session";
import { presentResumeSkills } from "@/lib/resume-skill-presentation";
import { getStatusBadgeVariant } from "@/lib/mock-analysis";
import { SkillItem } from "@/types/analysis";
import { EvidenceDetailPanel } from "@/components/evidence/evidence-detail-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function EvidenceLedgerContent() {
  const searchParams = useSearchParams();
  const [skills, setSkills] = React.useState<SkillItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("All");
  const [selectedSkillId, setSelectedSkillId] = React.useState("");

  React.useEffect(() => {
    const resumeId = getStoredResumeId();
    if (!resumeId) { setLoading(false); return; }
    getResumeSkills(resumeId).then((response) => {
      const presented = presentResumeSkills(response.skills);
      setSkills(presented);
      const requested = searchParams.get("skill");
      setSelectedSkillId(presented.find((skill) => skill.id === requested)?.id ?? presented[0]?.id ?? "");
    }).catch((requestError) => setError(requestError instanceof ApiError ? requestError.message : "Could not load resume evidence.")).finally(() => setLoading(false));
  }, [searchParams]);

  const filteredSkills = React.useMemo(() => skills.filter((skill) => (selectedStatus === "All" || skill.status === selectedStatus) && (!searchQuery.trim() || [skill.name, skill.category].some((value) => value.toLowerCase().includes(searchQuery.toLowerCase())))), [skills, searchQuery, selectedStatus]);
  const activeSkill = skills.find((skill) => skill.id === selectedSkillId) ?? filteredSkills[0];
  if (loading) return <Message message="Loading evidence ledger from ResumeX..." />;
  if (error) return <Message message={error} error />;
  if (!skills.length) return <Message message="No selected resume or no backend evidence is available. Upload a resume and run skill intelligence first." />;

  return <div className="space-y-6">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200"><div><div className="flex items-center gap-2 mb-1"><h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Evidence Verification Ledger</h1><Badge variant="brand" className="text-[11px] font-mono">AUDIT TRAIL</Badge></div><p className="text-sm text-zinc-500 max-w-2xl">Deterministic evidence extracted from the selected resume. No mock evidence is shown.</p></div><Link href="/app/skills"><Button variant="outline" size="sm" className="text-xs"><Icons.cpu className="mr-1.5 h-3.5 w-3.5 text-brand-600" />View Skills Taxonomy</Button></Link></div>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"><div className="lg:col-span-4 rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs"><div className="p-3 border-b border-zinc-200 bg-zinc-50/70 space-y-2.5"><div className="relative"><Icons.search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" /><input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Filter ledger skills..." className="w-full h-8 pl-8 pr-3 rounded border border-zinc-200 bg-white text-xs" /></div><div className="flex items-center gap-1 overflow-x-auto text-[11px]">{["All", "Strong evidence", "Needs verification", "Not found"].map((status) => <button key={status} type="button" onClick={() => setSelectedStatus(status)} className={cn("px-2 py-0.5 rounded font-mono whitespace-nowrap", selectedStatus === status ? "bg-zinc-900 text-white" : "bg-zinc-200/70 text-zinc-600")}>{status === "Strong evidence" ? "Strong" : status === "Needs verification" ? "Needs audit" : status}</button>)}</div></div><div className="divide-y divide-zinc-100 max-h-[600px] overflow-y-auto">{filteredSkills.map((skill) => <button key={skill.id} type="button" onClick={() => setSelectedSkillId(skill.id)} className={cn("w-full text-left p-3.5 flex items-center justify-between gap-3", activeSkill?.id === skill.id ? "bg-brand-50/70 border-l-3 border-l-brand-600" : "hover:bg-zinc-50/80 bg-white")}><div><span className="text-xs font-semibold text-zinc-900">{skill.name}</span><span className="text-[11px] text-zinc-400 font-mono block mt-0.5">{skill.category}</span></div><Badge variant={getStatusBadgeVariant(skill.status)} className="text-[10px] font-mono">{skill.status}</Badge></button>)}</div></div><div className="lg:col-span-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-xs">{activeSkill ? <EvidenceDetailPanel skill={activeSkill} /> : <Message message="Select a skill to inspect resume evidence." />}</div></div>
  </div>;
}

function Message({ message, error = false }: { message: string; error?: boolean }) { return <div className={`p-8 text-center text-xs ${error ? "text-red-700" : "text-zinc-500"}`}>{message}</div>; }

export default function EvidencePage() { return <React.Suspense fallback={<Message message="Loading evidence ledger..." />}><EvidenceLedgerContent /></React.Suspense>; }
