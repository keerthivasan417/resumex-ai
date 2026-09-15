"use client";

import * as React from "react";
import { SkillItem } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getStatusBadgeVariant } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

interface SkillsTableProps {
  skills: SkillItem[];
  selectedSkill: SkillItem | null;
  onSelectSkill: (skill: SkillItem) => void;
}

export function SkillsTable({
  skills,
  selectedSkill,
  onSelectSkill,
}: SkillsTableProps) {
  if (skills.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center">
        <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
          <Icons.search className="h-5 w-5" />
        </div>
        <h4 className="text-sm font-semibold text-zinc-900">No matching skills found</h4>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
          No skills match your current search query or filter parameters. Try clearing the filter or searching for another term.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3 px-4 font-medium">
                Skill & Proficiency
              </th>
              <th scope="col" className="py-3 px-4 font-medium hidden sm:table-cell">
                Category
              </th>
              <th scope="col" className="py-3 px-4 font-medium">
                Evidence Status
              </th>
              <th scope="col" className="py-3 px-4 font-medium hidden md:table-cell">
                Sources Detected
              </th>
              <th scope="col" className="py-3 px-4 font-medium hidden lg:table-cell">
                Strength
              </th>
              <th scope="col" className="py-3 px-4 font-medium text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {skills.map((skill) => {
              const isSelected = selectedSkill?.id === skill.id;

              const presentSourcesCount = [
                skill.sources.skillsSection.present,
                skill.sources.project.present,
                skill.sources.experience.present,
                skill.sources.certification.present,
                skill.sources.github.present,
              ].filter(Boolean).length;

              return (
                <tr
                  key={skill.id}
                  onClick={() => onSelectSkill(skill)}
                  className={cn(
                    "transition-colors cursor-pointer hover:bg-zinc-50/80",
                    isSelected ? "bg-brand-50/40" : "bg-white"
                  )}
                >
                  {/* Skill Name */}
                  <td className="py-3.5 px-4 font-medium text-zinc-900">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{skill.name}</span>
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                      )}
                    </div>
                    {/* Mobile category */}
                    <span className="text-[11px] text-zinc-500 font-normal sm:hidden block mt-0.5">
                      {skill.category}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 hidden sm:table-cell">
                    <Badge variant="neutral" className="text-[11px] font-mono">
                      {skill.category}
                    </Badge>
                  </td>

                  {/* Evidence Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusBadgeVariant(skill.status)} className="text-xs">
                      {skill.status}
                    </Badge>
                  </td>

                  {/* Sources Count / Icons */}
                  <td className="py-3.5 px-4 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span
                        title={`Skills section: ${skill.sources.skillsSection.present ? "Present" : "Absent"}`}
                        className={cn(
                          "h-5 w-5 rounded flex items-center justify-center text-[10px] font-mono",
                          skill.sources.skillsSection.present
                            ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                            : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        S
                      </span>
                      <span
                        title={`Projects: ${skill.sources.project.present ? "Present" : "Absent"}`}
                        className={cn(
                          "h-5 w-5 rounded flex items-center justify-center text-[10px] font-mono",
                          skill.sources.project.present
                            ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                            : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        P
                      </span>
                      <span
                        title={`Experience: ${skill.sources.experience.present ? "Present" : "Absent"}`}
                        className={cn(
                          "h-5 w-5 rounded flex items-center justify-center text-[10px] font-mono",
                          skill.sources.experience.present
                            ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                            : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        E
                      </span>
                      <span
                        title={`GitHub: ${skill.sources.github.present ? "Present" : "Absent"}`}
                        className={cn(
                          "h-5 w-5 rounded flex items-center justify-center text-[10px] font-mono",
                          skill.sources.github.present
                            ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                            : "bg-zinc-100 text-zinc-400"
                        )}
                      >
                        G
                      </span>
                      <span className="text-[11px] font-mono text-zinc-400 ml-1">
                        {presentSourcesCount}/5
                      </span>
                    </div>
                  </td>

                  {/* Evidence Strength */}
                  <td className="py-3.5 px-4 hidden lg:table-cell">
                    <span
                      className={cn(
                        "font-mono text-xs font-semibold",
                        skill.strength === "High" && "text-emerald-700",
                        skill.strength === "Moderate" && "text-brand-700",
                        skill.strength === "Low" && "text-amber-700",
                        skill.strength === "None" && "text-zinc-400"
                      )}
                    >
                      {skill.strength}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "outline"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSkill(skill);
                      }}
                      className="text-xs h-8"
                    >
                      Audit
                      <Icons.chevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
