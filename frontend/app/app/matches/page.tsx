"use client";

import * as React from "react";
import { getMockMatchingReport } from "@/lib/mock-matching";
import { JobRequirement } from "@/types/matching";
import { MatchHeader } from "@/components/matches/match-header";
import { MatchSummaryArea } from "@/components/matches/match-summary-area";
import { RequirementsAlignmentList } from "@/components/matches/requirements-alignment-list";
import { RequirementDetailPanel } from "@/components/matches/requirement-detail-panel";
import { SkillGapSection } from "@/components/matches/skill-gap-section";
import { NoJobEmptyState } from "@/components/matches/no-job-empty-state";

export default function MatchesPage() {
  const [currentJobId, setCurrentJobId] = React.useState<string | null>(
    "job-distributed-backend"
  );
  const [selectedRequirement, setSelectedRequirement] =
    React.useState<JobRequirement | null>(null);

  const report = React.useMemo(() => {
    return getMockMatchingReport(currentJobId || undefined);
  }, [currentJobId]);

  const targetJob = report.targetJob;

  return (
    <div className="space-y-8">
      {/* 1. Header with Role, Candidate Context, and Requisition Switcher */}
      <MatchHeader
        targetJob={targetJob}
        candidateName={report.candidateName}
        documentName={report.documentName}
        analyzedAt={report.analyzedAt}
        availableJobs={report.availableJobs}
        onSelectJob={(jobId) => {
          setCurrentJobId(jobId);
          setSelectedRequirement(null);
        }}
      />

      {/* 2. Main Body: Either Empty State or Full Alignment Analysis */}
      {!targetJob ? (
        <NoJobEmptyState
          availableJobs={report.availableJobs}
          onSelectJob={(jobId) => setCurrentJobId(jobId)}
        />
      ) : (
        <div className="space-y-8">
          {/* Match Summary Area */}
          <MatchSummaryArea summary={targetJob.summary} />

          {/* Requirements Alignment Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-zinc-200">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
                  Role Requirements Alignment
                </h2>
                <p className="text-xs text-zinc-500">
                  Structured visual audit connecting job expectations to candidate capabilities and verified source evidence.
                </p>
              </div>
            </div>

            <RequirementsAlignmentList
              requirements={targetJob.requirements}
              selectedRequirement={selectedRequirement}
              onSelectRequirement={(req) => setSelectedRequirement(req)}
            />
          </div>

          {/* Skill Gap & Delta Section */}
          <SkillGapSection
            requirements={targetJob.requirements}
            onSelectRequirement={(req) => setSelectedRequirement(req)}
          />
        </div>
      )}

      {/* 3. Requirement Detail Slide-Over Modal */}
      {selectedRequirement && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex justify-end bg-zinc-950/20 backdrop-blur-xs"
          onClick={() => setSelectedRequirement(null)}
        >
          <div
            className="w-full max-w-xl h-full bg-white border-l border-zinc-200 p-6 shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <RequirementDetailPanel
              requirement={selectedRequirement}
              onClose={() => setSelectedRequirement(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
