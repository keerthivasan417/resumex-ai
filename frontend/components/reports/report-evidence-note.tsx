import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

interface ReportEvidenceNoteProps {
  note: string;
}

export function ReportEvidenceNote({ note }: ReportEvidenceNoteProps) {
  return (
    <Card className="border-amber-200 bg-amber-50/50 print-card print-break-inside-avoid">
      <CardContent className="p-4 flex items-start gap-3 text-xs">
        <Icons.alertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-amber-950 font-mono text-[11px] uppercase tracking-wider block">
            Verification Methodology Note
          </span>
          <p className="text-amber-900 font-mono leading-relaxed">
            &ldquo;{note}&rdquo;
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
