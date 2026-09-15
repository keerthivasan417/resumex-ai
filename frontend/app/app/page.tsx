import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export default function WorkspaceOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
            Intelligence Overview
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Evidence verification pipeline, claim grounding, and technical profile status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">
            <Icons.fileText className="mr-1.5 h-3.5 w-3.5" />
            Upload New Resume
          </Button>
        </div>
      </div>

      {/* Primary Action Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Module 1: Resume Intake */}
        <Card className="border-zinc-200 shadow-xs flex flex-col justify-between">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-700 border border-brand-200/70">
                <Icons.fileText className="h-4 w-4" />
              </div>
              <Badge variant="brand" className="text-[11px] font-mono">
                INTAKE
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Resume Ingestion
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 leading-relaxed mt-1.5">
              Parse technical resumes into structured skill trees, work histories, and verifiable claim blocks.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center">
              <p className="text-xs font-medium text-zinc-600">
                Drag and drop resume file
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">PDF, DOCX, or TXT up to 10MB</p>
            </div>
          </CardContent>
        </Card>

        {/* Module 2: Evidence Source Connection */}
        <Card className="border-zinc-200 shadow-xs flex flex-col justify-between">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200">
                <Icons.gitBranch className="h-4 w-4" />
              </div>
              <Badge variant="neutral" className="text-[11px] font-mono">
                CONNECTORS
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Evidence Sources
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 leading-relaxed mt-1.5">
              Connect external engineering profiles to verify code authorship and commit distribution.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-md border border-zinc-200 text-xs">
              <div className="flex items-center gap-2">
                <Icons.code className="h-4 w-4 text-zinc-500" />
                <span className="font-medium text-zinc-800">GitHub Profile</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Ready to link</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-md border border-zinc-200 text-xs">
              <div className="flex items-center gap-2">
                <Icons.cpu className="h-4 w-4 text-zinc-500" />
                <span className="font-medium text-zinc-800">GitLab / Self-Hosted</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">Ready to link</span>
            </div>
          </CardContent>
        </Card>

        {/* Module 3: Verification Pipeline */}
        <Card className="border-zinc-200 shadow-xs flex flex-col justify-between">
          <CardHeader className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Icons.checkCircle className="h-4 w-4" />
              </div>
              <Badge variant="success" className="text-[11px] font-mono">
                SYSTEM ONLINE
              </Badge>
            </div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Verification Engine
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500 leading-relaxed mt-1.5">
              Audits extracted technical claims against project repositories and source code artifacts.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-zinc-600">
                <span>Taxonomy Version</span>
                <span className="font-mono text-zinc-800 font-medium">v2.4.0</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600">
                <span>Grounding Mode</span>
                <span className="font-mono text-zinc-800 font-medium">Deterministic AST</span>
              </div>
              <div className="flex justify-between items-center text-zinc-600">
                <span>Attribution Confidence</span>
                <span className="font-mono text-emerald-700 font-medium">99.2% Strict</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Pipeline Stages */}
      <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-xs">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-zinc-900">
            Evidence Pipeline Workflow
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            How ResumeX processes candidates from raw document upload to verified technical intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-md bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-xs font-mono font-medium text-zinc-700">
                1
              </span>
              <span className="text-xs font-semibold text-zinc-900">
                Ingest & Parse
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Text extraction and semantic structure parsing from raw resume.
            </p>
          </div>

          <div className="p-4 rounded-md bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-xs font-mono font-medium text-zinc-700">
                2
              </span>
              <span className="text-xs font-semibold text-zinc-900">
                Claim Extraction
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Isolate discrete technical assertions, frameworks, and role responsibilities.
            </p>
          </div>

          <div className="p-4 rounded-md bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-xs font-mono font-medium text-brand-800">
                3
              </span>
              <span className="text-xs font-semibold text-zinc-900">
                Evidence Grounding
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Match assertions to code repositories, commit history, and technical artifacts.
            </p>
          </div>

          <div className="p-4 rounded-md bg-zinc-50 border border-zinc-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-xs font-mono font-medium text-zinc-700">
                4
              </span>
              <span className="text-xs font-semibold text-zinc-900">
                Talent Intelligence
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Output structured verification reports and evidence-grounded match scores.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
