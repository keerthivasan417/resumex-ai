import * as React from "react";
import { FinalAssessmentData } from "@/types/report";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface ReportFinalAssessmentProps {
  assessment: FinalAssessmentData;
}

export function ReportFinalAssessment({ assessment }: ReportFinalAssessmentProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs print-card print-break-inside-avoid">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-brand-800 text-xs font-mono font-bold">
              7
            </span>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Final Screening Assessment & Recommendation
            </CardTitle>
          </div>
          <Badge variant="brand" className="text-[10px] font-mono">
            EVALUATION PANEL
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Strengths */}
          <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-1.5 font-semibold text-zinc-900 font-mono text-[11px] uppercase tracking-wider">
              <Icons.checkCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Key Strengths & Differentiators</span>
            </div>
            <ul className="space-y-1.5 text-zinc-700 font-mono text-[11px] leading-relaxed">
              {assessment.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Concerns & Risks */}
          <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-1.5 font-semibold text-zinc-900 font-mono text-[11px] uppercase tracking-wider">
              <Icons.alertCircle className="h-3.5 w-3.5 text-amber-600" />
              <span>Technical Concerns & Gaps</span>
            </div>
            <ul className="space-y-1.5 text-zinc-700 font-mono text-[11px] leading-relaxed">
              {assessment.concerns.map((con, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-600 font-bold shrink-0">!</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Verification Questions for Loop */}
          <div className="rounded-md border border-zinc-200 bg-white p-4 space-y-2">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-1.5 font-semibold text-zinc-900 font-mono text-[11px] uppercase tracking-wider">
              <Icons.search className="h-3.5 w-3.5 text-brand-700" />
              <span>Recommended Technical Interview Probes</span>
            </div>
            <ol className="space-y-2 text-zinc-600 font-mono text-[11px] leading-relaxed list-decimal list-inside">
              {assessment.verificationRecommendations.map((rec, idx) => (
                <li key={idx} className="pl-1">
                  <span>{rec}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Development / Onboarding Recommendations */}
          <div className="rounded-md border border-zinc-200 bg-white p-4 space-y-2">
            <div className="flex items-center gap-1.5 border-b border-zinc-100 pb-1.5 font-semibold text-zinc-900 font-mono text-[11px] uppercase tracking-wider">
              <Icons.cpu className="h-3.5 w-3.5 text-brand-700" />
              <span>30/60 Day Onboarding Ramp-up</span>
            </div>
            <ul className="space-y-2 text-zinc-600 font-mono text-[11px] leading-relaxed">
              {assessment.developmentRecommendations.map((dev, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-brand-600 font-bold shrink-0">→</span>
                  <span>{dev}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hiring Decision Advice Panel */}
        <div className="rounded-md border border-brand-200 bg-brand-50/30 p-4 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-brand-950 uppercase tracking-wider text-[11px]">
              Hiring Committee Advisory:
            </span>
            <Badge variant="brand" className="text-[10px]">
              RECOMMENDED FOR LOOP
            </Badge>
          </div>
          <p className="text-zinc-800 leading-relaxed pt-0.5">
            {assessment.hiringDecisionAdvice}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
