import { NavSection, Role } from "@/types/navigation";

export const candidateNavSections: NavSection[] = [
  {
    title: "Intelligence",
    items: [
      { title: "Overview", href: "/app", iconName: "layout-dashboard" },
      { title: "My Resume", href: "/app/resume", iconName: "file-text" },
      { title: "Job Matches", href: "/app/matches", iconName: "briefcase" },
      { title: "Skills", href: "/app/skills", iconName: "cpu" },
      { title: "Evidence", href: "/app/evidence", iconName: "check-circle" },
      { title: "Developer Profile", href: "/app/profile", iconName: "code" },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Reports", href: "/app/reports", iconName: "bar-chart-2" },
      { title: "Settings", href: "/app/settings", iconName: "settings" },
    ],
  },
];

export const recruiterNavSections: NavSection[] = [
  {
    title: "Talent Discovery",
    items: [
      { title: "Dashboard", href: "/app", iconName: "layout-dashboard" },
      { title: "Jobs", href: "/app/jobs", iconName: "briefcase" },
      { title: "Candidates", href: "/app/candidates", iconName: "users" },
      { title: "Shortlists", href: "/app/shortlists", iconName: "bookmark" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { title: "Reports", href: "/app/reports", iconName: "bar-chart-2" },
      { title: "Settings", href: "/app/settings", iconName: "settings" },
    ],
  },
];

export function getNavSectionsForRole(role: Role): NavSection[] {
  return role === "candidate" ? candidateNavSections : recruiterNavSections;
}
