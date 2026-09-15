import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export function LandingFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-12 text-sm text-zinc-500">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Icons.logo className="h-5 w-5" />
              <span className="text-base font-semibold text-zinc-950">
                Resume<span className="text-brand-600">X</span>
              </span>
            </Link>
            <p className="mt-2 text-xs text-zinc-500 max-w-sm">
              Turn resumes into verified talent intelligence. Evidence-aware
              screening for high-performance engineering teams.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
            <div>
              <div className="font-semibold text-zinc-900 mb-2">Workspace</div>
              <ul className="space-y-1.5">
                <li>
                  <Link href="/app" className="hover:text-zinc-900 transition-colors">
                    Candidate View
                  </Link>
                </li>
                <li>
                  <Link href="/app" className="hover:text-zinc-900 transition-colors">
                    Recruiter View
                  </Link>
                </li>
                <li>
                  <Link href="/app" className="hover:text-zinc-900 transition-colors">
                    Intelligence Reports
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-900 mb-2">Core Tech</div>
              <ul className="space-y-1.5">
                <li>
                  <a href="#capabilities" className="hover:text-zinc-900 transition-colors">
                    Skill Extraction
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="hover:text-zinc-900 transition-colors">
                    Evidence Verification
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="hover:text-zinc-900 transition-colors">
                    Gap Analysis
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-zinc-900 mb-2">Platform</div>
              <ul className="space-y-1.5">
                <li className="text-zinc-400">Documentation</li>
                <li className="text-zinc-400">API Reference</li>
                <li className="text-zinc-400">Security & Privacy</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© {new Date().getFullYear()} ResumeX. All rights reserved.</p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Evidence-First Screening Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
