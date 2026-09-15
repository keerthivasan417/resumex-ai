import React from "react";
import {
  MatchEvaluationMode,
  EvidenceSensitivity,
  SkillVerificationBehavior,
} from "@/types/settings";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EvaluationSettingsSectionProps {
  evaluationMode: MatchEvaluationMode;
  onEvaluationModeChange: (mode: MatchEvaluationMode) => void;
  evidenceSensitivity: EvidenceSensitivity;
  onEvidenceSensitivityChange: (sensitivity: EvidenceSensitivity) => void;
  minEvidenceThreshold: number;
  onMinEvidenceThresholdChange: (threshold: number) => void;
  skillVerification: SkillVerificationBehavior;
  onSkillVerificationChange: (behavior: SkillVerificationBehavior) => void;
}

const EVALUATION_MODES: {
  id: MatchEvaluationMode;
  title: string;
  description: string;
  badge: string;
}[] = [
  {
    id: "Evidence-first",
    title: "Evidence-First (Recommended)",
    description:
      "Prioritizes verifiable codebase commits, production architectures, and tangible artifacts over resume tenure and self-reported claims.",
    badge: "Maximum Signal",
  },
  {
    id: "Balanced",
    title: "Balanced Assessment",
    description:
      "Equally weighs structured skill claims from resumes with detected GitHub commits, projects, and work history duration.",
    badge: "Default",
  },
  {
    id: "Skills-first",
    title: "Skills-First Keyword Focus",
    description:
      "Maximizes candidate recall by prioritizing stated skill keywords, role titles, and standard applicant tracking qualifications.",
    badge: "High Recall",
  },
];

const SENSITIVITY_LEVELS: {
  id: EvidenceSensitivity;
  title: string;
  description: string;
}[] = [
  {
    id: "Strict",
    title: "Strict Attribution",
    description:
      "Demands high confidence across multiple concrete sources (e.g. both code commits and employment tenure) before confirming a skill.",
  },
  {
    id: "Standard",
    title: "Standard Verification",
    description:
      "Confirms claims backed by either a verified production project, direct code artifact, or extensive employment tenure.",
  },
  {
    id: "Relaxed",
    title: "Relaxed / Exploratory",
    description:
      "Marks claims supported if contextually aligned with related technologies or course certifications.",
  },
];

