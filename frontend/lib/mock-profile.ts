import { DeveloperProfile } from "@/types/profile";

export const mockDeveloperProfile: DeveloperProfile = {
  candidateName: "Alex Chen",
  headline: "Senior Backend & Distributed Systems Engineer",
  location: "San Francisco, CA (Remote Eligible)",
  experienceYears: "4+ Years Professional Experience",
  summary:
    "Systems engineer specialized in high-throughput event streaming, distributed consensus, and concurrent microservices architecture. Primary depth in Go and Python with production PostgreSQL schema design and Kafka partition engineering.",
  profileStrength: {
    rating: "High Evidence Grounding",
    level: "High",
    verifiedChannelsCount: 4,
    totalChannelsCount: 5,
    description: "4 of 5 verification channels confirmed with deterministic AST and repository artifacts.",
  },
  insights: [
    "Strong backend and distributed systems orientation with verified Go, Apache Kafka, and PostgreSQL production ownership.",
    "Codebase authorship confirms primary implementation of partitioned event streams and high-concurrency consumer handlers.",
    "Algorithmic competency corroborated by active competitive coding platform benchmarks (LeetCode Knight ranking, Top 3.8%).",
    "Orchestration manifests (Kubernetes/Terraform) are currently private or exploratory; ideal for infrastructure onboarding.",
  ],
  languageDistribution: [
    {
      name: "Go (Golang)",
      percentage: 54,
      color: "#0d9488", // brand teal
      linesOfCode: "84,200 LOC",
      primaryFocus: "Distributed event pipelines, concurrency handlers & consumer groups",
    },
    {
      name: "Python",
      percentage: 24,
      color: "#2563eb", // blue
      linesOfCode: "38,400 LOC",
      primaryFocus: "Data ingestion automation, ETL workers & REST APIs",
    },
    {
      name: "TypeScript",
      percentage: 12,
      color: "#4f46e5", // indigo
      linesOfCode: "19,100 LOC",
      primaryFocus: "Telemetry interfaces, internal ops dashboards & React state",
    },
    {
      name: "SQL",
      percentage: 6,
      color: "#d97706", // amber
      linesOfCode: "9,600 LOC",
      primaryFocus: "Partition table DDL, composite indexes & query tuning",
    },
    {
      name: "Rust",
      percentage: 4,
      color: "#db2777", // pink
      linesOfCode: "6,200 LOC",
      primaryFocus: "Systems memory safety experiments & low-level CLI utilities",
    },
  ],
  technicalBreadth: [
    {
      name: "Languages",
      skills: [
        { name: "Go (Golang)", evidenceCount: 4, status: "Verified" },
        { name: "Python", evidenceCount: 3, status: "Supported" },
        { name: "TypeScript", evidenceCount: 3, status: "Supported" },
        { name: "SQL", evidenceCount: 2, status: "Supported" },
        { name: "Rust", evidenceCount: 1, status: "Exploratory" },
      ],
    },
    {
      name: "Frameworks",
      skills: [
        { name: "Gin / Standard Library", evidenceCount: 3, status: "Verified" },
        { name: "FastAPI", evidenceCount: 2, status: "Supported" },
        { name: "React", evidenceCount: 3, status: "Supported" },
      ],
    },
    {
      name: "Databases",
      skills: [
        { name: "PostgreSQL", evidenceCount: 4, status: "Verified" },
        { name: "Redis", evidenceCount: 3, status: "Verified" },
        { name: "Apache Cassandra", evidenceCount: 2, status: "Supported" },
      ],
    },
    {
      name: "Cloud & Infrastructure",
      skills: [
        { name: "Docker", evidenceCount: 3, status: "Verified" },
        { name: "Kubernetes", evidenceCount: 2, status: "Supported" },
        { name: "AWS (EC2, S3)", evidenceCount: 2, status: "Supported" },
      ],
    },
    {
      name: "Data & Streaming",
      skills: [
        { name: "Apache Kafka", evidenceCount: 4, status: "Verified" },
        { name: "Apache Spark", evidenceCount: 2, status: "Supported" },
      ],
    },
    {
      name: "Tools & OS",
      skills: [
        { name: "Git & GitHub Flow", evidenceCount: 4, status: "Verified" },
        { name: "Linux / POSIX", evidenceCount: 3, status: "Verified" },
        { name: "Prometheus / Metrics", evidenceCount: 2, status: "Supported" },
      ],
    },
  ],
  projects: [
    {
      id: "stream-pipe",
      name: "stream-pipe: Distributed Ingestion Engine",
      description:
        "High-throughput event consumer pipeline implemented in Go using Sarama Kafka integration. Handled 12M raw telemetry events daily with zero partition rebalance stalls.",
      architectureScope:
        "Multi-threaded consumer group balancing, offset recovery checkpoints, and Prometheus exporter endpoints.",
      technologies: ["Go", "Apache Kafka", "Docker", "Prometheus"],
      repoUrl: "https://github.com/org/stream-pipe",
      relevance: "Primary evidence grounding for Go concurrency & streaming architecture",
      evidenceBadge: "AST Grounded (84 Commits)",
    },
    {
      id: "billing-store",
      name: "multi-tenant-pg-store",
      description:
        "Database layer architecture for high-volume subscription billing. Features time-range partition pruning and composite index optimization in PostgreSQL 14.",
      architectureScope:
        "Dynamic table partitioning, connection pooling with PgBouncer, and ACID migration idempotency.",
      technologies: ["PostgreSQL", "SQL", "Go", "Docker"],
      repoUrl: "https://github.com/org/billing-store",
      relevance: "Demonstrates relational database schema ownership and partition modeling",
      evidenceBadge: "Verified Schema (32 Commits)",
    },
    {
      id: "telemetry-console",
      name: "telemetry-ops-dashboard",
      description:
        "Internal engineering console for live cluster health visualization, socket-based log streaming, and metric alerting.",
      architectureScope:
        "Client-side WebSocket streaming, virtualized data tables, and decoupled state stores.",
      technologies: ["TypeScript", "React", "Tailwind CSS"],
      repoUrl: "https://github.com/org/telemetry-console",
      relevance: "Corroborates TypeScript and frontend engineering competency",
      evidenceBadge: "Public Repo (18 Commits)",
    },
    {
      id: "rate-limiter",
      name: "distributed-redis-limiter",
      description:
        "Token-bucket rate limiting middleware for distributed HTTP microservices using Redis Lua scripts for atomic token consumption.",
      architectureScope:
        "Atomic Lua script execution in Redis, client-side fallback sliding windows, and bench-test harness.",
      technologies: ["Go", "Redis", "Lua"],
      repoUrl: "https://github.com/org/distributed-limiter",
      relevance: "Validates distributed cache design and low-latency middleware engineering",
      evidenceBadge: "AST Grounded (14 Commits)",
    },
  ],
  recentActivity: [
    {
      id: "act-1",
      type: "commit",
      title: "Optimize Sarama partition rebalance offset flush buffer",
      repoOrContext: "github.com/org/stream-pipe",
      timestamp: "3 days ago",
      detail: "Reduced lock contention across concurrent partition consumers by 35%.",
    },
    {
      id: "act-2",
      type: "pr",
      title: "Merge PR #42: Add composite index for tenant billing ledger",
      repoOrContext: "github.com/org/billing-store",
      timestamp: "1 week ago",
      detail: "Eliminated sequential scans on queries filtering by organization and date range.",
    },
    {
      id: "act-3",
      type: "commit",
      title: "Implement atomic Redis token bucket Lua evaluation script",
      repoOrContext: "github.com/org/distributed-limiter",
      timestamp: "2 weeks ago",
      detail: "Benchmarked 45,000 req/sec throughput with sub-millisecond roundtrips.",
    },
    {
      id: "act-4",
      type: "repo_release",
      title: "Tagged v1.4.0 Release: Prometheus metrics exporter",
      repoOrContext: "github.com/org/stream-pipe",
      timestamp: "3 weeks ago",
      detail: "Added latency quantile histograms and Kafka consumer lag counters.",
    },
  ],
  codingProfiles: [
    {
      platform: "LeetCode",
      handle: "alexchen_dev",
      status: "connected",
      profileUrl: "https://leetcode.com/alexchen_dev",
      details: {
        rating: 2048,
        rank: "Knight (Top 3.8%)",
        solvedCount: 642,
        topLanguages: ["Go", "Python", "C++"],
        lastActive: "Active this week",
      },
    },
    {
      platform: "Codeforces",
      handle: "achen_cf",
      status: "linked",
      profileUrl: "https://codeforces.com/profile/achen_cf",
      details: {
        rating: 1684,
        rank: "Expert (Division 2)",
        solvedCount: 310,
        topLanguages: ["C++", "Python"],
        lastActive: "Active this month",
      },
    },
    {
      platform: "CodeChef",
      handle: "achen_cc",
      status: "linked",
      profileUrl: "https://www.codechef.com/users/achen_cc",
      details: {
        rating: 1820,
        rank: "4★ Division 2",
        solvedCount: 145,
        topLanguages: ["C++"],
        lastActive: "Past 90 days",
      },
    },
    {
      platform: "HackerRank",
      handle: "alex_chen",
      status: "connected",
      profileUrl: "https://www.hackerrank.com/alex_chen",
      details: {
        rank: "6★ Problem Solving",
        solvedCount: 120,
        topLanguages: ["Python", "Algorithms"],
      },
    },
    {
      platform: "AtCoder",
      handle: "alex_chen",
      status: "not_connected",
      profileUrl: "https://atcoder.jp",
    },
  ],
  socialProfiles: [
    {
      platform: "GitHub",
      handle: "alexchen-dev",
      status: "connected",
      profileUrl: "https://github.com/alexchen-dev",
      details: {
        solvedCount: 84, // commits in primary repo
        rank: "6 Repos Scanned",
        lastActive: "3 days ago",
      },
    },
    {
      platform: "LinkedIn",
      handle: "alexchen-profile",
      status: "linked",
      profileUrl: "https://linkedin.com/in/alexchen-profile",
      details: {
        rank: "Tenure Verified",
        lastActive: "Profile Ingested",
      },
    },
  ],
};

export function getMockDeveloperProfile(): DeveloperProfile {
  return mockDeveloperProfile;
}
