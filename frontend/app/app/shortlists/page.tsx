import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function ShortlistsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Candidate Shortlists
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Curated candidate groups ready for technical screening or interview loops.
          </p>
        </div>
      </div>

      <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 mb-3">
            <Icons.bookmark className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            No shortlists created
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Pin and organize verified high-matching candidates into shared team shortlists.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
