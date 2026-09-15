import { ShortlistEntry } from "@/types/shortlist";
import { mockCandidates } from "@/lib/mock-candidates";
import { mockRequisitions } from "@/lib/mock-jobs";

const getJob = (id: string) =>
  mockRequisitions.find((j) => j.id === id) || mockRequisitions[0];
const getCandidate = (id: string) =>
  mockCandidates.find((c) => c.id === id) || mockCandidates[0];

export const mockShortlists: ShortlistEntry[] = [
  {
    id: "sl-alex-chen",
    candidateId: "cand-alex-chen",
    targetJobId: "job-distributed-backend",
    candidate: getCandidate("cand-alex-chen"),
    targetJob: getJob("job-distributed-backend"),
    matchScore: 88,
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Technical Review",
    strengths: [
      "Verified concurrency and microservices in Go (2.5+ years).",
      "Production Apache Kafka streaming topic design with 10M daily events.",
      "Thorough relational database partitioning and performance tuning in PostgreSQL.",
    ],
    concerns: [
      "Limited production container orchestration with Kubernetes.",
      "Self-reported AWS architecture requires panel verification.",
    ],
    verificationTopics: [
      "Probe consumer group rebalance and partition failover in Kafka.",
      "Ask candidate to walk through VPC security and RDS connection pooling.",
    ],
    recruiterNotes:
      "Strong core backend profile with proven transaction ingestion experience. Recommend probing AWS operational depth during the distributed systems interview.",
    shortlistedAt: "Sep 13, 2026",
  },
  {
    id: "sl-marcus-vance",
    candidateId: "cand-marcus-vance",
    targetJobId: "job-distributed-backend",
    candidate: getCandidate("cand-marcus-vance"),
    targetJob: getJob("job-distributed-backend"),
    matchScore: 94,
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Interview",
    strengths: [
      "Author of production Go concurrency library with high community adoption.",
      "Custom Kubernetes operator development in Go for multi-tenant Kafka instances.",
      "Proven zero-downtime cluster upgrades across distributed PostgreSQL Citus clusters.",
    ],
    concerns: [
      "Compensation expectation may sit at upper staff band; verify budget alignment.",
    ],
    verificationTopics: [
      "Assess autonomous team leadership style and cross-functional mentoring approach.",
    ],
    recruiterNotes:
      "Exceptional distributed systems pedigree. Satisfies every Must-Have and Preferred criterion with strong verified evidence. Top priority for on-site loop.",
    shortlistedAt: "Sep 12, 2026",
  },
  {
    id: "sl-devonte-washington",
    candidateId: "cand-devonte-washington",
    targetJobId: "job-distributed-backend",
    candidate: getCandidate("cand-devonte-washington"),
    targetJob: getJob("job-distributed-backend"),
    matchScore: 82,
    skillCoverage: "Good",
    evidenceStrength: "Strong",
    projectRelevance: "Moderate",
    evaluationStatus: "Good",
    pipelineStage: "Screening",
    strengths: [
      "Enterprise Kubernetes & AWS infrastructure mastery (18 production EKS clusters).",
      "Terraform cloud reliability automation with 99.995% uptime track record.",
      "Practical Go tooling development for platform health controllers.",
    ],
    concerns: [
      "Background leans heavier into Platform/SRE rather than domain application backend logic.",
    ],
    verificationTopics: [
      "Clarify willingness to design business domain services vs infrastructure automation.",
    ],
    recruiterNotes:
      "Solid engineering foundation with stellar SRE experience. Discuss role expectations to confirm appetite for core backend development.",
    shortlistedAt: "Sep 14, 2026",
  },
  {
    id: "sl-sarah-jenkins",
    candidateId: "cand-sarah-jenkins",
    targetJobId: "job-cloud-infra",
    candidate: getCandidate("cand-sarah-jenkins"),
    targetJob: getJob("job-cloud-infra"),
    matchScore: 96,
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Interview",
    strengths: [
      "Multi-account AWS Organization automation across 40+ VPCs via Terraform.",
      "Kubernetes production cluster reliability and automated canary rollouts.",
      "Deep observability implementation using Prometheus and Datadog.",
    ],
    concerns: [],
    verificationTopics: [
      "Discuss on-call incident commander experience and escalation policies.",
    ],
    recruiterNotes:
      "Standout cloud infrastructure architect candidate. Outstanding verified track record across all target requirements.",
    shortlistedAt: "Sep 12, 2026",
  },
  {
    id: "sl-jordan-blake",
    candidateId: "cand-jordan-blake",
    targetJobId: "job-frontend-lead",
    candidate: getCandidate("cand-jordan-blake"),
    targetJob: getJob("job-frontend-lead"),
    matchScore: 91,
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Technical Review",
    strengths: [
      "Next.js, React 19, TypeScript monorepo architecture adopted by 80+ engineers.",
      "Design systems governance and strict web performance budget enforcement.",
    ],
    concerns: [
      "Limited exposure to backend microservices outside GraphQL BFF layers.",
    ],
    verificationTopics: [
      "Probe state management philosophy and server component streaming boundaries.",
    ],
    recruiterNotes:
      "High caliber frontend systems engineer with strong technical vision for design systems and performance.",
    shortlistedAt: "Sep 13, 2026",
  },
];
