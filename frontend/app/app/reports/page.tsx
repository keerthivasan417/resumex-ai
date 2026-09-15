"use client";

import * as React from "react";
import { getMockCandidateEvaluationReport } from "@/lib/mock-report";
import { ReportHeader } from "@/components/reports/report-header";
import { ReportExecutiveSummary } from "@/components/reports/report-executive-summary";
import { ReportResumeProfile } from "@/components/reports/report-resume-profile";
import { ReportSkillEvidenceTable } from "@/components/reports/report-skill-evidence-table";
import { ReportEvidenceNote } from "@/components/reports/report-evidence-note";
import { ReportJobAlignment } from "@/components/reports/report-job-alignment";
import { ReportSkillGaps } from "@/components/reports/report-skill-gaps";
import { ReportDeveloperIntelligence } from "@/components/reports/report-developer-intelligence";
import { ReportFinalAssessment } from "@/components/reports/report-final-assessment";

export default function ReportsPage() {
  const report = React.useMemo(() => getMockCandidateEvaluationReport(), []);

  return (
    <div className="space-y-6 print-page">
      {/* 1. Report Header with Institutional Metadata & Print Action */}
      <ReportHeader header={report.header} />

      {/* 2. Executive Evaluation Summary */}
      <ReportExecutiveSummary summary={report.executiveSummary} />

      {/* 3. Resume Profile & Commercial Tenure */}
      <ReportResumeProfile profile={report.resumeProfile} />

      {/* 4. Technical Skill Evidence Ledger */}
      <ReportSkillEvidenceTable skills={report.skillsEvidence} />

      {/* 5. Methodological Evidence Note */}
      <ReportEvidenceNote note={report.evidenceNote} />

      {/* 6. Job Requirements Alignment */}
      <ReportJobAlignment items={report.jobAlignment} />

      {/* 7. Skill Gap & Development Delta */}
      <ReportSkillGaps skillGaps={report.skillGaps} />

      {/* 8. Developer Intelligence & Codebase Profiling */}
      <ReportDeveloperIntelligence data={report.developerIntelligence} />

      {/* 9. Final Screening Assessment & Recommendations */}
      <ReportFinalAssessment assessment={report.finalAssessment} />
    </div>
  );
}
