import React, { useState } from "react";
import { JobSkillRequirement, RequirementPriority } from "@/types/job";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getPriorityBadgeVariant } from "@/lib/mock-jobs";

interface RequirementBuilderProps {
  requirements: JobSkillRequirement[];
  onChange: (requirements: JobSkillRequirement[]) => void;
}

const PRIORITIES: RequirementPriority[] = [
  "Must have",
  "Preferred",
  "Nice to have",
];

export function RequirementBuilder({
  requirements,
  onChange,
}: RequirementBuilderProps) {
  const [skillName, setSkillName] = useState("");
  const [priority, setPriority] = useState<RequirementPriority>("Must have");
  const [description, setDescription] = useState("");
  const [showDescriptionField, setShowDescriptionField] = useState(false);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = skillName.trim();
    if (!trimmed) return;

    // Check duplicate
    if (
      requirements.some(
        (r) => r.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      alert(`Requirement for "${trimmed}" is already added.`);
      return;
    }

    const newReq: JobSkillRequirement = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: trimmed,
      priority,
      description: description.trim() || undefined,
    };

    onChange([...requirements, newReq]);
    setSkillName("");
    setDescription("");
    setShowDescriptionField(false);
  };

  const handleRemove = (id: string) => {
    onChange(requirements.filter((r) => r.id !== id));
  };

  const grouped = {
    mustHave: requirements.filter((r) => r.priority === "Must have"),
    preferred: requirements.filter((r) => r.priority === "Preferred"),
    niceToHave: requirements.filter((r) => r.priority === "Nice to have"),
  };

  return (
    <div className="space-y-4">
      {/* Input controls */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50/70 p-3 space-y-2.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="e.g. PostgreSQL, Go, Kubernetes..."
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as RequirementPriority)
              }
              className="h-9 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <Button
              type="button"
              onClick={() => handleAdd()}
              size="sm"
              disabled={!skillName.trim()}
              className="h-9 gap-1 text-xs"
            >
              <Icons.plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </Button>
          </div>
        </div>

        {/* Optional context toggle */}
        <div className="flex items-center justify-between pt-1 text-xs">
          {!showDescriptionField ? (
            <button
              type="button"
              onClick={() => setShowDescriptionField(true)}
              className="text-xs text-zinc-500 hover:text-brand-600 underline-offset-2 hover:underline"
            >
              + Add qualification note/criterion
            </button>
          ) : (
            <div className="w-full space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-zinc-500">
                  Criterion / verified evidence expectations (optional)
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowDescriptionField(false);
                    setDescription("");
                  }}
                  className="text-[11px] text-zinc-400 hover:text-zinc-600"
                >
                  Cancel
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. 3+ years writing concurrent pipelines, Kafka offset management..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
                className="h-8 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-800 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Requirement Priority Lists */}
      <div className="space-y-3">
        {/* Must Have */}
        <div>
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-600" />
              Must have
              <span className="text-zinc-400 font-normal">
                ({grouped.mustHave.length})
              </span>
            </span>
          </div>

          {grouped.mustHave.length === 0 ? (
            <p className="text-xs italic text-zinc-400 py-1">
              No must-have requirements added yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {grouped.mustHave.map((req) => (
                <div
                  key={req.id}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-brand-200 bg-brand-50/60 px-2 py-1 text-xs text-brand-900"
                  title={req.description}
                >
                  <span className="font-medium">{req.name}</span>
                  {req.description && (
                    <span className="text-[10px] text-brand-700/80 max-w-[140px] truncate">
                      ({req.description})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(req.id)}
                    className="text-brand-400 hover:text-brand-700 ml-0.5"
                    title="Remove requirement"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preferred */}
        <div>
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-500" />
              Preferred
              <span className="text-zinc-400 font-normal">
                ({grouped.preferred.length})
              </span>
            </span>
          </div>

          {grouped.preferred.length === 0 ? (
            <p className="text-xs italic text-zinc-400 py-1">
              No preferred requirements added.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {grouped.preferred.map((req) => (
                <div
                  key={req.id}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs text-zinc-800"
                  title={req.description}
                >
                  <span className="font-medium">{req.name}</span>
                  {req.description && (
                    <span className="text-[10px] text-zinc-500 max-w-[140px] truncate">
                      ({req.description})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(req.id)}
                    className="text-zinc-400 hover:text-zinc-700 ml-0.5"
                    title="Remove requirement"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nice to have */}
        <div>
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-zinc-300" />
              Nice to have
              <span className="text-zinc-400 font-normal">
                ({grouped.niceToHave.length})
              </span>
            </span>
          </div>

          {grouped.niceToHave.length === 0 ? (
            <p className="text-xs italic text-zinc-400 py-1">
              No nice-to-have requirements added.
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {grouped.niceToHave.map((req) => (
                <div
                  key={req.id}
                  className="group inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                  title={req.description}
                >
                  <span className="font-medium">{req.name}</span>
                  {req.description && (
                    <span className="text-[10px] text-zinc-400 max-w-[140px] truncate">
                      ({req.description})
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(req.id)}
                    className="text-zinc-400 hover:text-zinc-700 ml-0.5"
                    title="Remove requirement"
                  >
                    <Icons.x className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
