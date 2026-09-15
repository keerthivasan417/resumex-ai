"use client";

import * as React from "react";
import Link from "next/link";
import { getMockAnalysisReport } from "@/lib/mock-analysis";
import { SkillItem } from "@/types/analysis";
import { SkillsOverviewCards } from "@/components/skills/skills-overview-cards";
import { SkillsFilterBar } from "@/components/skills/skills-filter-bar";
import { SkillsTable } from "@/components/skills/skills-table";
import { EvidenceDetailPanel } from "@/components/evidence/evidence-detail-panel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export default function SkillsPage() {
  const report = React.useMemo(() => getMockAnalysisReport(), []);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All");
  const [categoryFilter, setCategoryFilter] = React.useState("All Categories");
  const [selectedSkill, setSelectedSkill] = React.useState<SkillItem | null>(null);

  // Filter skills
  const filteredSkills = React.useMemo(() => {
    return report.skills.filter((skill) => {
      // Search match
      const matchesSearch =
        searchQuery.trim() === "" ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.explanation.toLowerCase().includes(searchQuery.toLowerCase());

      // Status match
      const matchesStatus =
        statusFilter === "All" ||
        skill.status === statusFilter ||
        (statusFilter === "Supported" &&
          (skill.status === "Strong evidence" || skill.status === "Supported"));

      // Category match
      const matchesCategory =
        categoryFilter === "All Categories" || skill.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [report.skills, searchQuery, statusFilter, categoryFilter]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              Skill Intelligence & Grounding
            </h1>
            <Badge variant="brand" className="text-[11px] font-mono">
              VERIFIED TAXONOMY
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5 font-medium text-zinc-800">
              <Icons.fileText className="h-3.5 w-3.5 text-zinc-400" />
              {report.documentName}
            </span>
            <span>•</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
              {report.status}
            </span>
            <span>•</span>
            <span>Evaluated {report.analyzedAt}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/app/evidence">
            <Button variant="outline" size="sm" className="text-xs">
              <Icons.checkCircle className="mr-1.5 h-3.5 w-3.5 text-brand-600" />
              Open Evidence Ledger
            </Button>
          </Link>
          <Link href="/app/resume">
            <Button size="sm" variant="ghost" className="text-xs">
              <Icons.refresh className="mr-1.5 h-3.5 w-3.5" />
              Upload New Resume
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Statistics Cards */}
      <SkillsOverviewCards
        totalDetected={report.totalDetected}
        supportedCount={report.supportedCount}
        needsVerificationCount={report.needsVerificationCount}
        missingCount={report.missingCount}
        activeStatusFilter={statusFilter}
        onSelectFilter={(st) => setStatusFilter(st)}
      />

      {/* Filter and Search Bar */}
      <SkillsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
        selectedCategory={categoryFilter}
        onCategoryChange={setCategoryFilter}
        totalResults={filteredSkills.length}
      />

      {/* Skills Table & Detail Panel Layout */}
      <div className="grid grid-cols-1 gap-6">
        <SkillsTable
          skills={filteredSkills}
          selectedSkill={selectedSkill}
          onSelectSkill={(skill) => setSelectedSkill(skill)}
        />
      </div>

      {/* Side-Drawer / Modal for Skill Evidence Details */}
      {selectedSkill && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-zinc-950/20 backdrop-blur-xs"
          onClick={() => setSelectedSkill(null)}
        >
          <div
            className="w-full max-w-xl h-full bg-white border-l border-zinc-200 p-6 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <EvidenceDetailPanel
              skill={selectedSkill}
              onClose={() => setSelectedSkill(null)}
              showLedgerLink={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}
