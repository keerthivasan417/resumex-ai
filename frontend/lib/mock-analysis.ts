import { AnalysisReport, EvidenceStatus, SkillCategory, SkillItem } from "@/types/analysis";

export const mockSkills: SkillItem[] = [
  // --- Languages ---
  {
    id: "go",
    name: "Go (Golang)",
    category: "Languages",
    status: "Strong evidence",
    strength: "High",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Listed in Core Languages",
        citation: "Resume Header > Technical Proficiencies",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Distributed Stream Ingestion Engine",
        citation: "github.com/org/stream-pipe (Primary author)",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Senior Backend Engineer at Platform Dynamics (2022-Present)",
        citation: "Engineered high-throughput event consumers in Go handling 12M events/day",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "No vendor certification on record",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "84 commits across 4 repositories, primary AST ownership",
        citation: "Commit signature: 4f8b21a",
      },
    },
    explanation:
      "Go was confirmed across active production tenure at Platform Dynamics and validated in public repositories with 84 verifiable commits and AST handler ownership.",
    extractedClaim:
      "Architected distributed streaming services in Go using consumer-group concurrency patterns.",
    sampleCodeOrCommit: {
      repo: "github.com/org/stream-pipe",
      commitHash: "4f8b21a",
      description: "AST verified: pkg/consumer/partition_handler.go (Sarama Kafka integration)",
    },
  },
  {
    id: "sql",
    name: "SQL",
    category: "Languages",
    status: "Needs verification",
    strength: "Low",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Listed under Query Languages",
        citation: "Resume Skills: 'SQL, Relational Databases'",
      },
      project: {
        present: false,
        label: "Project",
        detail: "No dedicated schema design or query optimization projects documented",
      },
      experience: {
        present: false,
        label: "Experience",
        detail: "No explicit SQL query tuning or migration responsibilities detailed",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "No database certifications identified",
      },
      github: {
        present: false,
        label: "GitHub",
        detail: "No DDL/DML migration scripts or standalone SQL repositories located",
      },
    },
    explanation:
      "SQL was detected in the skills section, but no supporting project, experience, certification, or external evidence has currently been identified.",
    extractedClaim: "Listed under Technical Skills: 'SQL, Relational Database Modeling'",
  },
  {
    id: "python",
    name: "Python",
    category: "Languages",
    status: "Supported",
    strength: "Moderate",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Listed in Programming Languages",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Data ETL scripts and automation tooling",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Software Engineer at CloudScale (2020-2022)",
        citation: "Maintained Python backend ingestion workers and unit test suites",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None on file",
      },
      github: {
        present: false,
        label: "GitHub",
        detail: "Public code repos primarily focus on Go; minimal public Python commits",
      },
    },
    explanation:
      "Python usage is corroborated by past employment experience at CloudScale and utility scripts, though lacking recent public repository evidence.",
    extractedClaim: "Authored data synchronization workers and automation scripts in Python 3.9.",
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Languages",
    status: "Supported",
    strength: "Moderate",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Languages > Frontend & Scripting",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Telemetry dashboard web frontend",
        citation: "github.com/org/telemetry-web",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Platform Dynamics internal tools",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None on record",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "18 commits across React/TypeScript UI dashboard",
      },
    },
    explanation:
      "TypeScript competency is supported by production UI maintenance and verifiable commits to internal telemetry interfaces.",
    extractedClaim: "Built administrative metrics dashboard using TypeScript and React.",
  },
  {
    id: "rust",
    name: "Rust",
    category: "Languages",
    status: "Weak evidence",
    strength: "Low",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Listed under 'Familiar Languages'",
      },
      project: {
        present: false,
        label: "Project",
        detail: "No production projects mentioned in resume",
      },
      experience: {
        present: false,
        label: "Experience",
        detail: "No commercial role references Rust",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None on file",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "1 public repository (personal toy CLI utility, 3 commits)",
      },
    },
    explanation:
      "Rust is listed as a familiar language and corroborated by a small personal CLI repo, but lacks production tenure or commercial architectural application.",
    extractedClaim: "Exploratory development with Rust memory safety and CLI tools.",
  },

  // --- Frameworks ---
  {
    id: "fastapi",
    name: "FastAPI",
    category: "Frameworks",
    status: "Needs verification",
    strength: "Low",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Listed under Web Frameworks",
      },
      project: {
        present: false,
        label: "Project",
        detail: "No specific FastAPI project artifacts cited",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Mentioned API microservices, but framework was unspecified in work bullets",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: false,
        label: "GitHub",
        detail: "No public FastAPI endpoints found",
      },
    },
    explanation:
      "FastAPI is declared in skills, but work experience bullets only describe generic REST services without confirming FastAPI framework specifics.",
    extractedClaim: "Engineered REST APIs using Python and FastAPI.",
  },
  {
    id: "react",
    name: "React",
    category: "Frameworks",
    status: "Supported",
    strength: "Moderate",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Frontend Technologies",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Internal Operations Console",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "CloudScale internal monitoring UI",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "React SPA repository verified with component state hooks",
      },
    },
    explanation:
      "React expertise is backed by commercial operations dashboards and public repository component structures.",
    extractedClaim: "Developed internal dashboard tooling utilizing React and REST integrations.",
  },

  // --- Databases ---
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "Databases",
    status: "Strong evidence",
    strength: "High",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Databases > Relational Storage",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Multi-tenant billing and subscription store",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Platform Dynamics: lead database schema architect for PostgreSQL 14",
        citation: "Implemented partition tables, composite indexing, and pgvector testing",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "Repository schema files include migration scripts and index configurations",
      },
    },
    explanation:
      "PostgreSQL proficiency is strongly verified with explicit schema migrations, table partitioning, and high-concurrency production ownership.",
    extractedClaim:
      "Designed PostgreSQL database schemas with connection pooling via PgBouncer.",
  },
  {
    id: "redis",
    name: "Redis",
    category: "Databases",
    status: "Supported",
    strength: "Moderate",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Databases > In-Memory Cache",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Rate-limiting middleware implementation",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Integrated Redis cluster for token bucket rate limiting at Platform Dynamics",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "Go Redis client (go-redis/v9) client wrappers committed",
      },
    },
    explanation:
      "Redis integration is confirmed across production distributed rate limiting systems and verified client code.",
    extractedClaim: "Leveraged Redis distributed caching and rate-limiting counters.",
  },

  // --- Cloud & Infrastructure ---
  {
    id: "docker",
    name: "Docker",
    category: "Cloud/Infrastructure",
    status: "Strong evidence",
    strength: "High",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Infrastructure & DevOps",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Multi-stage Docker builds across 6 services",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Standardized containerization pipelines across engineering teams",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "Dockerfile and docker-compose.yml files present in verified repos",
      },
    },
    explanation:
      "Extensive containerization evidence found in production roles, CI/CD pipeline scripts, and multi-stage Dockerfiles.",
    extractedClaim: "Authored multi-stage Docker builds optimizing artifact size under 25MB.",
  },
  {
    id: "kubernetes",
    name: "Kubernetes (K8s)",
    category: "Cloud/Infrastructure",
    status: "Supported",
    strength: "Moderate",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Container Orchestration",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Deployment manifests and HPA configurations",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Managed cluster deployments, ingress controllers, and horizontal autoscaling",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "CKA pending",
      },
      github: {
        present: false,
        label: "GitHub",
        detail: "K8s manifests held in private cluster repo",
      },
    },
    explanation:
      "Kubernetes deployment and scaling responsibilities are corroborated in experience bullets, though cluster manifests are non-public.",
    extractedClaim: "Maintained Kubernetes service manifests, ingress routing, and HPA configurations.",
  },
  {
    id: "aws",
    name: "AWS",
    category: "Cloud/Infrastructure",
    status: "Needs verification",
    strength: "Low",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Cloud Providers > AWS (EC2, S3, RDS)",
      },
      project: {
        present: false,
        label: "Project",
        detail: "No standalone AWS cloud architecture case studies detailed",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Generic mention of 'AWS cloud deployment' without IAM or VPC architectural detail",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "No AWS Solutions Architect or Developer certs",
      },
      github: {
        present: false,
        label: "GitHub",
        detail: "No CloudFormation / CDK infrastructure code found",
      },
    },
    explanation:
      "AWS is claimed in the skills overview and mentioned in employment bullets, but lacks specific architecture artifacts or IaC manifests to confirm depth.",
    extractedClaim: "Deployed containerized services to AWS EC2 and managed S3 assets.",
  },
  {
    id: "terraform",
    name: "Terraform (IaC)",
    category: "Cloud/Infrastructure",
    status: "Not found",
    strength: "None",
    sources: {
      skillsSection: {
        present: false,
        label: "Skills Section",
        detail: "Not listed in resume",
      },
      project: {
        present: false,
        label: "Project",
        detail: "No infrastructure-as-code modules found",
      },
      experience: {
        present: false,
        label: "Experience",
        detail: "No commercial IaC responsibilities recorded",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "HashiCorp cert not detected",
      },
      github: {
        present: false,
        label: "GitHub",
        detail: "No .tf files identified in scanned repositories",
      },
    },
    explanation:
      "Terraform was not detected in the candidate resume, projects, or repository repositories.",
    extractedClaim: undefined,
  },

  // --- Data & ML ---
  {
    id: "kafka",
    name: "Apache Kafka",
    category: "Data/ML",
    status: "Strong evidence",
    strength: "High",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Messaging & Streaming Systems",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Stream Ingestion Engine (Sarama consumer group)",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Primary architect for Kafka cluster topics, partition rebalancing, and consumer offset commits",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "Full Go Kafka consumer implementation committed with unit tests and offset recovery logic",
      },
    },
    explanation:
      "Apache Kafka has top-tier evidence grounding: explicit production architecture ownership, partition tuning, and verified code implementations.",
    extractedClaim: "Configured Kafka consumer groups with custom partition rebalance listeners in Go.",
    sampleCodeOrCommit: {
      repo: "github.com/org/stream-pipe",
      commitHash: "9e120bc",
      description: "Consumer group offset checkpointing and Sarama rebalance handler",
    },
  },
  {
    id: "graphql",
    name: "GraphQL",
    category: "Frameworks",
    status: "Not found",
    strength: "None",
    sources: {
      skillsSection: {
        present: false,
        label: "Skills Section",
        detail: "Not listed in candidate resume",
      },
      project: {
        present: false,
        label: "Project",
        detail: "No GraphQL schema or resolver files found",
      },
      experience: {
        present: false,
        label: "Experience",
        detail: "All APIs documented are REST/gRPC based",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: false,
        label: "GitHub",
        detail: "No GraphQL queries or schemas found",
      },
    },
    explanation:
      "GraphQL was evaluated against engineering benchmarks but is absent from the resume document and public repositories.",
    extractedClaim: undefined,
  },

  // --- Tools ---
  {
    id: "git",
    name: "Git & Version Control",
    category: "Tools",
    status: "Strong evidence",
    strength: "High",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Tools > Git, GitHub Flow",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Multi-branch contributor across 5 public repositories",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Enforced branch protection, code reviews, and semantic versioning",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "Consistent commit history spanning 3 years with clean semantic commit messages",
      },
    },
    explanation:
      "Git proficiency is empirically verified through multi-year repository history, PR merges, and branch management.",
    extractedClaim: "Collaborative development utilizing Git pull request reviews and CI workflows.",
  },
  {
    id: "linux",
    name: "Linux Systems Administration",
    category: "Tools",
    status: "Supported",
    strength: "Moderate",
    sources: {
      skillsSection: {
        present: true,
        label: "Skills Section",
        detail: "Operating Systems > Linux (Ubuntu, Debian, Alpine)",
      },
      project: {
        present: true,
        label: "Project",
        detail: "Bash automation and systemd service units",
      },
      experience: {
        present: true,
        label: "Experience",
        detail: "Diagnosed production CPU/memory bottlenecks using Linux perf and htop",
      },
      certification: {
        present: false,
        label: "Certification",
        detail: "None",
      },
      github: {
        present: true,
        label: "GitHub",
        detail: "Shell automation scripts and system setup recipes in dotfiles repository",
      },
    },
    explanation:
      "Linux competency is supported by production diagnostics, shell scripting, and container deployment environments.",
    extractedClaim: "Performance profiling and process diagnosis in Linux container runtimes.",
  },
];

