import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Job Requisitions & Benchmarks
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Define target engineering roles and required verified skill evidence criteria.
          </p>
        </div>
        <Button size="sm">Create Job Profile</Button>
      </div>

      <Card className="border-dashed border-zinc-300 bg-zinc-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 mb-3">
            <Icons.briefcase className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            No active job profiles
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mt-1">
            Create an engineering requisition to automatically evaluate candidate evidence against defined requirements.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
