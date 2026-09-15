"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Candidate,
  PipelineStage,
  EvaluationStatus,
  EvidenceStrength,
} from "@/types/candidate";
import { mockCandidates } from "@/lib/mock-candidates";
import { mockRequisitions } from "@/lib/mock-jobs";
import { CandidateHeader } from "@/components/candidates/candidate-header";
import { CandidateFiltersBar } from "@/components/candidates/candidate-filters-bar";
import { CandidateBulkActions } from "@/components/candidates/candidate-bulk-actions";
import { CandidateTable } from "@/components/candidates/candidate-table";
import { CandidateDetailPanel } from "@/components/candidates/candidate-detail-panel";
import { CandidatesEmptyState } from "@/components/candidates/candidates-empty-state";
import { RequisitionSelectorModal } from "@/components/candidates/requisition-selector-modal";

function CandidatesContent() {
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get("jobId");

  // Requisition selection: defaults to URL param, or primary job, or null (all)
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

  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<PipelineStage | "All">("All");
  const [evaluationFilter, setEvaluationFilter] = useState<
    EvaluationStatus | "All"
  >("All");
  const [evidenceFilter, setEvidenceFilter] = useState<
    EvidenceStrength | "All"
  >("All");
  const [experienceFilter, setExperienceFilter] = useState<string>("All");

  // Selection & Modal States
  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isRequisitionModalOpen, setIsRequisitionModalOpen] = useState(false);

  // Selected Requisition Object
  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return mockRequisitions.find((r) => r.id === selectedJobId) || null;
  }, [selectedJobId]);

  // Candidates belonging to selected requisition (before search/filter)
  const poolCandidates = useMemo(() => {
    if (!selectedJobId) return candidates;
    return candidates.filter((c) => c.targetJobId === selectedJobId);
  }, [candidates, selectedJobId]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return poolCandidates.filter((cand) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = cand.name.toLowerCase().includes(query);
        const matchesRole = cand.currentRole.toLowerCase().includes(query);
        const matchesSkill = cand.keySkills.some((sk) =>
          sk.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesRole && !matchesSkill) return false;
      }

      // Stage Filter
      if (stageFilter !== "All" && cand.pipelineStage !== stageFilter) {
        return false;
      }

      // Evaluation Filter
      if (
        evaluationFilter !== "All" &&
        cand.evaluationStatus !== evaluationFilter
      ) {
        return false;
      }

      // Evidence Filter
      if (
        evidenceFilter !== "All" &&
        cand.evidenceStrength !== evidenceFilter
      ) {
        return false;
      }

      // Experience Filter
      if (experienceFilter !== "All") {
        if (experienceFilter === "1-3" && cand.experienceYears > 3) {
          return false;
        }
        if (
          experienceFilter === "4-6" &&
          (cand.experienceYears < 4 || cand.experienceYears > 6)
        ) {
          return false;
        }
        if (experienceFilter === "7+" && cand.experienceYears < 7) {
          return false;
        }
      }

      return true;
    });
  }, [
    poolCandidates,
    searchQuery,
    stageFilter,
    evaluationFilter,
    evidenceFilter,
    experienceFilter,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    stageFilter !== "All" ||
    evaluationFilter !== "All" ||
    evidenceFilter !== "All" ||
    experienceFilter !== "All";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStageFilter("All");
    setEvaluationFilter("All");
    setEvidenceFilter("All");
    setExperienceFilter("All");
  };

  // Local state changes: stage change
  const handleStageChange = (
    candidateId: string,
    newStage: PipelineStage
  ) => {
    const updated = candidates.map((c) => {
      if (c.id === candidateId) {
        const up = { ...c, pipelineStage: newStage };
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate(up);
        }
        return up;
      }
      return c;
    });
    setCandidates(updated);
  };

  // Local state changes: shortlist toggle
  const handleToggleShortlist = (candidateId: string) => {
    const updated = candidates.map((c) => {
      if (c.id === candidateId) {
        const up = { ...c, isShortlisted: !c.isShortlisted };
        if (selectedCandidate?.id === candidateId) {
          setSelectedCandidate(up);
        }
        return up;
      }
      return c;
    });
    setCandidates(updated);
  };

  // Bulk actions
  const handleBulkStageChange = (newStage: PipelineStage) => {
    const updated = candidates.map((c) => {
      if (selectedIds.includes(c.id)) {
        return { ...c, pipelineStage: newStage };
      }
      return c;
    });
    setCandidates(updated);
    setSelectedIds([]);
  };

  const handleBulkShortlist = (shortlist: boolean) => {
    const updated = candidates.map((c) => {
      if (selectedIds.includes(c.id)) {
        return { ...c, isShortlisted: shortlist };
      }
      return c;
    });
    setCandidates(updated);
    setSelectedIds([]);
  };

  const handleToggleSelectId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCandidates.map((c) => c.id));
    }
  };

  const shortlistedCount = poolCandidates.filter((c) => c.isShortlisted).length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header & Requisition Context */}
      <CandidateHeader
        selectedJob={selectedJob}
        totalCandidates={poolCandidates.length}
        shortlistedCount={shortlistedCount}
        onChangeRequisition={() => setIsRequisitionModalOpen(true)}
      />

      {/* 2. Search & Filters Bar */}
      {poolCandidates.length > 0 && (
        <CandidateFiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          stageFilter={stageFilter}
          onStageFilterChange={setStageFilter}
          evaluationFilter={evaluationFilter}
          onEvaluationFilterChange={setEvaluationFilter}
          evidenceFilter={evidenceFilter}
          onEvidenceFilterChange={setEvidenceFilter}
          experienceFilter={experienceFilter}
          onExperienceFilterChange={setExperienceFilter}
          totalResults={filteredCandidates.length}
          totalCandidates={poolCandidates.length}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* 3. Bulk Selection Floating Actions Bar */}
      <CandidateBulkActions
        selectedCount={selectedIds.length}
        totalCount={filteredCandidates.length}
        onSelectAll={() => setSelectedIds(filteredCandidates.map((c) => c.id))}
        onClearSelection={() => setSelectedIds([])}
        onBulkStageChange={handleBulkStageChange}
        onBulkShortlist={handleBulkShortlist}
      />

      {/* 4. Candidate Table / List or Empty States */}
      {poolCandidates.length === 0 ? (
        <CandidatesEmptyState
          type="no-candidates-for-job"
          onChangeRequisition={() => setIsRequisitionModalOpen(true)}
        />
      ) : filteredCandidates.length === 0 ? (
        <CandidatesEmptyState
          type="no-search-results"
          onClearFilters={handleClearFilters}
        />
      ) : (
        <CandidateTable
          candidates={filteredCandidates}
          selectedCandidateId={selectedCandidate?.id}
          onSelectCandidate={(cand) => setSelectedCandidate(cand)}
          onStageChange={handleStageChange}
          onToggleShortlist={handleToggleShortlist}
          selectedIds={selectedIds}
          onToggleSelectId={handleToggleSelectId}
          onToggleSelectAll={handleToggleSelectAll}
        />
      )}

      {/* 5. Detailed Candidate Evaluation Drawer */}
      <CandidateDetailPanel
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onStageChange={handleStageChange}
        onToggleShortlist={handleToggleShortlist}
      />

      {/* 6. Requisition Selector Modal */}
      <RequisitionSelectorModal
        isOpen={isRequisitionModalOpen}
        onClose={() => setIsRequisitionModalOpen(false)}
        requisitions={mockRequisitions}
        selectedJobId={selectedJobId}
        onSelectJob={(id) => {
          setSelectedJobId(id);
          setSelectedIds([]);
        }}
      />
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-64 items-center justify-center text-xs text-zinc-400">
          Loading Candidate Pipeline...
        </div>
      }
    >
      <CandidatesContent />
    </Suspense>
  );
}