export function getMockAnalysisReport(): AnalysisReport {
  const totalDetected = mockSkills.filter((s) => s.status !== "Not found").length;
  const supportedCount = mockSkills.filter(
    (s) => s.status === "Strong evidence" || s.status === "Supported"
  ).length;
  const needsVerificationCount = mockSkills.filter(
    (s) => s.status === "Needs verification"
  ).length;
  const missingCount = mockSkills.filter((s) => s.status === "Not found").length;

  return {
    documentName: "alex_chen_senior_backend.pdf",
    analyzedAt: "Just now",
    status: "Analysis Complete",
    totalDetected,
    supportedCount,
    needsVerificationCount,
    missingCount,
    skills: mockSkills,
  };
}

export function getSkillById(id: string): SkillItem | undefined {
  return mockSkills.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export function getCategories(): SkillCategory[] {
  return [
    "Languages",
    "Frameworks",
    "Databases",
    "Cloud/Infrastructure",
    "Data/ML",
    "Tools",
  ];
}

export function getStatusBadgeVariant(
  status: EvidenceStatus
): "brand" | "neutral" | "outline" | "success" | "warning" {
  switch (status) {
    case "Strong evidence":
      return "success";
    case "Supported":
      return "brand";
    case "Needs verification":
      return "warning";
    case "Weak evidence":
      return "neutral";
    case "Not found":
      return "outline";
    default:
      return "neutral";
  }
}
