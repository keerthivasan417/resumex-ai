"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShortlistEntry } from "@/types/shortlist";
import {
  PipelineStage,
  EvaluationStatus,
  EvidenceStrength,
} from "@/types/candidate";
import { mockShortlists } from "@/lib/mock-shortlists";
import { mockRequisitions } from "@/lib/mock-jobs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { ShortlistHeader } from "@/components/shortlists/shortlist-header";
import { ShortlistRequisitionContext } from "@/components/shortlists/shortlist-requisition-context";
import { ShortlistFiltersBar } from "@/components/shortlists/shortlist-filters-bar";
import { ShortlistTable } from "@/components/shortlists/shortlist-table";
import { ShortlistDetailPanel } from "@/components/shortlists/shortlist-detail-panel";
import { ShortlistComparisonWorkspace } from "@/components/shortlists/shortlist-comparison-workspace";
import { ShortlistsEmptyState } from "@/components/shortlists/shortlists-empty-state";
import { RequisitionSelectorModal } from "@/components/candidates/requisition-selector-modal";

function ShortlistsContent() {
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get("jobId");

  // Requisition selection defaults to URL param, primary job, or null (all)
  const initialJobId = useMemo(() => {
    if (urlJobId) {
      const exists = mockRequisitions.some((r) => r.id === urlJobId);
      if (exists) return urlJobId;
    }
    return "job-distributed-backend";
  }, [urlJobId]);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    initialJobId
  );

  useEffect(() => {
    if (urlJobId) {
      const exists = mockRequisitions.some((r) => r.id === urlJobId);
      if (exists) {
        setSelectedJobId(urlJobId);
      }
    }
  }, [urlJobId]);

  // Main Shortlist Local State
  const [shortlists, setShortlists] = useState<ShortlistEntry[]>(mockShortlists);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [evaluationFilter, setEvaluationFilter] = useState<
    EvaluationStatus | "All"
  >("All");
  const [evidenceFilter, setEvidenceFilter] = useState<
    EvidenceStrength | "All"
  >("All");
  const [stageFilter, setStageFilter] = useState<PipelineStage | "All">("All");

  // Selection & Mode States
  const [selectedEntry, setSelectedEntry] = useState<ShortlistEntry | null>(
    null
  );
  const [compareIds, setCompareIds] = useState<string[]>([
    "sl-alex-chen",
    "sl-marcus-vance",
  ]);
  const [isComparisonMode, setIsComparisonMode] = useState(false);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);

  // Selected Requisition Object
  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return mockRequisitions.find((r) => r.id === selectedJobId) || null;
  }, [selectedJobId]);

  // Entries for selected requisition
  const poolEntries = useMemo(() => {
    if (!selectedJobId) return shortlists;
    return shortlists.filter((e) => e.targetJobId === selectedJobId);
  }, [shortlists, selectedJobId]);

  // Filtered Entries
  const filteredEntries = useMemo(() => {
    return poolEntries.filter((entry) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = entry.candidate.name.toLowerCase().includes(query);
        const matchesRole = entry.candidate.currentRole
          .toLowerCase()
          .includes(query);
        const matchesSkill = entry.candidate.keySkills.some((sk) =>
          sk.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesRole && !matchesSkill) return false;
      }

      // Evaluation Filter
      if (
        evaluationFilter !== "All" &&
        entry.evaluationStatus !== evaluationFilter
      ) {
        return false;
      }

      // Evidence Filter
      if (
        evidenceFilter !== "All" &&
        entry.evidenceStrength !== evidenceFilter
      ) {
        return false;
      }

      // Stage Filter
      if (stageFilter !== "All" && entry.pipelineStage !== stageFilter) {
        return false;
      }

      return true;
    });
  }, [poolEntries, searchQuery, evaluationFilter, evidenceFilter, stageFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    evaluationFilter !== "All" ||
    evidenceFilter !== "All" ||
    stageFilter !== "All";

  const handleClearFilters = () => {
    setSearchQuery("");
    setEvaluationFilter("All");
    setEvidenceFilter("All");
    setStageFilter("All");
  };

  // Local state changes: stage change
  const handleStageChange = (entryId: string, newStage: PipelineStage) => {
    const updated = shortlists.map((entry) => {
      if (entry.id === entryId) {
        const up = {
          ...entry,
          pipelineStage: newStage,
          candidate: { ...entry.candidate, pipelineStage: newStage },
        };
        if (selectedEntry?.id === entryId) {
          setSelectedEntry(up);
        }
        return up;
      }
      return entry;
    });
    setShortlists(updated);
  };

  // Local state changes: recruiter notes edit
  const handleNotesChange = (entryId: string, newNotes: string) => {
    const updated = shortlists.map((entry) => {
      if (entry.id === entryId) {
        const up = { ...entry, recruiterNotes: newNotes };
        if (selectedEntry?.id === entryId) {
          setSelectedEntry(up);
        }
        return up;
      }
      return entry;
    });
    setShortlists(updated);
  };

  // Local state changes: remove from shortlist
  const handleRemoveFromShortlist = (entryId: string) => {
    setShortlists((prev) => prev.filter((e) => e.id !== entryId));
    setCompareIds((prev) => prev.filter((id) => id !== entryId));
    if (selectedEntry?.id === entryId) {
      setSelectedEntry(null);
    }
  };

  // Comparison toggle
  const handleToggleCompareId = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 4) {
        alert("You can compare a maximum of 4 candidates at once.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const compareEntries = useMemo(() => {
    return shortlists.filter((e) => compareIds.includes(e.id));
  }, [shortlists, compareIds]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <ShortlistHeader
        selectedJob={selectedJob}
        shortlistCount={poolEntries.length}
        selectedCompareCount={compareIds.length}
        onOpenCompare={() => setIsComparisonMode(true)}
        onChangeRequisition={() => setIsRequisitionModalOpen(true)}
      />

      {/* 2. Requisition Context */}
      <ShortlistRequisitionContext
        selectedJob={selectedJob}
        onChangeRequisition={() => setIsRequisitionModalOpen(true)}
      />

      {/* 3. Comparison Mode OR Normal Shortlist View */}
      {isComparisonMode ? (
        <ShortlistComparisonWorkspace
          entries={compareEntries}
          onClose={() => setIsComparisonMode(false)}
          onClearSelection={() => setCompareIds([])}
          onStageChange={handleStageChange}
          onSelectDetail={(entry) => setSelectedEntry(entry)}
        />
      ) : (
        <>
          {/* Filters Bar */}
          {poolEntries.length > 0 && (
            <ShortlistFiltersBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              evaluationFilter={evaluationFilter}
              onEvaluationFilterChange={setEvaluationFilter}
              evidenceFilter={evidenceFilter}
              onEvidenceFilterChange={setEvidenceFilter}
              stageFilter={stageFilter}
              onStageFilterChange={setStageFilter}
              totalResults={filteredEntries.length}
              totalShortlisted={poolEntries.length}
              onClearFilters={handleClearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          )}

          {/* Comparison Quick Launch Bar (if 2+ selected) */}
          {compareIds.length >= 2 && (
            <div className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50/70 p-2.5 text-xs text-brand-950 animate-in fade-in">
              <span className="font-semibold">
                {compareIds.length} candidates selected for side-by-side comparison
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCompareIds([])}
                  className="h-7 text-xs text-brand-700 hover:text-brand-950"
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsComparisonMode(true)}
                  className="h-7 gap-1 text-xs shadow-2xs"
                >
                  <Icons.barChart className="h-3.5 w-3.5" />
                  <span>Launch Comparison Workspace</span>
                </Button>
              </div>
            </div>
          )}

          {/* Shortlist Table or Empty States */}
          {poolEntries.length === 0 ? (
            <ShortlistsEmptyState
              type="no-shortlists"
              selectedJobId={selectedJobId}
            />
          ) : filteredEntries.length === 0 ? (
            <ShortlistsEmptyState
              type="no-search-results"
              onClearFilters={handleClearFilters}
            />
          ) : (
            <ShortlistTable
              shortlists={filteredEntries}
              selectedEntryId={selectedEntry?.id}
              onSelectEntry={(entry) => setSelectedEntry(entry)}
              onStageChange={handleStageChange}
              onRemoveFromShortlist={handleRemoveFromShortlist}
              compareIds={compareIds}
              onToggleCompareId={handleToggleCompareId}
            />
          )}
        </>
      )}

      {/* 4. Candidate Detail Slide-Over Review Panel */}
      <ShortlistDetailPanel
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
        onStageChange={handleStageChange}
        onNotesChange={handleNotesChange}
        onRemoveFromShortlist={handleRemoveFromShortlist}
      />

      {/* 5. Requisition Selector Modal */}
      <RequisitionSelectorModal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        requisitions={mockRequisitions}
        selectedJobId={selectedJobId}
        onSelectJob={(id) => {
          setSelectedJobId(id);
          setIsComparisonMode(false);
        }}
      />
    </div>
  );
}

export default function ShortlistsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-zinc-400">
          Loading Shortlists Workspace...
        </div>
      }
    >
      <ShortlistsContent />
    </Suspense>
  );
}
