"use client";

import React, { useState, useMemo } from "react";
import { JobRequisition, JobStatus, JobLevel } from "@/types/job";
import { mockRequisitions } from "@/lib/mock-jobs";
import { JobHeader } from "@/components/jobs/job-header";
import { JobFiltersBar } from "@/components/jobs/job-filters-bar";
import { JobListTable } from "@/components/jobs/job-list-table";
import { JobDetailPanel } from "@/components/jobs/job-detail-panel";
import { CreateJobModal } from "@/components/jobs/create-job-modal";
import { JobsEmptyState } from "@/components/jobs/jobs-empty-state";

export default function JobsPage() {
  const [requisitions, setRequisitions] =
    useState<JobRequisition[]>(mockRequisitions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "All">("All");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [levelFilter, setLevelFilter] = useState<JobLevel | "All">("All");

  // Selection & Modal States
  const [selectedJob, setSelectedJob] = useState<JobRequisition | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRequisition | null>(null);

  // Available departments
  const availableDepartments = useMemo(() => {
    const set = new Set<string>();
    requisitions.forEach((r) => set.add(r.department));
    return Array.from(set).sort();
  }, [requisitions]);

  // Filtered requisitions
  const filteredRequisitions = useMemo(() => {
    return requisitions.filter((job) => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesDept = job.department.toLowerCase().includes(query);
        const matchesLoc = job.location.toLowerCase().includes(query);
        const matchesSkill = job.requirements.some((req) =>
          req.name.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesDept && !matchesLoc && !matchesSkill) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "All" && job.status !== statusFilter) {
        return false;
      }

      // Department filter
      if (departmentFilter !== "All" && job.department !== departmentFilter) {
        return false;
      }

      // Level filter
      if (levelFilter !== "All" && job.level !== levelFilter) {
        return false;
      }

      return true;
    });
  }, [requisitions, searchQuery, statusFilter, departmentFilter, levelFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "All" ||
    departmentFilter !== "All" ||
    levelFilter !== "All";

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setLevelFilter("All");
  };

  const handleCreateOrUpdate = (jobData: Partial<JobRequisition>) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString("default", {
      month: "short",
    })} ${now.getDate()}, ${now.getFullYear()}`;

    if (jobData.id) {
      // Editing existing requisition
      const updatedList = requisitions.map((job) => {
        if (job.id === jobData.id) {
          const updated: JobRequisition = {
            ...job,
            ...jobData,
            updatedAt: formattedDate,
          } as JobRequisition;
          if (selectedJob?.id === job.id) {
            setSelectedJob(updated);
          }
          return updated;
        }
        return job;
      });
      setRequisitions(updatedList);
    } else {
      // Creating new requisition
      const newJob: JobRequisition = {
        id: `job-${Date.now()}`,
        title: jobData.title || "Untitled Role",
        department: jobData.department || "Engineering",
        level: jobData.level || "Senior",
        location: jobData.location || "Remote",
        workArrangement: jobData.workArrangement || "Remote",
        employmentType: jobData.employmentType || "Full-time",
        status: jobData.status || "Active",
        description: jobData.description || "",
        responsibilities: jobData.responsibilities || [],
        minExperienceYears: jobData.minExperienceYears || 3,
        requirements: jobData.requirements || [],
        candidateCount: 0,
        shortlistCount: 0,
        createdAt: formattedDate,
        updatedAt: formattedDate,
      };
      setRequisitions([newJob, ...requisitions]);
      setSelectedJob(newJob);
    }

    setIsCreateModalOpen(false);
    setEditingJob(null);
  };

  const handleDuplicate = (job: JobRequisition) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString("default", {
      month: "short",
    })} ${now.getDate()}, ${now.getFullYear()}`;

    const duplicated: JobRequisition = {
      ...job,
      id: `job-${Date.now()}`,
      title: `${job.title} (Copy)`,
      status: "Draft",
      candidateCount: 0,
      shortlistCount: 0,
      createdAt: formattedDate,
      updatedAt: formattedDate,
      requirements: job.requirements.map((r) => ({
        ...r,
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      })),
    };

    setRequisitions([duplicated, ...requisitions]);
    setSelectedJob(duplicated);
  };

  const handleStatusToggle = (job: JobRequisition) => {
    const nextStatus: JobStatus = job.status === "Active" ? "Paused" : "Active";
    const now = new Date();
    const formattedDate = `${now.toLocaleString("default", {
      month: "short",
    })} ${now.getDate()}, ${now.getFullYear()}`;

    const updatedList = requisitions.map((item) => {
      if (item.id === job.id) {
        const updated: JobRequisition = {
          ...item,
          status: nextStatus,
          updatedAt: formattedDate,
        };
        if (selectedJob?.id === job.id) {
          setSelectedJob(updated);
        }
        return updated;
      }
      return item;
    });

    setRequisitions(updatedList);
  };

  const activeCount = requisitions.filter((r) => r.status === "Active").length;

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <JobHeader
        totalCount={requisitions.length}
        activeCount={activeCount}
        onCreateRequisition={() => {
          setEditingJob(null);
          setIsCreateModalOpen(true);
        }}
      />

      {/* 2. Search & Filters Bar */}
      {requisitions.length > 0 && (
        <JobFiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          departmentFilter={departmentFilter}
          onDepartmentFilterChange={setDepartmentFilter}
          levelFilter={levelFilter}
          onLevelFilterChange={setLevelFilter}
          availableDepartments={availableDepartments}
          totalResults={filteredRequisitions.length}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* 3. Requisition List or Empty State */}
      {requisitions.length === 0 ? (
        <JobsEmptyState
          isFiltered={false}
          onCreateRequisition={() => {
            setEditingJob(null);
            setIsCreateModalOpen(true);
          }}
        />
      ) : filteredRequisitions.length === 0 ? (
        <JobsEmptyState
          isFiltered={true}
          onClearFilters={handleClearFilters}
          onCreateRequisition={() => {
            setEditingJob(null);
            setIsCreateModalOpen(true);
          }}
        />
      ) : (
        <JobListTable
          requisitions={filteredRequisitions}
          selectedJobId={selectedJob?.id}
          onSelectJob={(job) => setSelectedJob(job)}
          onEditJob={(job) => {
            setEditingJob(job);
            setIsCreateModalOpen(true);
          }}
          onDuplicateJob={handleDuplicate}
          onStatusToggle={handleStatusToggle}
        />
      )}

      {/* 4. Requisition Detail Slide-Over Workspace */}
      <JobDetailPanel
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onEdit={(job) => {
          setEditingJob(job);
          setIsCreateModalOpen(true);
        }}
        onDuplicate={handleDuplicate}
        onStatusToggle={handleStatusToggle}
      />

      {/* 5. Create / Edit Requisition Modal */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleCreateOrUpdate}
        initialJob={editingJob}
      />
    </div>
  );
}
