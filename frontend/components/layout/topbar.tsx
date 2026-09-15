"use client";

import { Icons } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/types/navigation";

interface TopbarProps {
  role: Role;
  onOpenMobileNav: () => void;
}

export function Topbar({ role, onOpenMobileNav }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-1.5 text-zinc-600 hover:text-zinc-900 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-600"
          aria-label="Open navigation sidebar"
        >
          <Icons.menu className="h-5 w-5" />
        </button>

        {/* Workspace role badge & title */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-900 capitalize">
            {role} Workspace
          </span>
          <span className="text-zinc-300 hidden sm:inline">/</span>
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
            resumex.intel.eval
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <Badge variant="brand" className="hidden sm:inline-flex text-[11px] font-mono">
          EVIDENCE ACTIVE
        </Badge>

        <div className="h-4 w-px bg-zinc-200 hidden sm:block" />

        {/* User profile preview pill */}
        <div className="flex items-center gap-2 rounded-full border border-zinc-200 py-1 px-2.5 bg-zinc-50">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-medium text-white">
            RX
          </div>
          <span className="text-xs font-medium text-zinc-700 hidden sm:inline">
            Demo Session
          </span>
        </div>
      </div>
    </header>
  );
}
