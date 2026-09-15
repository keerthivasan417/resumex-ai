"use client";

import React, { useState, useMemo } from "react";
import {
  WorkspaceSettings,
  MatchEvaluationMode,
  EvidenceSensitivity,
  SkillVerificationBehavior,
  MatchingWeights,
  VerificationPolicy,
  TeamMember,
  TeamRole,
} from "@/types/settings";
import { defaultSettings } from "@/lib/mock-settings";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
  SettingsNav,
  SettingsSectionId,
} from "@/components/settings/settings-nav";
import { EvaluationSettingsSection } from "@/components/settings/evaluation-settings-section";
import { MatchingSettingsSection } from "@/components/settings/matching-settings-section";
import { ExternalSourcesSection } from "@/components/settings/external-sources-section";
import { VerificationPolicySection } from "@/components/settings/verification-policy-section";
import { TeamSettingsSection } from "@/components/settings/team-settings-section";
import { DangerZoneSection } from "@/components/settings/danger-zone-section";

export default function SettingsPage() {
  // Navigation active section
  const [activeSection, setActiveSection] =
    useState<SettingsSectionId>("evaluation");

  // Local settings state
  const [settings, setSettings] = useState<WorkspaceSettings>(defaultSettings);
  const [savedSettings, setSavedSettings] =
    useState<WorkspaceSettings>(defaultSettings);

  // Status message
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Detect dirty unsaved changes
  const isDirty = useMemo(() => {
    return JSON.stringify(settings) !== JSON.stringify(savedSettings);
  }, [settings, savedSettings]);

  const handleSave = () => {
    setSavedSettings(settings);
    setSaveMessage("Changes saved locally for this session.");
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  const handleResetToDefaults = () => {
    setSettings(defaultSettings);
    setSavedSettings(defaultSettings);
    setSaveMessage("Settings restored to baseline defaults.");
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  // Section-specific change handlers
  const handleEvaluationModeChange = (mode: MatchEvaluationMode) => {
    setSettings((prev) => ({ ...prev, evaluationMode: mode }));
  };

  const handleEvidenceSensitivityChange = (
    sensitivity: EvidenceSensitivity
  ) => {
    setSettings((prev) => ({ ...prev, evidenceSensitivity: sensitivity }));
  };

  const handleMinEvidenceThresholdChange = (threshold: number) => {
    setSettings((prev) => ({ ...prev, minEvidenceThreshold: threshold }));
  };

  const handleSkillVerificationChange = (
    behavior: SkillVerificationBehavior
  ) => {
    setSettings((prev) => ({ ...prev, skillVerification: behavior }));
  };

  const handleMatchingWeightsChange = (weights: MatchingWeights) => {
    setSettings((prev) => ({ ...prev, matchingWeights: weights }));
  };

  const handleToggleSource = (sourceId: string) => {
    setSettings((prev) => ({
      ...prev,
      externalSources: prev.externalSources.map((src) =>
        src.id === sourceId ? { ...src, enabled: !src.enabled } : src
      ),
    }));
  };

  const handlePolicyChange = (policy: VerificationPolicy) => {
    setSettings((prev) => ({ ...prev, verificationPolicy: policy }));
  };

  const handleWorkspaceNameChange = (name: string) => {
    setSettings((prev) => ({ ...prev, workspaceName: name }));
  };

  const handleRoleChange = (memberId: string, newRole: TeamRole) => {
    setSettings((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((m) =>
        m.id === memberId ? { ...m, role: newRole } : m
      ),
    }));
  };

  const handleRemoveMember = (memberId: string) => {
    setSettings((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((m) => m.id !== memberId),
    }));
  };

  const handleAddMember = (newMember: TeamMember) => {
    setSettings((prev) => ({
      ...prev,
      teamMembers: [...prev.teamMembers, newMember],
    }));
  };

  const handleResetWorkspace = () => {
    handleResetToDefaults();
  };

  const handleClearAnalysisData = () => {
    setSaveMessage("Local candidate cache and overrides purged.");
    setTimeout(() => {
      setSaveMessage(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Page Header */}
      <div className="flex flex-col gap-2 border-b border-zinc-200 pb-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Configure how ResumeX evaluates candidates and handles evidence.
          </p>
        </div>

        {/* Global Save Controls */}
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 animate-in fade-in">
              ✓ {saveMessage}
            </span>
          )}

          {isDirty && (
            <span className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleResetToDefaults}
            className="text-xs text-zinc-600"
          >
            Reset to Defaults
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
            className="text-xs shadow-xs"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* 2. Two-Column Settings Layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Column: Section Navigation */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="md:sticky md:top-6">
            <SettingsNav
              activeSection={activeSection}
              onSelectSection={setActiveSection}
            />

            {/* Quick Helper Note */}
            <div className="hidden md:block mt-6 rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 text-[11px] text-zinc-500 leading-relaxed">
              <span className="font-semibold text-zinc-700 block mb-1">
                Local Session State:
              </span>
              Configuration updates apply dynamically to your active session. ResumeX does not persist changes to an external database.
            </div>
          </div>
        </div>

        {/* Right Column: Active Settings Section Content */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-xs">
            {activeSection === "evaluation" && (
              <EvaluationSettingsSection
                evaluationMode={settings.evaluationMode}
                onEvaluationModeChange={handleEvaluationModeChange}
                evidenceSensitivity={settings.evidenceSensitivity}
                onEvidenceSensitivityChange={handleEvidenceSensitivityChange}
                minEvidenceThreshold={settings.minEvidenceThreshold}
                onMinEvidenceThresholdChange={handleMinEvidenceThresholdChange}
                skillVerification={settings.skillVerification}
                onSkillVerificationChange={handleSkillVerificationChange}
              />
            )}

            {activeSection === "matching" && (
              <MatchingSettingsSection
                weights={settings.matchingWeights}
                onWeightsChange={handleMatchingWeightsChange}
              />
            )}

            {activeSection === "sources" && (
              <ExternalSourcesSection
                sources={settings.externalSources}
                onToggleSource={handleToggleSource}
              />
            )}

            {activeSection === "policy" && (
              <VerificationPolicySection
                policy={settings.verificationPolicy}
                onPolicyChange={handlePolicyChange}
              />
            )}

            {activeSection === "team" && (
              <TeamSettingsSection
                workspaceName={settings.workspaceName}
                onWorkspaceNameChange={handleWorkspaceNameChange}
                workspaceSlug={settings.workspaceSlug}
                teamMembers={settings.teamMembers}
                onRoleChange={handleRoleChange}
                onRemoveMember={handleRemoveMember}
                onAddMember={handleAddMember}
              />
            )}

            {activeSection === "danger" && (
              <DangerZoneSection
                onResetWorkspace={handleResetWorkspace}
                onClearAnalysisData={handleClearAnalysisData}
              />
            )}
          </div>
        </div>
      </div>

      {/* 3. Sticky Bottom Save Bar (Visible when there are unsaved changes) */}
      {isDirty && (
        <div className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-zinc-900 bg-zinc-950 p-3 px-5 text-white shadow-2xl animate-in slide-in-from-bottom-2 duration-150 flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold text-zinc-100">
              You have unsaved configuration changes
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefaults}
              className="text-xs text-zinc-400 hover:text-white px-2 py-1"
            >
              Discard
            </button>
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 text-xs bg-brand-500 hover:bg-brand-600 text-white font-semibold"
            >
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
