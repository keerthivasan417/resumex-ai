import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

export function LandingFeatures() {
  const capabilities = [
    {
      title: "Context-Aware Resume Understanding",
      category: "Parsing & Ingestion",
      description:
        "Extract structured technical narratives, timelines, and accomplishments from resumes without losing the architectural context of projects.",
      icon: "fileText",
      points: [
        "Chronological role disambiguation",
        "Architecture & stack inference",
        "Impact metric contextualization",
      ],
    },
    {
      title: "Granular Skill Extraction",
      category: "Taxonomy Engine",
      description:
        "Dissect broad tech stacks into concrete proficiencies, frameworks, database engines, deployment tools, and systems programming practices.",
      icon: "cpu",
      points: [
        "Language & runtime specialization",
        "Library & framework profiling",
        "Infrastructure & protocol analysis",
      ],
    },
    {
      title: "Skill Evidence Verification",
      category: "Core Verification",
      description:
        "Ground claimed proficiencies with empirical proof from public repositories, PR reviews, commit histories, and project implementations.",
      icon: "checkCircle",
      points: [
        "Codebase authorship attribution",
        "Language distribution analysis",
        "Architectural complexity checks",
      ],
    },
    {
      title: "Precision Job Matching",
      category: "Relevance Scoring",
      description:
        "Score candidate compatibility against engineering job requirements based on verified depth rather than keyword frequency.",
      icon: "briefcase",
      points: [
        "Role capability alignment",
        "Seniority calibration",
        "Domain-specific relevance mapping",
      ],
    },
    {
      title: "Actionable Skill Gap Analysis",
      category: "Candidate Growth",
      description:
        "Map the specific competencies and missing architectural artifacts needed to meet target engineering benchmarks.",
      icon: "barChart",
      points: [
        "Target role deficiency mapping",
        "Project recommendation paths",
        "Measurable growth targets",
      ],
    },
    {
      title: "Developer Intelligence",
      category: "Profile Insights",
      description:
        "Consolidated engineering profiles that showcase authentic coding patterns, commit velocity, and repository architecture.",
      icon: "code",
      points: [
        "Multi-source repository ingestion",
        "Engineering consistency metrics",
        "Standardized technical reports",
      ],
    },
  ];

  return (
    <section id="capabilities" className="py-20 bg-zinc-50/50 border-b border-zinc-200/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <Badge variant="brand" className="mb-3 font-mono text-xs">
            SYSTEM ARCHITECTURE
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Evidence-aware intelligence across the entire technical evaluation
            lifecycle.
          </h2>
          <p className="mt-4 text-base text-zinc-600 leading-relaxed">
            ResumeX replaces probabilistic keyword guesswork with deterministic
            verification, bridging the trust gap between engineering candidates
            and hiring teams.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <Card
              key={cap.title}
              className="flex flex-col justify-between border-zinc-200/90 hover:border-zinc-300 transition-colors bg-white shadow-xs"
            >
              <CardHeader className="p-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-700 border border-brand-200/70">
                    {cap.icon === "fileText" && <Icons.fileText className="h-4 w-4" />}
                    {cap.icon === "cpu" && <Icons.cpu className="h-4 w-4" />}
                    {cap.icon === "checkCircle" && <Icons.checkCircle className="h-4 w-4" />}
                    {cap.icon === "briefcase" && <Icons.briefcase className="h-4 w-4" />}
                    {cap.icon === "barChart" && <Icons.barChart className="h-4 w-4" />}
                    {cap.icon === "code" && <Icons.code className="h-4 w-4" />}
                  </div>
                  <Badge variant="neutral" className="text-[11px] font-mono">
                    {cap.category}
                  </Badge>
                </div>
                <CardTitle className="text-base font-semibold text-zinc-900 leading-snug">
                  {cap.title}
                </CardTitle>
                <CardDescription className="mt-2 text-sm text-zinc-600 leading-relaxed">
                  {cap.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 border-t border-zinc-100 mt-2">
                <ul className="space-y-1.5 pt-4 text-xs text-zinc-500 font-mono">
                  {cap.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
