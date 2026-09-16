"use client";

import * as React from "react";
import Link from "next/link";
import { ProjectItem } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface RepositoriesProjectsListProps {
  projects: ProjectItem[];
}

export function RepositoriesProjectsList({ projects }: RepositoriesProjectsListProps) {
  const [selectedTech, setSelectedTech] = React.useState<string>("All");

  const allTechs = ["All", ...new Set(projects.flatMap((project) => project.technologies))];

  const filteredProjects = React.useMemo(() => {
    if (selectedTech === "All") return projects;
    return projects.filter((p) => p.technologies.includes(selectedTech));
  }, [projects, selectedTech]);

  return (
    <Card className="border-zinc-200 bg-white shadow-xs">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Verified Technical Projects & Repositories
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Public repository metadata returned by the linked source.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
            {allTechs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTech(t)}
                className={`px-2 py-1 rounded transition-colors cursor-pointer whitespace-nowrap ${
                  selectedTech === t
                    ? "bg-zinc-900 text-white font-semibold"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {filteredProjects.length === 0 ? (
          <p className="text-xs text-zinc-500">Not provided by the developer-intelligence source.</p>
        ) : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-zinc-200 bg-zinc-50/40 p-4 space-y-3 flex flex-col justify-between hover:border-zinc-300 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-zinc-900">
                    <Icons.gitBranch className="h-4 w-4 text-brand-700 shrink-0" />
                    <span className="font-semibold text-xs font-mono truncate">
                      {project.name}
                    </span>
                  </div>
                  <Badge variant="success" className="text-[10px] font-mono shrink-0">
                    {project.evidenceBadge}
                  </Badge>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed font-mono">
                  {project.description}
                </p>

                {/* Architecture Scope */}
                <div className="rounded border border-zinc-200/80 bg-white p-2.5 text-[11px] text-zinc-700 space-y-1">
                  <span className="font-semibold font-mono text-zinc-800 block text-[10px] uppercase tracking-wider text-zinc-400">
                    Architecture Scope
                  </span>
                  <p className="font-mono leading-relaxed">{project.architectureScope}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200/60 flex flex-col gap-2">
                {/* Tech Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {project.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.5 rounded bg-zinc-200/70 text-zinc-800 text-[10px] font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom link & relevance */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-zinc-500">
                  <span className="truncate pr-2">{project.relevance}</span>
                  {project.repoUrl ? <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-700 hover:text-brand-900 font-semibold shrink-0 flex items-center gap-1"
                  >
                    View Repo
                    <Icons.arrowRight className="h-3 w-3" />
                  </a> : <span>Not provided</span>}
                </div>
              </div>
            </div>
          ))}
        </div>}
      </CardContent>
    </Card>
  );
}
