"use client";

import * as React from "react";
import Link from "next/link";
import { TechnicalCategory } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

interface TechnicalBreadthMatrixProps {
  categories: TechnicalCategory[];
}

export function TechnicalBreadthMatrix({ categories }: TechnicalBreadthMatrixProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Technical Breadth & Verification Fingerprint
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Developer strengths reported by the linked public source and their repository evidence counts.
            </p>
          </div>
          <Link href="/app/skills">
            <Badge variant="brand" className="text-[10px] font-mono hover:bg-brand-100 cursor-pointer">
              AUDIT ALL SKILLS →
            </Badge>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {categories.length === 0 ? (
          <p className="text-xs text-zinc-500">Not provided by the developer-intelligence source.</p>
        ) : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3.5 space-y-2.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-zinc-200/80 pb-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-800 font-mono">
                  {cat.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {cat.skills.length} tracked
                </span>
              </div>

              <div className="space-y-1.5 flex-1">
                {cat.skills.map((skill) => (
                  <Link
                    key={skill.name}
                    href="/app/skills"
                    className="flex items-center justify-between p-1.5 rounded hover:bg-white hover:shadow-xs transition-all text-xs group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          skill.status === "Verified" && "bg-emerald-600",
                          skill.status === "Supported" && "bg-brand-600",
                          skill.status === "Exploratory" && "bg-zinc-400"
                        )}
                      />
                      <span className="font-medium text-zinc-900 group-hover:text-brand-700">
                        {skill.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[10px]">
                      <span className="text-zinc-400">{skill.evidenceCount} sources</span>
                      <Badge
                        variant={
                          skill.status === "Verified"
                            ? "success"
                            : skill.status === "Supported"
                            ? "brand"
                            : "outline"
                        }
                        className="text-[9px] px-1 py-0 font-mono"
                      >
                        {skill.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>}
      </CardContent>
    </Card>
  );
}
