import * as React from "react";
import { ResumeProfileData } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface ReportResumeProfileProps {
  profile: ResumeProfileData;
}

export function ReportResumeProfile({ profile }: ReportResumeProfileProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs print-card print-break-inside-avoid">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-800 text-xs font-mono font-bold">
              2
            </span>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Resume Profile & Academic Background
            </CardTitle>
          </div>
          <Badge variant="neutral" className="text-[10px] font-mono">
            DOCUMENT INGESTION
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4 text-xs">
        {/* Technical Focus Badge Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-md bg-zinc-50 border border-zinc-200">
          <span className="font-semibold text-zinc-900 font-mono text-[11px] uppercase tracking-wider">
            Primary Engineering Focus:
          </span>
          <span className="font-mono text-zinc-700 text-xs">{profile.technicalFocus}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Work Experience */}
          <div className="space-y-3">
            <span className="font-semibold text-zinc-900 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Icons.briefcase className="h-3.5 w-3.5 text-zinc-500" />
              Verified Commercial Tenure
            </span>
            <div className="space-y-2.5">
              {profile.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-zinc-200 p-3 space-y-1 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">{exp.role}</span>
                    <span className="text-[11px] font-mono text-zinc-400">{exp.period}</span>
                  </div>
                  <div className="text-xs text-brand-800 font-mono font-medium">
                    {exp.company}
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed font-mono pt-1">
                    {exp.highlights}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="space-y-4">
            {/* Education */}
            <div className="space-y-2">
              <span className="font-semibold text-zinc-900 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Icons.fileText className="h-3.5 w-3.5 text-zinc-500" />
                Academic Degree
              </span>
              {profile.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-zinc-200 p-3 space-y-1 bg-white"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-zinc-900">{edu.degree}</span>
                    <span className="text-[11px] font-mono text-zinc-400">{edu.period}</span>
                  </div>
                  <p className="text-xs text-zinc-700 font-mono">{edu.institution}</p>
                  {edu.honors && (
                    <p className="text-[11px] text-zinc-500 font-mono pt-1">
                      {edu.honors}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="space-y-2">
              <span className="font-semibold text-zinc-900 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                <Icons.checkCircle className="h-3.5 w-3.5 text-emerald-600" />
                Certifications on Record
              </span>
              {profile.certifications.map((cert, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-zinc-200 p-3 flex items-center justify-between bg-white"
                >
                  <div>
                    <p className="font-semibold text-zinc-900">{cert.name}</p>
                    <p className="text-[11px] font-mono text-zinc-400">{cert.issuer}</p>
                  </div>
                  <Badge variant="success" className="text-[10px] font-mono">
                    {cert.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
