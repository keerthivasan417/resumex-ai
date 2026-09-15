import { JobRequirement, MatchingReport, RequirementAlignmentStatus, TargetJob } from "@/types/matching";

export const mockRequirements: JobRequirement[] = [
  {
    id: "req-python",
    name: "Python",
    category: "Languages",
    priority: "Must have",
    jobDescriptionSnippet: "3+ years writing robust, production Python services and automated testing workflows.",
    status: "Matched",
    candidateSkillId: "python",
    candidateSkillName: "Python",
    evidence: {
      skillsSection: true,
      project: true,
      experience: true,
      certification: false,
      github: true,
    },
    relatedProjects: ["Data ETL Pipelines", "CloudScale Ingestion Workers"],
    explanation: "Python proficiency is confirmed through 2 years of commercial microservices development at CloudScale and verified automation scripts.",
    gapTier: "Strong match",
    gapReason: "Matches required tenure and demonstrated background in backend scripting.",
    futureRecommendation: "Proficiency fully meets requisition baseline.",
  },
  {
    id: "req-fastapi",
    name: "FastAPI",
    category: "Frameworks",
    priority: "Preferred",
    jobDescriptionSnippet: "Experience building high-performance REST APIs using modern async frameworks like FastAPI.",
    status: "Supported",
    candidateSkillId: "fastapi",
    candidateSkillName: "FastAPI",
    evidence: {
      skillsSection: true,
      project: false,
      experience: true,
      certification: false,
      github: false,
    },
    relatedProjects: ["Telemetry Admin Console"],
    explanation: "FastAPI is listed in skills and mentioned in API service bullets, though explicit async routing implementations are non-public.",
    gapTier: "Needs strengthening",
    gapReason: "Commercial use is supported by general API bullets, but lacked direct async middleware artifacts.",
    futureRecommendation: "Publish a public reference microservice demonstrating Pydantic v2 schemas and dependency injection.",
  },
  {
    id: "req-postgresql",
    name: "PostgreSQL",
    category: "Databases",
    priority: "Must have",
    jobDescriptionSnippet: "Advanced relational database modeling, indexing strategies, and query performance tuning in PostgreSQL.",
    status: "Matched",
    candidateSkillId: "postgresql",
    candidateSkillName: "PostgreSQL",
    evidence: {
      skillsSection: true,
      project: true,
      experience: true,
      certification: false,
      github: true,
    },
    relatedProjects: ["Multi-Tenant Billing Store", "pgvector Evaluation Pipeline"],
    explanation: "Extensive PostgreSQL background proven through lead database schema ownership, partitioned tables, and indexing tuning at Platform Dynamics.",
    gapTier: "Strong match",
    gapReason: "Exceeds required depth with proven schema migration and partition optimization.",
    futureRecommendation: "Proficiency exceeds required baseline.",
  },
  {
    id: "req-docker",
    name: "Docker",
    category: "Cloud/Infrastructure",
    priority: "Must have",
    jobDescriptionSnippet: "Proficiency in containerization, multi-stage builds, and container runtime isolation.",
    status: "Needs verification",
    candidateSkillId: "docker",
    candidateSkillName: "Docker",
    evidence: {
      skillsSection: true,
      project: true,
      experience: false,
      certification: false,
      github: true,
    },
    relatedProjects: ["stream-pipe container configurations"],
    explanation: "Docker is listed and appears in a project, but professional experience evidence was not identified.",
    gapTier: "Needs strengthening",
    gapReason: "Containerization manifests exist in personal repos, but no enterprise production deployment responsibility was cited in tenure.",
    futureRecommendation: "Corroborate Docker experience with enterprise CI/CD pipeline artifacts or base image vulnerability scanning.",
  },
  {
    id: "req-aws",
    name: "AWS",
    category: "Cloud/Infrastructure",
    priority: "Preferred",
    jobDescriptionSnippet: "Experience with cloud infrastructure services including EC2, S3, RDS, IAM, and VPC networking.",
    status: "Partial",
    candidateSkillId: "aws",
    candidateSkillName: "AWS",
    evidence: {
      skillsSection: true,
      project: false,
      experience: true,
      certification: false,
      github: false,
    },
    relatedProjects: ["CloudScale Deployment Scripts"],
    explanation: "Candidate has deployed workloads to AWS EC2 and S3, but lacks evidence of deeper IAM policy design, VPC routing, or CloudWatch automation.",
    gapTier: "Needs strengthening",
    gapReason: "Basic cloud asset management detected, but missing architectural infrastructure-as-code coverage.",
    futureRecommendation: "Consider completing AWS Certified Solutions Architect Associate or publishing Terraform AWS modules.",
  },
  {
    id: "req-kubernetes",
    name: "Kubernetes",
    category: "Cloud/Infrastructure",
    priority: "Preferred",
    jobDescriptionSnippet: "Deploying and operating microservices in Kubernetes clusters using Helm, ingress, and HPA.",
    status: "Missing",
    candidateSkillId: "kubernetes",
    candidateSkillName: "Kubernetes (K8s)",
    evidence: {
      skillsSection: false,
      project: false,
      experience: false,
      certification: false,
      github: false,
    },
    relatedProjects: [],
    explanation: "Kubernetes is explicitly required for platform orchestration, but was not detected in candidate artifacts or verified repositories.",
    gapTier: "Missing",
    gapReason: "No evidence found across document sections, commercial history, or code commits.",
    futureRecommendation: "Deploy a multi-service Helm chart onto a local Minikube/Kind cluster with ingress configuration to verify hands-on capability.",
  },
  {
    id: "req-go",
    name: "Go (Golang)",
    category: "Languages",
    priority: "Must have",
    jobDescriptionSnippet: "Strong proficiency in Go concurrency primitives (goroutines, channels, sync packages) for high-load systems.",
    status: "Matched",
    candidateSkillId: "go",
    candidateSkillName: "Go (Golang)",
    evidence: {
      skillsSection: true,
      project: true,
      experience: true,
      certification: false,
      github: true,
    },
    relatedProjects: ["Distributed Stream Ingestion Engine (stream-pipe)"],
    explanation: "Top-tier alignment: candidate has 2+ years production Go experience handling 12M events/day and verified public GitHub commits.",
    gapTier: "Strong match",
    gapReason: "Demonstrates deep concurrency understanding, AST verified codebase ownership, and high-throughput production tenure.",
    futureRecommendation: "Core technical differentiator for candidate.",
  },
  {
    id: "req-kafka",
    name: "Apache Kafka",
    category: "Data/ML",
    priority: "Must have",
    jobDescriptionSnippet: "Designing distributed streaming architectures, event schema contracts, and consumer group offset management.",
    status: "Matched",
    candidateSkillId: "kafka",
    candidateSkillName: "Apache Kafka",
    evidence: {
      skillsSection: true,
      project: true,
      experience: true,
      certification: false,
      github: true,
    },
    relatedProjects: ["stream-pipe Sarama Kafka integration"],
    explanation: "Demonstrated production architecture ownership over Kafka partition distribution, rebalance handlers, and schema serialization.",
    gapTier: "Strong match",
    gapReason: "Matches high-scale event streaming criteria with verifiable Sarama consumer group handlers.",
    futureRecommendation: "Direct operational match with platform core stack.",
  },
  {
    id: "req-sql",
    name: "SQL & Query Tuning",
    category: "Languages",
    priority: "Must have",
    jobDescriptionSnippet: "Complex DML/DDL authoring, EXPLAIN ANALYZE profiling, and index strategies.",
    status: "Needs verification",
    candidateSkillId: "sql",
    candidateSkillName: "SQL",
    evidence: {
      skillsSection: true,
      project: false,
      experience: false,
      certification: false,
      github: false,
    },
    relatedProjects: [],
    explanation: "SQL was detected in the skills section, but no supporting project, experience, certification, or external evidence has currently been identified.",
    gapTier: "Needs strengthening",
    gapReason: "Claimed in resume skills block without standalone query tuning artifacts or schema benchmark code.",
    futureRecommendation: "Provide SQL migration scripts or query optimization examples in a public repo.",
  },
  {
    id: "req-terraform",
    name: "Terraform (IaC)",
    category: "Cloud/Infrastructure",
    priority: "Nice to have",
    jobDescriptionSnippet: "Infrastructure as Code provisioning using HashiCorp Terraform modules.",
    status: "Missing",
    candidateSkillId: "terraform",
    candidateSkillName: "Terraform (IaC)",
    evidence: {
      skillsSection: false,
      project: false,
      experience: false,
      certification: false,
      github: false,
    },
    relatedProjects: [],
    explanation: "No Terraform configuration files (.tf) or cloud provisioning pipelines were detected in candidate background.",
    gapTier: "Missing",
    gapReason: "Nice-to-have skill missing from candidate background.",
    futureRecommendation: "Build a sample AWS VPC provisioning module using Terraform v1.5+.",
  },
];

