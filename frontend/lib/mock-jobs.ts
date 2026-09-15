import { JobRequisition, JobStatus, RequirementPriority } from "@/types/job";

export const mockRequisitions: JobRequisition[] = [
  {
    id: "job-distributed-backend",
    title: "Senior Backend & Distributed Systems Engineer",
    department: "Platform Core",
    level: "Senior",
    location: "San Francisco, CA",
    workArrangement: "Hybrid",
    employmentType: "Full-time",
    status: "Active",
    minExperienceYears: 4,
    description:
      "Architect and scale high-throughput event ingestion pipelines, distributed state coordination, and low-latency microservices powering our transaction ledger.",
    responsibilities: [
      "Lead the architectural design and scaling of event-driven streaming pipelines handling 10M+ daily events.",
      "Design database partitioning, indexing strategies, and connection pooling across PostgreSQL clusters.",
      "Implement consumer group offset management, rebalance listeners, and dead-letter queues using Apache Kafka.",
      "Mentor backend engineers and establish rigorous distributed systems testing benchmarks.",
    ],
    requirements: [
      {
        id: "req-1",
        name: "Go (Golang)",
        priority: "Must have",
        description: "2+ years writing concurrent Go services using goroutines and channels.",
      },
      {
        id: "req-2",
        name: "Apache Kafka",
        priority: "Must have",
        description: "Designing partition strategies, schema contracts, and consumer recovery.",
      },
      {
        id: "req-3",
        name: "PostgreSQL",
        priority: "Must have",
        description: "Advanced relational modeling, table partitioning, and query optimization.",
      },
      {
        id: "req-4",
        name: "Python",
        priority: "Must have",
        description: "Automation ETL workflows, scripting, and backend API testing.",
      },
      {
        id: "req-5",
        name: "Docker",
        priority: "Preferred",
        description: "Multi-stage container builds and runtime isolation.",
      },
      {
        id: "req-6",
        name: "FastAPI",
        priority: "Preferred",
        description: "High-performance async REST microservices with Pydantic validation.",
      },
      {
        id: "req-7",
        name: "AWS",
        priority: "Preferred",
        description: "Cloud deployment across EC2, S3, RDS, and VPC networking.",
      },
      {
        id: "req-8",
        name: "Kubernetes",
        priority: "Nice to have",
        description: "Helm chart deployment and horizontal pod autoscaling.",
      },
      {
        id: "req-9",
        name: "Terraform",
        priority: "Nice to have",
        description: "Infrastructure as code provisioning for cloud resources.",
      },
    ],
    candidateCount: 14,
    shortlistCount: 3,
    createdAt: "Sep 01, 2026",
    updatedAt: "Sep 14, 2026",
  },
  {
    id: "job-cloud-infra",
    title: "Platform Infrastructure & Site Reliability Engineer",
    department: "Cloud Engineering",
    level: "Staff",
    location: "New York, NY",
    workArrangement: "Remote",
    employmentType: "Full-time",
    status: "Active",
    minExperienceYears: 6,
    description:
      "Own production Kubernetes clusters, multi-region cloud infrastructure, observability telemetry, and reliability engineering across all service tiers.",
    responsibilities: [
      "Manage multi-tenant Kubernetes clusters, ingress controllers, and service meshes across cloud regions.",
      "Author modular Terraform infrastructure-as-code libraries adhering to zero-trust network principles.",
      "Establish SLOs, error budgets, and Prometheus/Grafana alerting rules.",
      "Participate in on-call rotation and drive blameless post-mortem operational reviews.",
    ],
    requirements: [
      {
        id: "req-infra-1",
        name: "Kubernetes",
        priority: "Must have",
        description: "Deep production cluster administration and troubleshooting experience.",
      },
      {
        id: "req-infra-2",
        name: "Terraform",
        priority: "Must have",
        description: "Authoring reusable IaC modules and state management.",
      },
      {
        id: "req-infra-3",
        name: "Linux / POSIX",
        priority: "Must have",
        description: "Kernel tuning, process diagnostics, and networking stack analysis.",
      },
      {
        id: "req-infra-4",
        name: "Go (Golang)",
        priority: "Preferred",
        description: "Building custom Kubernetes operators and CLI automation tooling.",
      },
      {
        id: "req-infra-5",
        name: "AWS",
        priority: "Preferred",
        description: "EKS, IAM roles for service accounts, and Transit Gateway routing.",
      },
      {
        id: "req-infra-6",
        name: "Prometheus / Metrics",
        priority: "Preferred",
        description: "PromQL instrumentation and high-cardinality metric stores.",
      },
    ],
    candidateCount: 8,
    shortlistCount: 2,
    createdAt: "Aug 24, 2026",
    updatedAt: "Sep 12, 2026",
  },
  {
    id: "job-data-platform",
    title: "Data Platform & Streaming Architect",
    department: "Data Infrastructure",
    level: "Lead",
    location: "Seattle, WA",
    workArrangement: "Remote",
    employmentType: "Full-time",
    status: "Draft",
    minExperienceYears: 7,
    description:
      "Design next-generation real-time analytical data pipelines, lakehouse storage layers, and unified governance catalogs.",
    responsibilities: [
      "Architect unified event streaming and batch data pipelines utilizing Apache Kafka and Spark.",
      "Establish data contracts, schema evolution rules, and lineage tracking.",
      "Partner with analytics engineers to guarantee sub-second dashboard query latencies.",
    ],
    requirements: [
      {
        id: "req-data-1",
        name: "Apache Kafka",
        priority: "Must have",
        description: "High-throughput cluster sizing and partition topology.",
      },
      {
        id: "req-data-2",
        name: "Apache Spark",
        priority: "Must have",
        description: "Structured streaming and memory execution optimization.",
      },
      {
        id: "req-data-3",
        name: "Python",
        priority: "Must have",
        description: "Data modeling and distributed pipeline orchestration.",
      },
      {
        id: "req-data-4",
        name: "Redis",
        priority: "Preferred",
        description: "Low-latency key-value caching and aggregation.",
      },
    ],
    candidateCount: 0,
    shortlistCount: 0,
    createdAt: "Sep 10, 2026",
    updatedAt: "Sep 10, 2026",
  },
  {
    id: "job-frontend-lead",
    title: "Senior Frontend Systems Engineer",
    department: "Product Engineering",
    level: "Senior",
    location: "San Francisco, CA",
    workArrangement: "Hybrid",
    employmentType: "Full-time",
    status: "Paused",
    minExperienceYears: 5,
    description:
      "Lead architecture and state management for client-side analytical dashboards, design systems, and real-time visualization interfaces.",
    responsibilities: [
      "Architect scalable Next.js and React applications with sub-second initial paint times.",
      "Design shared token systems and accessible component libraries.",
      "Optimize complex data tables and live WebSocket telemetry feeds.",
    ],
    requirements: [
      {
        id: "req-fe-1",
        name: "TypeScript",
        priority: "Must have",
        description: "Advanced generic typing and strict compile configurations.",
      },
      {
        id: "req-fe-2",
        name: "React",
        priority: "Must have",
        description: "Modern state architecture, custom hooks, and rendering profiling.",
      },
      {
        id: "req-fe-3",
        name: "Tailwind CSS",
        priority: "Preferred",
        description: "Design token implementation and responsive layout authoring.",
      },
    ],
    candidateCount: 19,
    shortlistCount: 4,
    createdAt: "Aug 15, 2026",
    updatedAt: "Sep 05, 2026",
  },
  {
    id: "job-security-eng",
    title: "Application Security & Cryptography Engineer",
    department: "Security & Trust",
    level: "Senior",
    location: "Austin, TX",
    workArrangement: "Remote",
    employmentType: "Full-time",
    status: "Closed",
    minExperienceYears: 5,
    description:
      "Perform secure code reviews, design zero-knowledge transaction authentication protocols, and defend cloud services against adversarial exploitation.",
    responsibilities: [
      "Audit Go and Rust codebases for memory safety and concurrency race conditions.",
      "Design API key rotation, mTLS handshakes, and cryptographic signing ceremonies.",
    ],
    requirements: [
      {
        id: "req-sec-1",
        name: "Go (Golang)",
        priority: "Must have",
        description: "Secure systems programming and vulnerability patching.",
      },
      {
        id: "req-sec-2",
        name: "Rust",
        priority: "Must have",
        description: "Low-level memory safety and cryptographic verification.",
      },
      {
        id: "req-sec-3",
        name: "Linux / POSIX",
        priority: "Must have",
        description: "Auditd, eBPF telemetry, and privilege isolation.",
      },
    ],
    candidateCount: 22,
    shortlistCount: 1,
    createdAt: "Jul 20, 2026",
    updatedAt: "Aug 30, 2026",
  },
];

export function getMockRequisitions(): JobRequisition[] {
  return mockRequisitions;
}

export function getJobStatusBadgeVariant(
  status: JobStatus
): "brand" | "neutral" | "outline" | "success" | "warning" {
  switch (status) {
    case "Active":
      return "success";
    case "Draft":
      return "neutral";
    case "Paused":
      return "warning";
    case "Closed":
      return "outline";
    default:
      return "neutral";
  }
}

export function getPriorityBadgeVariant(
  priority: RequirementPriority
): "brand" | "neutral" | "outline" | "success" | "warning" {
  switch (priority) {
    case "Must have":
      return "brand";
    case "Preferred":
      return "neutral";
    case "Nice to have":
      return "outline";
    default:
      return "neutral";
  }
}
