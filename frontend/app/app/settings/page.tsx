import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return <div className="space-y-6"><div className="border-b border-zinc-200 pb-5"><div className="flex items-center gap-2"><h1 className="text-2xl font-semibold tracking-tight text-zinc-950">Settings</h1><Badge variant="neutral" className="text-[11px] font-mono">BACKEND UNAVAILABLE</Badge></div><p className="mt-1 text-sm text-zinc-500">Workspace configuration is not exposed by the current ResumeX backend.</p></div><div className="rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-600"><p className="font-medium text-zinc-900">No persisted settings are available.</p><p className="mt-2 max-w-2xl">Matching, evidence, external-source, team, and workspace settings are intentionally not shown as editable values because this backend has no settings API or persisted settings model. Existing screening behavior is defined by the backend service configuration.</p></div></div>;
}
