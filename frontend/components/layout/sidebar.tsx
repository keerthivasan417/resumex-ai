"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Role } from "@/types/navigation";
import { getNavSectionsForRole } from "@/lib/navigation";
import { Icons, renderNavIcon } from "@/components/ui/icons";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: Role;
  onRoleChange?: (newRole: Role) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({
  role,
  onRoleChange,
  isOpenOnMobile = false,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const navSections = getNavSectionsForRole(role);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          isOpenOnMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-200">
          <Link href="/" className="flex items-center gap-2.5">
            <Icons.logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-tight text-zinc-950">
              Resume<span className="text-brand-600">X</span>
            </span>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1 text-zinc-500 hover:text-zinc-900 rounded-md focus:outline-none"
            aria-label="Close navigation"
          >
            <Icons.x className="h-5 w-5" />
          </button>
        </div>

        {/* Role Switcher Pill */}
        <div className="p-3 border-b border-zinc-100">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
              Active Workspace
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 rounded-md bg-zinc-100 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => onRoleChange?.("candidate")}
              className={cn(
                "rounded py-1 transition-all text-center",
                role === "candidate"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => onRoleChange?.("recruiter")}
              className={cn(
                "rounded py-1 transition-all text-center",
                role === "recruiter"
                  ? "bg-white text-zinc-950 shadow-xs font-semibold"
                  : "text-zinc-500 hover:text-zinc-900"
              )}
            >
              Recruiter
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {section.title && (
                <div className="px-2.5 pb-1 text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => {
                const isActive =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={onCloseMobile}
                    className={cn(
                      "flex items-center justify-between rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-900 font-semibold"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          isActive ? "text-brand-700" : "text-zinc-400 group-hover:text-zinc-600"
                        )}
                      >
                        {renderNavIcon(item.iconName, "h-4 w-4")}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <Badge variant="neutral" className="text-[10px] px-1.5 py-0">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer: System Status */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-50/50">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-600 font-medium">Evidence Engine</span>
            </div>
            <span className="font-mono text-[11px] text-zinc-400">v0.1-preview</span>
          </div>
        </div>
      </aside>
    </>
  );
}
