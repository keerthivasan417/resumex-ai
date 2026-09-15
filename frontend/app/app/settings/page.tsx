import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Workspace Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Configure taxonomy versions, evidence verification thresholds, and API keys.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="p-6">
            <CardTitle className="text-base font-semibold">Verification Strictness</CardTitle>
            <CardDescription className="text-xs">
              Determine how strictly claims must match code commits and pull requests.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="text-xs font-mono text-zinc-600 bg-zinc-50 p-3 rounded-md border border-zinc-200">
              Default Mode: Strict AST & Line-level Attribution (Enabled)
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
