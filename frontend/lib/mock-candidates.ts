import {
  Candidate,
  PipelineStage,
  EvaluationStatus,
  EvidenceStrength,
  VerificationFlag,
} from "@/types/candidate";

export const mockCandidates: Candidate[] = [
  {
    id: "cand-alex-chen",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    phone: "+1 (555) 382-9104",
    currentRole: "Senior Backend Engineer",
    location: "San Francisco, CA",
    experienceYears: 5,
    experience: "5 years",
    targetJobId: "job-distributed-backend",
    matchSummary: {
      score: 88,
      scoreLabel: "88% Alignment",
      strengthsCount: 6,
      flagsCount: 2,
      summaryNote:
        "Strong verified evidence in Go, PostgreSQL, and Kafka event streaming. AWS operational knowledge requires interview validation.",
    },
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Technical Review",
    isShortlisted: true,
    keySkills: [
      {
        name: "Go (Golang)",
        status: "Matched",
        category: "Languages",
        evidenceSnippet:
          "2.5+ years building concurrency-safe Go microservices with goroutines.",
      },
      {
        name: "Apache Kafka",
        status: "Matched",
        category: "Streaming",
        evidenceSnippet:
          "Designed 8-partition streaming topics handling 10M daily events.",
      },
      {
        name: "PostgreSQL",
        status: "Matched",
        category: "Databases",
        evidenceSnippet:
          "Partitioned ledger schemas, composite B-tree indices, and connection pooling.",
      },
      {
        name: "Python",
        status: "Matched",
        category: "Languages",
        evidenceSnippet:
          "Automated ETL ingestion workflows, unit testing, and async scripts.",
      },
      {
        name: "FastAPI",
        status: "Supported",
        category: "Frameworks",
        evidenceSnippet:
          "Async REST service design with Pydantic contract validation.",
      },
      {
        name: "Docker",
        status: "Supported",
        category: "DevOps",
        evidenceSnippet:
          "Multi-stage Dockerfiles reducing production container images to 28MB.",
      },
      {
        name: "AWS",
        status: "Needs verification",
        category: "Cloud",
        evidenceSnippet:
          "Mentioned on resume, but lack of concrete cloud architecture artifacts.",
      },
      {
        name: "Kubernetes",
        status: "Missing",
        category: "Orchestration",
        evidenceSnippet: "No container orchestration experience demonstrated.",
      },
    ],
    verificationFlags: [
      {
        id: "flag-1",
        skill: "Go (Golang)",
        status: "strong",
        label: "Verified Concurrent Microservices",
        note: "Directly supported by 4 production repositories and commit history.",
      },
      {
        id: "flag-2",
        skill: "Apache Kafka",
        status: "strong",
        label: "Verified Event Ingestion",
        note: "Built consumer offset tracking and DLQ recovery at CloudScale.",
      },
      {
        id: "flag-3",
        skill: "PostgreSQL",
        status: "strong",
        label: "Verified Schema Optimization",
        note: "Detailed ledger schema migration and performance tuning verified.",
      },
      {
        id: "flag-4",
        skill: "FastAPI",
        status: "supported",
        label: "Supported Backend Framework",
        note: "Experience confirmed via candidate technical assessment & resume.",
      },
      {
        id: "flag-5",
        skill: "AWS",
        status: "warning",
        label: "Needs Cloud Verification",
        note: "Self-reported on resume; no IAM or terraform infrastructure artifacts.",
      },
      {
        id: "flag-6",
        skill: "Kubernetes",
        status: "missing",
        label: "Missing Orchestration Baseline",
        note: "Required for production cluster deployment.",
      },
    ],
    projects: [
      {
        id: "proj-1",
        title: "High-Throughput Ledger Ingestion Pipeline",
        role: "Lead Backend Engineer",
        description:
          "Engineered distributed event streaming microservices in Go and Kafka, ingesting financial transactions with zero data loss and sub-20ms latency.",
        relevance: "High",
        techStack: ["Go", "Kafka", "PostgreSQL", "Docker", "Prometheus"],
        metrics: "10M+ daily events, 99.99% uptime",
      },
      {
        id: "proj-2",
        title: "Distributed Query Caching Engine",
        role: "Backend Architect",
        description:
          "Built a multi-tier cache invalidation layer on top of Redis and PostgreSQL, reducing cold database query spikes by 74%.",
        relevance: "High",
        techStack: ["Python", "FastAPI", "Redis", "PostgreSQL"],
        metrics: "74% database load reduction",
      },
    ],
    resumeFile: {
      name: "Alex_Chen_Senior_Backend_2026.pdf",
      size: "248 KB",
      uploadedAt: "Sep 12, 2026",
    },
    profileLinks: {
      github: "https://github.com/alexchen-dev",
      linkedin: "https://linkedin.com/in/alexchen-eng",
      portfolio: "https://alexchen.dev",
    },
    decisionNotes: {
      strengths: [
        "Proven expertise building concurrent, high-throughput Go and Kafka streaming systems.",
        "Deep understanding of PostgreSQL table partitioning and database performance tuning.",
        "Clear GitHub commit ledger with consistent, high-quality distributed systems code.",
      ],
      concerns: [
        "Minimal hands-on Kubernetes orchestration experience in production.",
        "AWS operational architecture claims are self-reported and unverified.",
      ],
      verificationItems: [
        "Probe consumer group rebalance strategies and partition failover in Kafka during interview.",
        "Ask candidate to walk through their AWS VPC and security group provisioning approach.",
      ],
      recommendedNextStep:
        "Recommended for Distributed Systems Architecture Technical Interview",
    },
    appliedAt: "Sep 12, 2026",
    lastActive: "2 hours ago",
  },
  {
    id: "cand-marcus-vance",
    name: "Marcus Vance",
    email: "marcus.vance@techlead.io",
    phone: "+1 (555) 714-2290",
    currentRole: "Staff Backend Engineer",
    location: "Seattle, WA",
    experienceYears: 7,
    experience: "7 years",
    targetJobId: "job-distributed-backend",
    matchSummary: {
      score: 94,
      scoreLabel: "94% Alignment",
      strengthsCount: 8,
      flagsCount: 1,
      summaryNote:
        "Exceptional alignment across Go, Kafka, AWS, and Kubernetes. Strong distributed consensus background.",
    },
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Interview",
    isShortlisted: true,
    keySkills: [
      {
        name: "Go (Golang)",
        status: "Matched",
        category: "Languages",
        evidenceSnippet: "4+ years production Go microservices at enterprise scale.",
      },
      {
        name: "Apache Kafka",
        status: "Matched",
        category: "Streaming",
        evidenceSnippet: "Designed cross-region Kafka mirroring clusters.",
      },
      {
        name: "PostgreSQL",
        status: "Matched",
        category: "Databases",
        evidenceSnippet: "Managed distributed Citus PostgreSQL clusters.",
      },
      {
        name: "Kubernetes",
        status: "Matched",
        category: "Orchestration",
        evidenceSnippet: "Wrote custom Kubernetes Operators in Go.",
      },
      {
        name: "AWS",
        status: "Matched",
        category: "Cloud",
        evidenceSnippet: "Certified AWS Solutions Architect Professional.",
      },
      {
        name: "Python",
        status: "Supported",
        category: "Languages",
        evidenceSnippet: "Internal tooling and data migration CLI scripts.",
      },
    ],
    verificationFlags: [
      {
        id: "flag-mv-1",
        skill: "Go (Golang)",
        status: "strong",
        label: "Verified Staff-Level Go",
        note: "Author of popular open-source Go concurrency library.",
      },
      {
        id: "flag-mv-2",
        skill: "Kubernetes",
        status: "strong",
        label: "Verified K8s Operator Development",
        note: "Built custom CRD controller managing multi-tenant Kafka instances.",
      },
      {
        id: "flag-mv-3",
        skill: "PostgreSQL",
        status: "strong",
        label: "Verified Sharding & HA",
        note: "Proven zero-downtime cluster upgrades across 12TB database.",
      },
    ],
    projects: [
      {
        id: "proj-mv-1",
        title: "Cross-Region Event Ingestion Platform",
        role: "Principal Architect",
        description:
          "Scaled multi-region event fabric processing 85,000 events/sec with strict idempotency and Raft-based state reconciliation.",
        relevance: "High",
        techStack: ["Go", "Kafka", "Kubernetes", "AWS", "Terraform"],
        metrics: "85K events/sec, p99 latency under 14ms",
      },
    ],
    resumeFile: {
      name: "Marcus_Vance_Staff_Systems_Engineer.pdf",
      size: "312 KB",
      uploadedAt: "Sep 10, 2026",
    },
    profileLinks: {
      github: "https://github.com/mvance-sys",
      linkedin: "https://linkedin.com/in/marcus-vance-eng",
    },
    decisionNotes: {
      strengths: [
        "Comprehensive distributed systems pedigree meeting every Must-have and Preferred criterion.",
        "Demonstrated leadership scaling systems to tens of thousands of requests per second.",
      ],
      concerns: [
        "Compensation expectation may sit at high staff band; verify budget alignment.",
      ],
      verificationItems: [
        "Assess culture alignment with autonomous team structure.",
      ],
      recommendedNextStep:
        "Recommended for Onsite Technical & Leadership Interview Loop",
    },
    appliedAt: "Sep 10, 2026",
    lastActive: "1 day ago",
  },
  {
    id: "cand-elena-rostova",
    name: "Elena Rostova",
    email: "elena.rostova@datastream.io",
    phone: "+1 (555) 491-0382",
    currentRole: "Distributed Systems Developer",
    location: "Austin, TX (Remote)",
    experienceYears: 4,
    experience: "4 years",
    targetJobId: "job-distributed-backend",
    matchSummary: {
      score: 79,
      scoreLabel: "79% Alignment",
      strengthsCount: 5,
      flagsCount: 3,
      summaryNote:
        "Strong Python, Kafka, and PostgreSQL background. Go experience is predominantly project-based rather than high-scale production.",
    },
    skillCoverage: "Good",
    evidenceStrength: "Moderate",
    projectRelevance: "Moderate",
    evaluationStatus: "Good",
    pipelineStage: "Screening",
    isShortlisted: false,
    keySkills: [
      {
        name: "Python",
        status: "Matched",
        category: "Languages",
        evidenceSnippet: "4 years building asynchronous pipeline services.",
      },
      {
        name: "PostgreSQL",
        status: "Matched",
        category: "Databases",
        evidenceSnippet: "Extensive experience with SQLAlchemy and Alembic.",
      },
      {
        name: "Apache Kafka",
        status: "Matched",
        category: "Streaming",
        evidenceSnippet: "Kafka stream worker maintenance and Avro schemas.",
      },
      {
        name: "FastAPI",
        status: "Matched",
        category: "Frameworks",
        evidenceSnippet: "Built internal microservices gateway with JWT auth.",
      },
      {
        name: "Go (Golang)",
        status: "Needs verification",
        category: "Languages",
        evidenceSnippet: "Contributions to open-source Go repositories.",
      },
      {
        name: "Docker",
        status: "Supported",
        category: "DevOps",
        evidenceSnippet: "Docker Compose environments for integration test suites.",
      },
      {
        name: "Terraform",
        status: "Missing",
        category: "DevOps",
        evidenceSnippet: "No infrastructure-as-code experience documented.",
      },
    ],
    verificationFlags: [
      {
        id: "flag-er-1",
        skill: "Python & FastAPI",
        status: "strong",
        label: "Verified Asynchronous API Services",
        note: "Clean code structure and automated pytest suites verified.",
      },
      {
        id: "flag-er-2",
        skill: "Go (Golang)",
        status: "warning",
        label: "Production Go Tenure Unverified",
        note: "Primary commercial tenure is Python; Go demonstrated in side projects only.",
      },
      {
        id: "flag-er-3",
        skill: "Terraform",
        status: "missing",
        label: "Missing IaC Evidence",
        note: "No terraform or cloud deployment automation claims verified.",
      },
    ],
    projects: [
      {
        id: "proj-er-1",
        title: "Real-time Telemetry Processing Service",
        role: "Senior Developer",
        description:
          "Constructed Python/FastAPI microservices processing IoT sensor logs from Kafka topics into partitioned PostgreSQL databases.",
        relevance: "Moderate",
        techStack: ["Python", "Kafka", "PostgreSQL", "FastAPI"],
        metrics: "Processed 2M records daily",
      },
    ],
    resumeFile: {
      name: "Elena_Rostova_CV_2026.pdf",
      size: "198 KB",
      uploadedAt: "Sep 13, 2026",
    },
    profileLinks: {
      github: "https://github.com/erostova-dev",
      linkedin: "https://linkedin.com/in/elena-rostova-engineer",
    },
    decisionNotes: {
      strengths: [
        "Solid foundations in event-driven streaming with Apache Kafka.",
        "Very clean asynchronous Python architecture and API schema design.",
      ],
      concerns: [
        "Role requires heavy production Go; candidate's Go experience needs rigorous coding verification.",
      ],
      verificationItems: [
        "Administer live Go coding session focusing on channels, goroutine lifecycle, and mutexes.",
      ],
      recommendedNextStep:
        "Recommended for Initial Technical Screen on Go Concurrency",
    },
    appliedAt: "Sep 13, 2026",
    lastActive: "5 hours ago",
  },
  {
    id: "cand-devonte-washington",
    name: "Devonte Washington",
    email: "devonte.wash@infranet.org",
    phone: "+1 (555) 830-1922",
    currentRole: "Lead Site Reliability & Platform Engineer",
    location: "New York, NY",
    experienceYears: 6,
    experience: "6 years",
    targetJobId: "job-distributed-backend",
    matchSummary: {
      score: 82,
      scoreLabel: "82% Alignment",
      strengthsCount: 6,
      flagsCount: 2,
      summaryNote:
        "High infrastructure capability in Docker, Kubernetes, AWS, and Go. Less focus on application-level PostgreSQL domain modeling.",
    },
    skillCoverage: "Good",
    evidenceStrength: "Strong",
    projectRelevance: "Moderate",
    evaluationStatus: "Good",
    pipelineStage: "Screening",
    isShortlisted: true,
    keySkills: [
      {
        name: "Go (Golang)",
        status: "Matched",
        category: "Languages",
        evidenceSnippet: "Wrote Go CLI utilities and cluster health controllers.",
      },
      {
        name: "Docker",
        status: "Matched",
        category: "DevOps",
        evidenceSnippet: "Standardized enterprise container images across 35 teams.",
      },
      {
        name: "Kubernetes",
        status: "Matched",
        category: "Orchestration",
        evidenceSnippet: "Administered 18 multi-tenant EKS production clusters.",
      },
      {
        name: "AWS",
        status: "Matched",
        category: "Cloud",
        evidenceSnippet: "Terraform automation for VPC, IAM, Transit Gateway, and RDS.",
      },
      {
        name: "PostgreSQL",
        status: "Needs verification",
        category: "Databases",
        evidenceSnippet: "Managed RDS instances, but less application-level modeling.",
      },
      {
        name: "Apache Kafka",
        status: "Supported",
        category: "Streaming",
        evidenceSnippet: "Monitored MSK cluster consumer lag and disk saturation.",
      },
    ],
    verificationFlags: [
      {
        id: "flag-dw-1",
        skill: "Kubernetes & AWS",
        status: "strong",
        label: "Verified Infrastructure Orchestration",
        note: "Extensive Terraform configuration and infrastructure monitoring evidence.",
      },
      {
        id: "flag-dw-2",
        skill: "PostgreSQL",
        status: "warning",
        label: "Database Domain Modeling Gap",
        note: "Infrastructure operations experience verified, but schema modeling unverified.",
      },
    ],
    projects: [
      {
        id: "proj-dw-1",
        title: "Enterprise Multi-Region Kubernetes Migration",
        role: "Lead Platform Engineer",
        description:
          "Migrated 140 microservices from on-premise datacenter to AWS EKS with zero downtime using Istio service mesh and automated blue/green canary deployments.",
        relevance: "Moderate",
        techStack: ["Kubernetes", "AWS", "Terraform", "Go", "Istio"],
        metrics: "99.995% reliability SLA achieved",
      },
    ],
    resumeFile: {
      name: "Devonte_Washington_SRE_Lead.pdf",
      size: "284 KB",
      uploadedAt: "Sep 11, 2026",
    },
    profileLinks: {
      github: "https://github.com/devontew-sre",
      linkedin: "https://linkedin.com/in/devonte-washington-infra",
    },
    decisionNotes: {
      strengths: [
        "Unmatched operational mastery across Kubernetes, AWS, and cloud reliability.",
        "Competent Go developer with infrastructure automation expertise.",
      ],
      concerns: [
        "Profile leans more SRE/Platform than core application backend engineering.",
      ],
      verificationItems: [
        "Clarify willingness to focus on backend application domain logic vs pure infrastructure.",
      ],
      recommendedNextStep:
        "Recommended for Role Scope Alignment & System Design Call",
    },
    appliedAt: "Sep 11, 2026",
    lastActive: "3 days ago",
  },
  {
    id: "cand-priya-nair",
    name: "Priya Nair",
    email: "priya.nair@stackcore.com",
    phone: "+1 (555) 629-8471",
    currentRole: "Backend Software Engineer",
    location: "San Jose, CA",
    experienceYears: 3,
    experience: "3 years",
    targetJobId: "job-distributed-backend",
    matchSummary: {
      score: 64,
      scoreLabel: "64% Alignment",
      strengthsCount: 3,
      flagsCount: 4,
      summaryNote:
        "Strong fundamental Go and PostgreSQL experience. Limited exposure to Kafka streaming and below the 4+ year minimum seniority guideline.",
    },
    skillCoverage: "Needs review",
    evidenceStrength: "Needs verification",
    projectRelevance: "Moderate",
    evaluationStatus: "Needs review",
    pipelineStage: "New",
    isShortlisted: false,
    keySkills: [
      {
        name: "Go (Golang)",
        status: "Matched",
        category: "Languages",
        evidenceSnippet: "2 years building REST services in Go with Gin framework.",
      },
      {
        name: "PostgreSQL",
        status: "Matched",
        category: "Databases",
        evidenceSnippet: "Basic schema creation, joins, and indexing.",
      },
      {
        name: "Docker",
        status: "Supported",
        category: "DevOps",
        evidenceSnippet: "Local development containerization.",
      },
      {
        name: "Apache Kafka",
        status: "Missing",
        category: "Streaming",
        evidenceSnippet: "No streaming pipeline experience demonstrated.",
      },
      {
        name: "Kubernetes",
        status: "Missing",
        category: "Orchestration",
        evidenceSnippet: "No cluster orchestration claims.",
      },
    ],
    verificationFlags: [
      {
        id: "flag-pn-1",
        skill: "Tenure / Experience",
        status: "warning",
        label: "Seniority Below Target Baseline",
        note: "3 years total experience against 4+ year senior engineering requirement.",
      },
      {
        id: "flag-pn-2",
        skill: "Apache Kafka",
        status: "missing",
        label: "Missing Must-Have Streaming Skill",
        note: "Kafka is a core requirement for ledger ingestion pipeline.",
      },
    ],
    projects: [
      {
        id: "proj-pn-1",
        title: "Internal Inventory REST Microservices",
        role: "Backend Engineer",
        description:
          "Developed REST API endpoints using Go (Gin) and PostgreSQL for warehouse asset tracking.",
        relevance: "Moderate",
        techStack: ["Go", "Gin", "PostgreSQL", "Docker"],
      },
    ],
    resumeFile: {
      name: "Priya_Nair_Resume_2026.pdf",
      size: "172 KB",
      uploadedAt: "Sep 14, 2026",
    },
    profileLinks: {
      github: "https://github.com/pnair-code",
      linkedin: "https://linkedin.com/in/priya-nair-dev",
    },
    decisionNotes: {
      strengths: [
        "Clean Go syntax and thorough automated testing practices.",
        "Demonstrated eager learner with solid relational database fundamentals.",
      ],
      concerns: [
        "Lacks distributed streaming and fails 4-year senior threshold for this target requisition.",
      ],
      verificationItems: [
        "Check if candidate can be considered for Mid-level Backend Requisition instead.",
      ],
      recommendedNextStep:
        "Route to Mid-level Engineering Pool or Keep in Nurture Pipeline",
    },
    appliedAt: "Sep 14, 2026",
    lastActive: "6 hours ago",
  },
  {
    id: "cand-liam-henderson",
    name: "Liam Henderson",
    email: "liam.h@codelabs.co",
    phone: "+1 (555) 902-3419",
    currentRole: "Junior Full Stack Developer",
    location: "Denver, CO (Remote)",
    experienceYears: 2,
    experience: "2 years",
    targetJobId: "job-distributed-backend",
    matchSummary: {
      score: 41,
      scoreLabel: "41% Alignment",
      strengthsCount: 1,
      flagsCount: 5,
      summaryNote:
        "Substantial gaps across Go, Kafka, distributed systems, and minimum seniority. Not aligned with Senior requisition requirements.",
    },
    skillCoverage: "Weak",
    evidenceStrength: "Weak",
    projectRelevance: "Low",
    evaluationStatus: "Weak",
    pipelineStage: "Rejected",
    isShortlisted: false,
    keySkills: [
      {
        name: "Python",
        status: "Supported",
        category: "Languages",
        evidenceSnippet: "Basic Django and Flask web scripts.",
      },
      {
        name: "Go (Golang)",
        status: "Missing",
        category: "Languages",
        evidenceSnippet: "No Go experience identified.",
      },
      {
        name: "Apache Kafka",
        status: "Missing",
        category: "Streaming",
        evidenceSnippet: "No distributed streaming knowledge found.",
      },
      {
        name: "PostgreSQL",
        status: "Needs verification",
        category: "Databases",
        evidenceSnippet: "Basic ORM usage with SQLite and Postgres in tutorials.",
      },
    ],
    verificationFlags: [
      {
        id: "flag-lh-1",
        skill: "Core Qualifications",
        status: "missing",
        label: "Missing 5 of 6 Essential Criteria",
        note: "Does not satisfy Go, Kafka, or distributed systems prerequisites.",
      },
      {
        id: "flag-lh-2",
        skill: "Seniority",
        status: "warning",
        label: "Insufficient Commercial Experience",
        note: "Candidate has 2 years full-stack experience vs senior systems baseline.",
      },
    ],
    projects: [],
    resumeFile: {
      name: "Liam_Henderson_WebDev.pdf",
      size: "145 KB",
      uploadedAt: "Sep 09, 2026",
    },
    profileLinks: {
      github: "https://github.com/liam-h-dev",
    },
    decisionNotes: {
      strengths: ["Basic web development fundamentals in Python and JavaScript."],
      concerns: [
        "Fails essential requirements for senior distributed backend role.",
      ],
      verificationItems: ["Not qualified for current requisition."],
      recommendedNextStep: "Send polite rejection notice",
    },
    appliedAt: "Sep 09, 2026",
    lastActive: "5 days ago",
  },
  // Additional candidates for other requisitions
  {
    id: "cand-sarah-jenkins",
    name: "Sarah Jenkins",
    email: "s.jenkins@cloudscale.io",
    phone: "+1 (555) 234-8891",
    currentRole: "Lead Cloud Infrastructure Architect",
    location: "San Francisco, CA",
    experienceYears: 8,
    experience: "8 years",
    targetJobId: "job-cloud-infra",
    matchSummary: {
      score: 96,
      scoreLabel: "96% Alignment",
      strengthsCount: 9,
      flagsCount: 0,
      summaryNote:
        "Superb Terraform, AWS, Kubernetes, and automated disaster recovery track record.",
    },
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Interview",
    isShortlisted: true,
    keySkills: [
      { name: "Terraform", status: "Matched", category: "IaC" },
      { name: "AWS", status: "Matched", category: "Cloud" },
      { name: "Kubernetes", status: "Matched", category: "Orchestration" },
      { name: "Prometheus & Datadog", status: "Matched", category: "Observability" },
    ],
    verificationFlags: [
      {
        id: "flag-sj-1",
        skill: "AWS & Terraform",
        status: "strong",
        label: "Verified Enterprise Cloud Architect",
        note: "Automated multi-account AWS Organization across 40+ VPCs.",
      },
    ],
    projects: [],
    resumeFile: {
      name: "Sarah_Jenkins_Cloud_Lead.pdf",
      size: "320 KB",
      uploadedAt: "Sep 11, 2026",
    },
    profileLinks: {
      linkedin: "https://linkedin.com/in/sarah-jenkins-cloud",
      github: "https://github.com/sjenkins-infra",
    },
    decisionNotes: {
      strengths: ["Outstanding enterprise IaC and cloud security credentials."],
      concerns: [],
      verificationItems: ["Verify team leadership style and on-call rotation preferences."],
      recommendedNextStep: "Schedule Final Executive Interview",
    },
    appliedAt: "Sep 11, 2026",
    lastActive: "1 day ago",
  },
  {
    id: "cand-jordan-blake",
    name: "Jordan Blake",
    email: "jordan.b@frontendcraft.net",
    phone: "+1 (555) 512-9901",
    currentRole: "Staff Frontend Engineer",
    location: "New York, NY",
    experienceYears: 7,
    experience: "7 years",
    targetJobId: "job-frontend-lead",
    matchSummary: {
      score: 91,
      scoreLabel: "91% Alignment",
      strengthsCount: 7,
      flagsCount: 1,
      summaryNote:
        "Mastery in Next.js, React 19, TypeScript, micro-frontends, and web performance budgets.",
    },
    skillCoverage: "Strong",
    evidenceStrength: "Strong",
    projectRelevance: "High",
    evaluationStatus: "Strong",
    pipelineStage: "Technical Review",
    isShortlisted: true,
    keySkills: [
      { name: "Next.js & React", status: "Matched", category: "Frameworks" },
      { name: "TypeScript", status: "Matched", category: "Languages" },
      { name: "Design Systems", status: "Matched", category: "UI/UX" },
      { name: "Web Performance (Core Vitals)", status: "Matched", category: "Optimization" },
    ],
    verificationFlags: [
      {
        id: "flag-jb-1",
        skill: "TypeScript Architecture",
        status: "strong",
        label: "Verified Monorepo Architect",
        note: "Architected Turborepo system adopted across 80+ engineering teams.",
      },
    ],
    projects: [],
    resumeFile: {
      name: "Jordan_Blake_Staff_Frontend.pdf",
      size: "260 KB",
      uploadedAt: "Sep 13, 2026",
    },
    profileLinks: {
      github: "https://github.com/jblake-ui",
    },
    decisionNotes: {
      strengths: ["Strong design systems and runtime performance optimization track record."],
      concerns: ["Limited backend/API integration outside BFF patterns."],
      verificationItems: ["Evaluate state management philosophy during technical interview."],
      recommendedNextStep: "Advance to Frontend Architecture Review",
    },
    appliedAt: "Sep 13, 2026",
    lastActive: "4 hours ago",
  },
];

export function getStageBadgeVariant(
  stage: PipelineStage
): "brand" | "neutral" | "outline" | "success" | "warning" {
  switch (stage) {
    case "Interview":
    case "Shortlisted":
      return "brand";
    case "Technical Review":
      return "success";
    case "Screening":
      return "warning";
    case "New":
      return "neutral";
    case "Rejected":
      return "outline";
    default:
      return "neutral";
  }
}

export function getEvaluationStatusBadgeVariant(
  status: EvaluationStatus
): "brand" | "neutral" | "outline" | "success" | "warning" {
  switch (status) {
    case "Strong":
      return "success";
    case "Good":
      return "brand";
    case "Needs review":
      return "warning";
    case "Weak":
      return "outline";
    default:
      return "neutral";
  }
}

export function getEvidenceStrengthBadgeVariant(
  strength: EvidenceStrength
): "brand" | "neutral" | "outline" | "success" | "warning" {
  switch (strength) {
    case "Strong":
      return "success";
    case "Moderate":
      return "brand";
    case "Needs verification":
      return "warning";
    case "Weak":
      return "outline";
    default:
      return "neutral";
  }
}
