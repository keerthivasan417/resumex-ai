import React from "react";
import { MatchingWeights, WeightTier } from "@/types/settings";
import { cn } from "@/lib/utils";

interface MatchingSettingsSectionProps {
  weights: MatchingWeights;
  onWeightsChange: (weights: MatchingWeights) => void;
}

interface DimensionConfig {
  key: keyof MatchingWeights;
  title: string;
  description: string;
  impactExplanation: string;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: "skillRequirements",
    title: "Requisition Skill Requirements",
    description: "Evaluates exact match against Must-have and Preferred skills.",
    impactExplanation:
      "When set to High, candidates missing any Must-have skill receive significant match score penalties.",
  },
  {
    key: "evidenceStrength",
    title: "Verified Evidence Strength",
    description: "Evaluates code commits, pull requests, and repository depth.",
    impactExplanation:
      "When set to High, claims supported by multi-commit code repositories heavily outrank unverified resume mentions.",
  },
  {
    key: "projectRelevance",
    title: "Production Project Relevance",
    description: "Evaluates architectural scale, throughput metrics, and business domain impact.",
    impactExplanation:
      "Elevates candidates who demonstrated practical application of the stack in production environments.",
  },
  {
    key: "experience",
    title: "Tenure & Seniority Duration",
    description: "Evaluates total years of verified commercial software experience.",
    impactExplanation:
      "When set to Low or Medium, enables high-evidence candidates with fewer years of experience to rank competitively.",
  },
  {
    key: "semanticRelevance",
    title: "Semantic & Conceptual Proximity",
    description: "Evaluates technology adjacencies (e.g. Go ↔ Rust, FastAPI ↔ Flask).",
    impactExplanation:
      "Enables candidates proficient in closely adjacent technologies to be surfaced as viable crossovers.",
  },
];

const TIERS: WeightTier[] = ["High", "Medium", "Low", "Disabled"];

export function MatchingSettingsSection({
  weights,
  onWeightsChange,
}: MatchingSettingsSectionProps) {
  const handleTierChange = (key: keyof MatchingWeights, tier: WeightTier) => {
    onWeightsChange({
      ...weights,
      [key]: tier,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-950">
          Matching Weights & Priorities
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Adjust the relative importance of evaluation criteria. These weights govern candidate compatibility scores in /app/matches and /app/candidates.
        </p>
      </div>

      <div className="space-y-3">
        {DIMENSIONS.map((dim) => {
          const currentTier = weights[dim.key];

          return (
            <div
              key={dim.key}
              className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2.5 transition-colors hover:border-zinc-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-zinc-950">
                    {dim.title}
                  </h3>
                  <p className="text-xs text-zinc-500">{dim.description}</p>
                </div>

                {/* Priority Selector Pill Buttons */}
                <div className="inline-flex rounded-lg border border-zinc-200 bg-zinc-50 p-0.5">
                  {TIERS.map((tier) => {
                    const isSelected = currentTier === tier;
                    return (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => handleTierChange(dim.key, tier)}
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                          isSelected
                            ? tier === "High"
                              ? "bg-brand-700 text-white shadow-xs"
                              : tier === "Medium"
                              ? "bg-zinc-900 text-white shadow-xs"
                              : tier === "Low"
                              ? "bg-zinc-700 text-white shadow-xs"
                              : "bg-zinc-300 text-zinc-800"
                            : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                        )}
                      >
                        {tier}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded bg-zinc-50 p-2 text-[11px] text-zinc-600 border border-zinc-100 leading-relaxed">
                <span className="font-semibold text-zinc-800">Impact: </span>
                {dim.impactExplanation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
