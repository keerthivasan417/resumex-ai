import React from "react";
import { VerificationPolicy } from "@/types/settings";
import { Icons } from "@/components/ui/icons";

interface VerificationPolicySectionProps {
  policy: VerificationPolicy;
  onPolicyChange: (policy: VerificationPolicy) => void;
}

export function VerificationPolicySection({
  policy,
  onPolicyChange,
}: VerificationPolicySectionProps) {
  const updatePolicy = (key: keyof VerificationPolicy, value: any) => {
    onPolicyChange({
      ...policy,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-950">
          Verification Policy & Standards
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Define how ResumeX classifies unverified claims, sets minimum evidence thresholds, and handles alternative proof.
        </p>
      </div>

      {/* Prominent Truth In Verification Callout */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-2">
        <div className="flex items-center gap-2 text-amber-900">
          <Icons.alertCircle className="h-4 w-4 text-amber-600 shrink-0" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Verification Policy Principle
          </h3>
        </div>
        <p className="text-xs text-amber-950 leading-relaxed pl-6 font-medium">
          "Needs verification" does not mean a candidate claim is false or fabricated.
        </p>
        <p className="text-xs text-amber-900/80 leading-relaxed pl-6">
          It means ResumeX did not identify sufficient supporting evidence from currently available sources (e.g. open-source repositories, verifiable project documentation, or employment tenure) to independently substantiate the claim.
        </p>
      </div>

      {/* Policy Configuration Controls */}
      <div className="space-y-4">
        {/* Minimum Evidence Sources */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-zinc-950 block">
                Minimum Supporting Evidence Sources
              </label>
              <p className="text-xs text-zinc-500">
                Number of independent source artifacts required to promote a skill to "Strong evidence".
              </p>
            </div>
            <select
              value={policy.minimumEvidenceSources}
              onChange={(e) =>
                updatePolicy("minimumEvidenceSources", Number(e.target.value))
              }
              className="h-8 rounded-md border border-zinc-200 bg-white px-3 text-xs font-semibold text-zinc-900 focus:border-brand-500 focus:outline-none"
            >
              <option value={1}>1 Independent Source</option>
              <option value={2}>2 Sources (Default)</option>
              <option value={3}>3 Sources (Ultra Strict)</option>
            </select>
          </div>
        </div>

        {/* Technical Project Evidence Requirement */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-zinc-950 block">
              Mandatory Project Proof for Technical Skills
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              When enabled, backend frameworks, distributed systems, and databases require tangible project or code artifact proof to pass baseline screening.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updatePolicy(
                "projectEvidenceRequiredForTech",
                !policy.projectEvidenceRequiredForTech
              )
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              policy.projectEvidenceRequiredForTech
                ? "bg-brand-600"
                : "bg-zinc-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                policy.projectEvidenceRequiredForTech
                  ? "translate-x-4"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Certifications as Primary Evidence */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-zinc-950 block">
              Count Industry Certifications as Primary Evidence
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              When enabled, vendor certifications (AWS Certified Solutions Architect, CKA, Google Cloud Professional) satisfy cloud and DevOps requirements without requiring GitHub commits.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updatePolicy(
                "certificationsAsPrimary",
                !policy.certificationsAsPrimary
              )
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              policy.certificationsAsPrimary
                ? "bg-brand-600"
                : "bg-zinc-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                policy.certificationsAsPrimary
                  ? "translate-x-4"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* External Evidence Consideration */}
        <div className="rounded-lg border border-zinc-200 bg-white p-4 flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-zinc-950 block">
              Incorporate External Platform Artifacts
            </span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Permit public GitHub commits, competitive programming scores, and verified links to upgrade unverified resume claims into supported skills.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              updatePolicy(
                "externalEvidenceConsidered",
                !policy.externalEvidenceConsidered
              )
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              policy.externalEvidenceConsidered
                ? "bg-brand-600"
                : "bg-zinc-300"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                policy.externalEvidenceConsidered
                  ? "translate-x-4"
                  : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
