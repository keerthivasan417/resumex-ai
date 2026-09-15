import React, { useState, useEffect } from "react";
import {
  JobRequisition,
  JobLevel,
  WorkArrangement,
  EmploymentType,
  JobSkillRequirement,
  JobStatus,
} from "@/types/job";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { RequirementBuilder } from "./requirement-builder";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Partial<JobRequisition>) => void;
  initialJob?: JobRequisition | null;
}

const LEVELS: JobLevel[] = [
  "Junior",
  "Mid",
  "Senior",
  "Staff",
  "Lead",
  "Principal",
];

const ARRANGEMENTS: WorkArrangement[] = ["Remote", "Hybrid", "On-site"];
const EMPLOYMENT_TYPES: EmploymentType[] = [
  "Full-time",
  "Contract",
  "Part-time",
];

export function CreateJobModal({
  isOpen,
  onClose,
  onSave,
  initialJob,
}: CreateJobModalProps) {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [level, setLevel] = useState<JobLevel>("Senior");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workArrangement, setWorkArrangement] =
    useState<WorkArrangement>("Hybrid");
  const [employmentType, setEmploymentType] =
    useState<EmploymentType>("Full-time");
  const [minExperienceYears, setMinExperienceYears] = useState(4);
  const [description, setDescription] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [requirements, setRequirements] = useState<JobSkillRequirement[]>([]);
  const [status, setStatus] = useState<JobStatus>("Active");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialJob) {
      setTitle(initialJob.title);
      setDepartment(initialJob.department);
      setLevel(initialJob.level);
      setLocation(initialJob.location);
      setWorkArrangement(initialJob.workArrangement);
      setEmploymentType(initialJob.employmentType);
      setMinExperienceYears(initialJob.minExperienceYears);
      setDescription(initialJob.description);
      setResponsibilitiesText(initialJob.responsibilities.join("\n"));
      setRequirements(initialJob.requirements);
      setStatus(initialJob.status);
    } else {
      // Default template values for quick testing
      setTitle("");
      setDepartment("Platform Core");
      setLevel("Senior");
      setLocation("San Francisco, CA");
      setWorkArrangement("Hybrid");
      setEmploymentType("Full-time");
      setMinExperienceYears(4);
      setDescription("");
      setResponsibilitiesText("");
      setRequirements([
        {
          id: "req-init-1",
          name: "Python",
          priority: "Must have",
          description: "Production API services & asynchronous pipelines",
        },
        {
          id: "req-init-2",
          name: "PostgreSQL",
          priority: "Must have",
          description: "Data modeling, migrations, query plans",
        },
        {
          id: "req-init-3",
          name: "Docker",
          priority: "Preferred",
          description: "Multi-stage container builds & local compose",
        },
      ]);
      setStatus("Active");
    }
    setErrors({});
  }, [initialJob, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Job title is required.";
    if (!department.trim()) newErrors.department = "Department is required.";
    if (!description.trim())
      newErrors.description = "Role description is required.";
    if (requirements.length === 0)
      newErrors.requirements = "Please add at least one requirement.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (saveStatus: JobStatus) => {
    if (!validate()) return;

    const respList = responsibilitiesText
      .split("\n")
      .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
      .filter(Boolean);

    onSave({
      id: initialJob?.id,
      title: title.trim(),
      department: department.trim(),
      level,
      location: location.trim() || "Remote",
      workArrangement,
      employmentType,
      minExperienceYears: Number(minExperienceYears) || 0,
      description: description.trim(),
      responsibilities:
        respList.length > 0
          ? respList
          : [
              "Lead technical design and deliver production-grade services.",
              "Collaborate with engineering leadership on system standards.",
            ],
      requirements,
      status: saveStatus,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-zinc-200 bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              {initialJob ? "Edit Job Requisition" : "Create Job Requisition"}
            </h2>
            <p className="text-xs text-zinc-500">
              Define evaluation benchmarks and required verified evidence criteria.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <Icons.x className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Section: Basic Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              1. Basic Information
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-800">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Backend & Distributed Systems Engineer"
                className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.title && (
                <p className="text-[11px] text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-800">
                  Department <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Platform Core"
                  className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-800">
                  Seniority Level
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as JobLevel)}
                  className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-800">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-800">
                  Work Arrangement
                </label>
                <select
                  value={workArrangement}
                  onChange={(e) =>
                    setWorkArrangement(e.target.value as WorkArrangement)
                  }
                  className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {ARRANGEMENTS.map((arr) => (
                    <option key={arr} value={arr}>
                      {arr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-800">
                  Employment Type
                </label>
                <select
                  value={employmentType}
                  onChange={(e) =>
                    setEmploymentType(e.target.value as EmploymentType)
                  }
                  className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {EMPLOYMENT_TYPES.map((emp) => (
                    <option key={emp} value={emp}>
                      {emp}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full sm:w-1/3 space-y-1.5">
              <label className="text-xs font-medium text-zinc-800">
                Minimum Experience (years)
              </label>
              <input
                type="number"
                min={0}
                max={25}
                value={minExperienceYears}
                onChange={(e) => setMinExperienceYears(Number(e.target.value))}
                className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Section: Description & Responsibilities */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              2. Role Scope & Responsibilities
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-800">
                Role Overview / Purpose <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this role will build and the primary business/technical outcome..."
                className="w-full rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              {errors.description && (
                <p className="text-[11px] text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-800">
                  Key Responsibilities
                </label>
                <span className="text-[11px] text-zinc-400">
                  One bullet point per line
                </span>
              </div>
              <textarea
                rows={3}
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                placeholder="• Architect and scale event-driven streaming pipelines&#10;• Optimize database query latency and caching strategies&#10;• Mentor junior engineers and conduct rigorous code reviews"
                className="w-full rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 font-mono"
              />
            </div>
          </div>

          {/* Section: Skill Requirements Builder */}
          <div className="space-y-3 pt-2 border-t border-zinc-100">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                3. Technical Skill Requirements & Evidence Criteria
              </h3>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                Categorize requirements to power precise candidate evidence verification and scoring.
              </p>
            </div>

            <RequirementBuilder
              requirements={requirements}
              onChange={(updated) => setRequirements(updated)}
            />
            {errors.requirements && (
              <p className="text-[11px] text-red-600">{errors.requirements}</p>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-zinc-200 px-6 py-3.5 bg-zinc-50/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-zinc-600"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSubmit("Draft")}
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => handleSubmit("Active")}
            >
              {initialJob ? "Save Changes" : "Publish Requisition"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