export function EvaluationSettingsSection({
  evaluationMode,
  onEvaluationModeChange,
  evidenceSensitivity,
  onEvidenceSensitivityChange,
  minEvidenceThreshold,
  onMinEvidenceThresholdChange,
  skillVerification,
  onSkillVerificationChange,
}: EvaluationSettingsSectionProps) {
  const toggleVerification = (key: keyof SkillVerificationBehavior) => {
    onSkillVerificationChange({
      ...skillVerification,
      [key]: !skillVerification[key],
    });
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-950">
          Evaluation Settings
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Configure how ResumeX balances candidate claim verification, strictness tolerances, and evidence thresholds.
        </p>
      </div>

      {/* 1. Match Evaluation Mode */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold text-zinc-900 block">
            Candidate Evaluation Mode
          </label>
          <p className="text-xs text-zinc-500 mt-0.5">
            Determines whether candidate rankings prioritize verified technical evidence or broader keyword alignment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {EVALUATION_MODES.map((mode) => {
            const isSelected = evaluationMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => onEvaluationModeChange(mode.id)}
                className={cn(
                  "cursor-pointer rounded-lg border p-3.5 transition-all",
                  isSelected
                    ? "border-brand-500 bg-brand-50/40 shadow-xs ring-1 ring-brand-500"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="evaluationMode"
                      checked={isSelected}
                      onChange={() => onEvaluationModeChange(mode.id)}
                      className="text-brand-600 focus:ring-brand-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-950">
                      {mode.title}
                    </span>
                  </div>
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 border border-zinc-200">
                    {mode.badge}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-zinc-600 pl-5 leading-relaxed">
                  {mode.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Evidence Sensitivity */}
      <div className="space-y-3 pt-4 border-t border-zinc-100">
        <div>
          <label className="text-xs font-semibold text-zinc-900 block">
            Evidence Verification Strictness
          </label>
          <p className="text-xs text-zinc-500 mt-0.5">
            Controls the scrutiny required before a skill claim is confirmed as "Strong evidence".
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {SENSITIVITY_LEVELS.map((level) => {
            const isSelected = evidenceSensitivity === level.id;
            return (
              <div
                key={level.id}
                onClick={() => onEvidenceSensitivityChange(level.id)}
                className={cn(
                  "cursor-pointer rounded-lg border p-3 transition-all",
                  isSelected
                    ? "border-brand-500 bg-brand-50/40 shadow-xs ring-1 ring-brand-500"
                    : "border-zinc-200 bg-white hover:bg-zinc-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="evidenceSensitivity"
                    checked={isSelected}
                    onChange={() => onEvidenceSensitivityChange(level.id)}
                    className="text-brand-600 focus:ring-brand-500 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-zinc-950">
                    {level.title}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-600 pl-5 leading-relaxed">
                  {level.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Minimum Evidence Confidence Threshold */}
      <div className="space-y-3 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-semibold text-zinc-900 block">
              Minimum Verification Threshold: {minEvidenceThreshold}%
            </label>
            <p className="text-xs text-zinc-500 mt-0.5">
              Claims scoring below this confidence value are marked as "Needs verification".
            </p>
          </div>
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-800">
            {minEvidenceThreshold}%
          </span>
        </div>

        <div className="space-y-1">
          <input
            type="range"
            min={50}
            max={90}
            step={5}
            value={minEvidenceThreshold}
            onChange={(e) =>
              onMinEvidenceThresholdChange(Number(e.target.value))
            }
            className="w-full accent-brand-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>50% (Permissive)</span>
            <span>70% (Standard Benchmark)</span>
            <span>90% (Zero Tolerance)</span>
          </div>
        </div>
      </div>

      {/* 4. Skill Verification Behavior Rules */}
      <div className="space-y-3 pt-4 border-t border-zinc-100">
        <div>
          <label className="text-xs font-semibold text-zinc-900 block">
            Accepted Evidence Sources for Skills
          </label>
          <p className="text-xs text-zinc-500 mt-0.5">
            Select which artifact categories count toward verifying technical candidate proficiencies.
          </p>
        </div>

        <div className="space-y-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3.5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={skillVerification.requireProjectEvidence}
              onChange={() => toggleVerification("requireProjectEvidence")}
              className="mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-medium text-zinc-900 block">
                Require Project Evidence for Frameworks & Databases
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Core technologies must be demonstrated inside an actual repository or documented production project.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-zinc-200/60">
            <input
              type="checkbox"
              checked={skillVerification.considerExperienceEvidence}
              onChange={() => toggleVerification("considerExperienceEvidence")}
              className="mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-medium text-zinc-900 block">
                Consider Commercial Tenure Duration
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Full-time tenure at verifiable companies contributes to baseline skill verification score.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-zinc-200/60">
            <input
              type="checkbox"
              checked={skillVerification.considerCertificationEvidence}
              onChange={() =>
                toggleVerification("considerCertificationEvidence")
              }
              className="mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-medium text-zinc-900 block">
                Consider Certification Evidence as Primary Supporting Evidence
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Certifications (AWS Solutions Architect, CKA, etc.) provide verified points without code commits.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-zinc-200/60">
            <input
              type="checkbox"
              checked={skillVerification.considerExternalProfileEvidence}
              onChange={() =>
                toggleVerification("considerExternalProfileEvidence")
              }
              className="mt-0.5 rounded border-zinc-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
            <div>
              <span className="text-xs font-medium text-zinc-900 block">
                Consider External Platform Profiles (GitHub, LeetCode)
              </span>
              <span className="text-[11px] text-zinc-500 block">
                Parse candidate-provided coding links and public algorithm profiles to corroborate expertise.
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
