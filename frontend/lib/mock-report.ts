import { CandidateEvaluationReport } from "@/types/report";
import { mockDeveloperProfile } from "@/lib/mock-profile";

export const mockCandidateEvaluationReport: CandidateEvaluationReport = {
  header: {
    reportId: "RX-2026-8842",
    reportDate: "September 15, 2026",
    evaluationStatus: "Verified Technical Screening Assessment",
    candidateName: "Alex Chen",
    targetRole: "Senior Backend & Distributed Systems Engineer",
    targetCompany: "Nerve Financial (Platform Core Infrastructure)",
    documentName: "alex_chen_senior_backend.pdf",
  },
  executiveSummary: {
    overallCompatibility: "Strong Alignment • Core Systems Grounded",
    compatibilityLevel: "Strong",
    strongestAreas: [
      "Go concurrency & high-throughput streaming architecture (12M events/day production load)",
      "PostgreSQL 14 relational modeling, table partitioning & PgBouncer pooling",
      "Apache Kafka consumer group offset management & rebalance handling",
      "Proven algorithmic rigor (LeetCode Knight 2,048, Top 3.8% worldwide)",
    ],
    areasNeedingVerification: [
      "Docker enterprise deployment tenure (manifests present in repos, unverified in corporate tenure)",
      "SQL query tuning scripts (claimed in skills section, lacking dedicated DDL/DML benchmark artifacts)",
      "AWS VPC and IAM policy architectural manifests (basic EC2/S3 confirmed, missing deeper cloud IaC)",
    ],
    majorSkillGaps: [
      "Kubernetes orchestration manifests and Helm chart operations",
      "Terraform Infrastructure as Code modules (.tf files)",
    ],
    verdictSummary:
      "Candidate demonstrates top-decile proficiency in Go backend systems and distributed event pipelines. Core requirements for platform engineering are empirically grounded with AST repository evidence. Recommended for technical interview loop with targeted architecture questions on container orchestration and cloud networking.",
  },
  resumeProfile: {
    technicalFocus:
      "Distributed Systems, Event Streaming Architecture, Database Engineering, Microservice Concurrency",
    education: [
      {
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        period: "2018 - 2022",
        honors: "Dean's Honor List • Coursework in Operating Systems, Distributed Systems, Database Architecture",
      },
    ],
    experience: [
      {
        role: "Senior Backend Engineer",
        company: "Platform Dynamics",
        period: "2022 - Present (2+ Years)",
        highlights:
          "Led development of streaming ingestion services in Go processing 12M events/day. Architected PostgreSQL 14 partitioned tables and reduced lock contention on concurrent consumers by 35%.",
      },
      {
        role: "Software Engineer",
        company: "CloudScale Systems",
        period: "2020 - 2022 (2 Years)",
        highlights:
          "Maintained Python data synchronization workers and automation ETL pipelines. Authored REST APIs and standardized unit testing across backend services.",
      },
    ],
    certifications: [
      {
        name: "AWS Certified Cloud Practitioner",
        status: "Active & Verified",
        issuer: "Amazon Web Services (AWS)",
      },
    ],
  },
  skillsEvidence: [
    {
      name: "Go (Golang)",
      category: "Languages",
      status: "Strong evidence",
      strength: "High",
      sources: {
        skillsSection: true,
        project: true,
        experience: true,
        certification: false,
        github: true,
      },
      keyProof: "84 commits in stream-pipe; AST confirms consumer group handler authorship.",
    },
    {
      name: "Apache Kafka",
      category: "Data/ML",
      status: "Strong evidence",
      strength: "High",
      sources: {
        skillsSection: true,
        project: true,
        experience: true,
        certification: false,
        github: true,
      },
      keyProof: "Sarama Kafka partition rebalance listener implementation committed with unit tests.",
    },
    {
      name: "PostgreSQL",
      category: "Databases",
      status: "Strong evidence",
      strength: "High",
      sources: {
        skillsSection: true,
        project: true,
        experience: true,
        certification: false,
        github: true,
      },
      keyProof: "Lead database architect for PostgreSQL 14; implemented partition tables and composite indexing.",
    },
    {
      name: "Docker",
      category: "Cloud/Infrastructure",
      status: "Strong evidence",
      strength: "High",
      sources: {
        skillsSection: true,
        project: true,
        experience: false,
        certification: false,
        github: true,
      },
      keyProof: "Multi-stage Docker builds across 6 repositories; image size optimized under 25MB.",
    },
    {
      name: "Python",
      category: "Languages",
      status: "Supported",
      strength: "Moderate",
      sources: {
        skillsSection: true,
        project: true,
        experience: true,
        certification: false,
        github: false,
      },
      keyProof: "2 years commercial maintenance of ingestion workers at CloudScale.",
    },
    {
      name: "Redis",
      category: "Databases",
      status: "Supported",
      strength: "Moderate",
      sources: {
        skillsSection: true,
        project: true,
        experience: true,
        certification: false,
        github: true,
      },
      keyProof: "Distributed token-bucket rate limiter implemented with atomic Lua scripts.",
    },
    {
      name: "TypeScript",
      category: "Languages",
      status: "Supported",
      strength: "Moderate",
      sources: {
        skillsSection: true,
        project: true,
        experience: true,
        certification: false,
        github: true,
      },
      keyProof: "Built operational metrics dashboard utilizing React and TypeScript state hooks.",
    },
    {
      name: "SQL",
      category: "Languages",
      status: "Needs verification",
      strength: "Low",
      sources: {
        skillsSection: true,
        project: false,
        experience: false,
        certification: false,
        github: false,
      },
      keyProof: "Detected in skills block, but no standalone query profiling or tuning code found.",
    },
    {
      name: "AWS",
      category: "Cloud/Infrastructure",
      status: "Needs verification",
      strength: "Low",
      sources: {
        skillsSection: true,
        project: false,
        experience: true,
        certification: true,
        github: false,
      },
      keyProof: "AWS Practitioner certified; deployment mentioned without VPC or IAM architectural depth.",
    },
    {
      name: "Kubernetes",
      category: "Cloud/Infrastructure",
      status: "Not found",
      strength: "None",
      sources: {
        skillsSection: false,
        project: false,
        experience: false,
        certification: false,
        github: false,
      },
      keyProof: "No Kubernetes service manifests or cluster operation evidence identified.",
    },
  ],
  jobAlignment: [
    {
      requirement: "Go Concurrency & High Load",
      priority: "Must have",
      candidateCapability: "Go (Golang) — 2+ Years High Load Production",
      status: "Matched",
      supportingEvidence: "AST verified: stream-pipe partition handlers (84 commits, 12M events/day)",
    },
    {
      requirement: "Event Streaming (Apache Kafka)",
      priority: "Must have",
      candidateCapability: "Apache Kafka — Partition & Offset Management",
      status: "Matched",
      supportingEvidence: "Sarama Kafka consumer group balancing with recovery checkpoints",
    },
    {
      requirement: "PostgreSQL Database Architecture",
      priority: "Must have",
      candidateCapability: "PostgreSQL — Schema Partitioning & PgBouncer",
      status: "Matched",
      supportingEvidence: "Lead schema designer at Platform Dynamics; composite index profiling",
    },
    {
      requirement: "Python Services & Testing",
      priority: "Must have",
      candidateCapability: "Python — Microservices & Automation Scripts",
      status: "Matched",
      supportingEvidence: "2-year tenure maintaining data workers at CloudScale Systems",
    },
    {
      requirement: "Async REST Frameworks (FastAPI)",
      priority: "Preferred",
      candidateCapability: "FastAPI — REST Microservices",
      status: "Supported",
      supportingEvidence: "Mentioned in service development; private internal repositories",
      gapCallout: "Lacks public async middleware reference repo",
    },
    {
      requirement: "Containerization & Runtime Isolation",
      priority: "Must have",
      candidateCapability: "Docker — Multi-Stage Builds",
      status: "Needs verification",
      supportingEvidence: "Repository Dockerfiles verified; corporate CI/CD tenure uncorroborated",
      gapCallout: "Needs confirmation of enterprise production rollouts",
    },
    {
      requirement: "Cloud Infrastructure (AWS)",
      priority: "Preferred",
      candidateCapability: "AWS — EC2, S3 Management",
      status: "Partial",
      supportingEvidence: "Cloud Practitioner certified; deployment experience noted",
      gapCallout: "Missing VPC routing, IAM policy, and CloudWatch automation depth",
    },
    {
      requirement: "Kubernetes Orchestration & Helm",
      priority: "Preferred",
      candidateCapability: "Not detected in profile",
      status: "Missing",
      supportingEvidence: "No manifests or Helm charts located",
      gapCallout: "Requisition gap — requires team onboarding",
    },
    {
      requirement: "Terraform Infrastructure as Code",
      priority: "Nice to have",
      candidateCapability: "Not detected in profile",
      status: "Missing",
      supportingEvidence: "No .tf modules found in scanned repositories",
      gapCallout: "Nice-to-have delta",
    },
  ],
  skillGaps: [
    {
      skill: "Go (Golang)",
      tier: "Strong match",
      status: "Matched (High Confidence)",
      reason: "Exceeds required depth with 12M events/day load and AST verified codebase ownership.",
      recommendation: "Core technical differentiator for candidate.",
    },
    {
      skill: "Apache Kafka",
      tier: "Strong match",
      status: "Matched (High Confidence)",
      reason: "Demonstrated production architecture ownership over partition distribution and rebalance listeners.",
      recommendation: "Direct operational fit for platform streaming infrastructure.",
    },
    {
      skill: "PostgreSQL",
      tier: "Strong match",
      status: "Matched (High Confidence)",
      reason: "Lead database architect background with composite indexing and partition pruning.",
      recommendation: "Strong database design capability.",
    },
    {
      skill: "Docker",
      tier: "Needs strengthening",
      status: "Needs verification",
      reason: "Containerization manifests exist in personal repos, but corporate production ownership was not detailed in tenure.",
      recommendation: "Inquire about production container failure recovery and vulnerability scanning.",
    },
    {
      skill: "AWS Cloud Infrastructure",
      tier: "Needs strengthening",
      status: "Partial",
      reason: "Basic cloud asset management detected, but missing architectural infrastructure-as-code coverage.",
      recommendation: "Evaluate candidate understanding of VPC subnets, security groups, and IAM least privilege.",
    },
    {
      skill: "SQL Query Tuning",
      tier: "Needs strengthening",
      status: "Needs verification",
      reason: "Claimed in skills block without standalone query tuning artifacts or schema benchmark code.",
      recommendation: "Conduct live query profiling and EXPLAIN ANALYZE interview exercise.",
    },
    {
      skill: "Kubernetes (K8s)",
      tier: "Missing",
      status: "Missing",
      reason: "No cluster orchestration, manifest authoring, or Helm deployment artifacts identified.",
      recommendation: "Plan 30-day internal ramp-up on team Kubernetes cluster workflows.",
    },
    {
      skill: "Terraform (IaC)",
      tier: "Missing",
      status: "Missing",
      reason: "No infrastructure-as-code modules found across candidate background.",
      recommendation: "Nice-to-have gap; candidate can pair with SRE team for IaC tasks.",
    },
  ],
  developerIntelligence: {
    languageDistribution: mockDeveloperProfile.languageDistribution,
    keyProjects: mockDeveloperProfile.projects,
    codingProfiles: mockDeveloperProfile.codingProfiles,
    commitSummary:
      "84 commits scanned across 6 repositories. Primary language concentration in Go (54%) and Python (24%). Weekly commit cadence shows sustained contribution consistency over a 24-month horizon.",
  },
  evidenceNote:
    "Needs verification does not mean false. It means ResumeX did not identify sufficient supporting evidence from the currently available sources.",
  finalAssessment: {
    strengths: [
      "Exceptional systems engineering depth in Go concurrency primitives, goroutine synchronization, and channel patterns.",
      "Empirically validated streaming architecture with Sarama Kafka consumer groups and partition offset checkpoints.",
      "High relational database proficiency with production PostgreSQL schema partitioning and PgBouncer connection tuning.",
      "Demonstrated algorithmic strength via LeetCode Knight ranking (2,048 rating, Top 3.8% globally) and Codeforces Expert status.",
    ],
    concerns: [
      "Absence of Kubernetes cluster management or Helm chart deployment artifacts in public or verified records.",
      "Limited infrastructure-as-code (Terraform/CloudFormation) evidence; cloud deployments have been manual or script-driven.",
      "Enterprise production Docker containerization tenure is unverified against commercial employment citations.",
    ],
    verificationRecommendations: [
      "Conduct a live systems design session focused on distributed stream partitioning, consumer failure rebalancing, and dead-letter queue design.",
      "Ask candidate to explain how they tuned PostgreSQL connection pools under burst load at Platform Dynamics.",
      "Walk through a containerized production deployment scenario to evaluate practical Docker and Linux troubleshooting capabilities.",
    ],
    developmentRecommendations: [
      "Complete hands-on Kubernetes deployment exercises with Minikube/Kind, focusing on Ingress routing and Horizontal Pod Autoscaling.",
      "Author a reference Terraform module provisioning an AWS VPC with private subnets and an RDS PostgreSQL instance.",
    ],
    hiringDecisionAdvice:
      "Recommend advancing to technical architecture round. Candidate strongly fulfills core backend and streaming competencies. Missing cloud orchestration skills are standard onboarding items given candidate's strong systems baseline.",
  },
};

export function getMockCandidateEvaluationReport(): CandidateEvaluationReport {
  return mockCandidateEvaluationReport;
}
