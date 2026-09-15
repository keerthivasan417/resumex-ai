import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface ProfileInsightsCardProps {
  insights: string[];
}

export function ProfileInsightsCard({ insights }: ProfileInsightsCardProps) {
  return (
    <Card className="border-brand-200/80 bg-brand-50/20 shadow-xs">
      <CardHeader className="p-5 pb-3 border-b border-brand-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-950">
            <Icons.shieldCheck className="h-4 w-4 text-brand-700 shrink-0" />
            <CardTitle className="text-sm font-semibold">
              Deterministic Profile Synthesis & Evaluation Insights
            </CardTitle>
          </div>
          <Badge variant="brand" className="text-[10px] font-mono">
            EVIDENCE-AWARE
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-2.5">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0 mt-1.5" />
            <p className="font-mono leading-relaxed">{insight}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
