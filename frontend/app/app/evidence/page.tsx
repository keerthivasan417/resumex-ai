"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getMockAnalysisReport, getStatusBadgeVariant } from "@/lib/mock-analysis";
import { SkillItem } from "@/types/analysis";
import { EvidenceDetailPanel } from "@/components/evidence/evidence-detail-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function EvidenceLedgerContent() {
  const searchParams = useSearchParams();
  const initialSkillId = searchParams.get("skill");

  const report = React.useMemo(() => getMockAnalysisReport(), []);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("All");

  // Determine active selected skill
  const [selectedSkillId, setSelectedSkillId] = React.useState<string>(() => {
    if (initialSkillId && report.skills.some((s) => s.id === initialSkillId)) {
      return initialSkillId;
    }
    // Default to SQL to match user prompt requirement or first item
    const sqlSkill = report.skills.find((s) => s.id === "sql");
    return sqlSkill ? sqlSkill.id : report.skills[0]?.id || "";
  });

  // Filter skills in left sidebar
  const filteredSkills = React.useMemo(() => {
    return report.skills.filter((s) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        selectedStatus === "All" || s.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [report.skills, searchQuery, selectedStatus]);

  const activeSkill = React.useMemo(() => {
    return (
      report.skills.find((s) => s.id === selectedSkillId) ||
      filteredSkills[0] ||
      report.skills[0]
    );
  }, [report.skills, selectedSkillId, filteredSkills]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Evidence Verification Ledger
            </h1>
            <Badge variant="brand" className="text-[11px] font-mono">
              AUDIT TRAIL
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Deterministic proof audit mapping resume assertions against code repositories,
            commit histories, and employment citations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/app/skills">
            <Button variant="outline" size="sm" className="text-xs">
              <Icons.cpu className="mr-1.5 h-3.5 w-3.5 text-brand-600" />
              View Skills Taxonomy
            </Button>
          </Link>
        </div>
      </div>

      {/* Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Skill Selector Master List (4 cols) */}
        <div className="lg:col-span-4 rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
          {/* List Search & Filter */}
          <div className="p-3 border-b border-zinc-200 bg-zinc-50/70 space-y-2.5">
            <div className="relative">
              <Icons.search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter ledger skills..."
                className="w-full h-8 pl-8 pr-3 rounded border border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-600"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
              {["All", "Strong evidence", "Needs verification", "Not found"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={cn(
                    "px-2 py-0.5 rounded font-mono transition-colors whitespace-nowrap cursor-pointer",
                    selectedStatus === st
                      ? "bg-zinc-900 text-white font-medium"
                      : "bg-zinc-200/70 text-zinc-600 hover:bg-zinc-300"
                  )}
                >
                  {st === "Strong evidence" ? "Strong" : st === "Needs verification" ? "Needs audit" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Skill Items List */}
          <div className="divide-y divide-zinc-100 max-h-[600px] overflow-y-auto">
            {filteredSkills.length === 0 ? (
              <div className="p-6 text-center text-xs text-zinc-400">
                No skills match search criteria
              </div>
            ) : (
              filteredSkills.map((s) => {
                const isSelected = activeSkill?.id === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedSkillId(s.id)}
                    className={cn(
                      "w-full text-left p-3.5 transition-colors flex items-center justify-between gap-3 cursor-pointer",
                      isSelected
                        ? "bg-brand-50/70 border-l-3 border-l-brand-600"
                        : "hover:bg-zinc-50/80 bg-white"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-zinc-900 truncate">
                          {s.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                        {s.category}
                      </span>
                    </div>

                    <div className="shrink-0 text-right">
                      <Badge
                        variant={getStatusBadgeVariant(s.status)}
                        className="text-[10px] font-mono px-1.5 py-0"
                      >
                        {s.status}
                      </Badge>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Evidence Detail Panel (8 cols) */}
        <div className="lg:col-span-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-xs">
          {activeSkill ? (
            <EvidenceDetailPanel skill={activeSkill} />
          ) : (
            <div className="p-12 text-center text-zinc-400 text-xs">
              Select a skill from the ledger to inspect its empirical evidence audit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EvidencePage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-8 text-center text-xs text-zinc-500 font-mono">
          Loading evidence ledger...
        </div>
      }
    >
      <EvidenceLedgerContent />
    </React.Suspense>
  );
}