export const mockJobsList: TargetJob[] = [
  {
    id: "job-distributed-backend",
    title: "Senior Backend & Distributed Systems Engineer",
    company: "Nerve Financial",
    department: "Platform Core",
    level: "Senior (L5)",
    location: "Remote / Hybrid (San Francisco)",
    summary: {
      overallCompatibility: "Strong Alignment • Core Systems Grounded",
      skillCoverage: "7 of 10 Requirements Met or Supported",
      experienceAlignment: "High • 4+ Years Distributed Systems",
      projectRelevance: "High • Stream Ingestion & Kafka Handlers",
      evidenceStrength: "High • AST Verified Codebases",
      totalRequirements: 10,
      matchedCount: 4,
      supportedCount: 2,
      partialCount: 1,
      needsVerificationCount: 2,
      missingCount: 1,
    },
    requirements: mockRequirements,
  },
  {
    id: "job-cloud-infra",
    title: "Platform Infrastructure & Site Reliability Engineer",
    company: "DataMesh Systems",
    department: "Cloud Engineering",
    level: "Staff Engineer (L6)",
    location: "New York / Remote",
    summary: {
      overallCompatibility: "Moderate Alignment • Gaps in Orchestration",
      skillCoverage: "5 of 10 Requirements Met or Supported",
      experienceAlignment: "Moderate • Strong Code, Weaker Orchestration",
      projectRelevance: "Moderate • Ingestion Architecture",
      evidenceStrength: "High • Code Verified",
      totalRequirements: 10,
      matchedCount: 3,
      supportedCount: 2,
      partialCount: 2,
      needsVerificationCount: 1,
      missingCount: 2,
    },
    requirements: mockRequirements.map((r) =>
      r.name === "Kubernetes" || r.name === "Terraform (IaC)"
        ? { ...r, priority: "Must have" as const }
        : r
    ),
  },
];

export function getMockMatchingReport(jobId?: string): MatchingReport {
  const job = jobId
    ? mockJobsList.find((j) => j.id === jobId) || null
    : mockJobsList[0];

  return {
    targetJob: job,
    candidateName: "Alex Chen",
    documentName: "alex_chen_senior_backend.pdf",
    analyzedAt: "Evaluated against 10 Role Requirements",
    availableJobs: mockJobsList.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      level: j.level,
    })),
  };
}

export function getAlignmentStatusBadgeVariant(
  status: RequirementAlignmentStatus
): "brand" | "neutral" | "outline" | "success" | "warning" {
  switch (status) {
    case "Matched":
      return "success";
    case "Supported":
      return "brand";
    case "Partial":
      return "warning";
    case "Needs verification":
      return "neutral";
    case "Missing":
      return "outline";
    default:
      return "neutral";
  }
}
