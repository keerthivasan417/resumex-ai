import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Candidate Directory
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            All submitted candidate pools, verification scores, and evidence summaries.
          </p>
        </div>
        <Button size="sm">Import Candidates</Button>
      </div>

      <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 mb-3">
            <Icons.users className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            No candidates imported yet
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Batch import candidates or sync with your ATS to run evidence-first evaluation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
