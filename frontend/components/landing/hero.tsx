import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export function LandingHero() {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 border-b border-zinc-200/70 overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Release / Category Badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="brand" className="px-3 py-1 font-mono text-xs">
            EVIDENCE-AWARE SCREENING PLATFORM
          </Badge>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-950 max-w-4xl mx-auto leading-[1.12]">
          Turn resumes into{" "}
          <span className="text-brand-700 underline decoration-brand-300 decoration-2 underline-offset-4">
            verified talent intelligence
          </span>
          .
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Traditional ATS systems parse keywords. ResumeX validates technical
          claims against real-world commits, code repositories, and engineering
          artifacts.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/app" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Launch Workspace
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#capabilities" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-zinc-700 border-zinc-300 hover:bg-zinc-50"
            >
              Explore Capabilities
            </Button>
          </a>
        </div>

        {/* Live Architecture Inspection Mockup */}
        <div className="mt-14 max-w-4xl mx-auto rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden text-left">
          {/* Mockup Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50/80">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
              <span className="ml-2 text-xs font-mono text-zinc-500">
                verification_pipeline.eval
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              Evidence Verification Active
            </div>
          </div>

          {/* Mockup Body: Verification Comparison Row */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-sm">
            {/* Left: Resume Claim */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-400">
                  Extracted Resume Claim
                </span>
                <Badge variant="neutral" className="text-[11px]">
                  Unstructured Text
                </Badge>
              </div>

              <div className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3.5 space-y-2">
                <p className="text-zinc-800 text-sm font-medium">
                  &ldquo;Architected a distributed event ingestion pipeline in
                  Go with Kafka, reducing latency by 45% and processing 12M
                  events/day.&rdquo;
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-zinc-200/70 text-zinc-700">
                    Go / Golang
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-zinc-200/70 text-zinc-700">
                    Apache Kafka
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-zinc-200/70 text-zinc-700">
                    Distributed Systems
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Verified Evidence */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-brand-700">
                  Evidence Verification
                </span>
                <Badge variant="success" className="text-[11px]">
                  Verified Match
                </Badge>
              </div>

              <div className="rounded-md border border-brand-200/80 bg-brand-50/40 p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icons.gitBranch className="h-4 w-4 text-brand-700 shrink-0" />
                    <span className="font-mono text-xs font-semibold text-brand-900">
                      github.com/org/stream-pipe
                    </span>
                  </div>
                  <span className="text-xs font-mono text-brand-700 font-medium">
                    84 Commits
                  </span>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-mono">
                  AST audit confirms primary authorship of consumer group
                  partitioning, Sarama Kafka handlers, and benchmark tests.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-brand-200/60 text-xs">
                  <span className="text-zinc-500 font-mono">Skill confidence</span>
                  <span className="font-mono font-semibold text-brand-800">
                    High Confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
