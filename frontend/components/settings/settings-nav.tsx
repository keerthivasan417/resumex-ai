import React from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export type SettingsSectionId =
  | "evaluation"
  | "matching"
  | "sources"
  | "policy"
  | "team"
  | "danger";

interface SettingsNavProps {
  activeSection: SettingsSectionId;
  onSelectSection: (id: SettingsSectionId) => void;
}

interface NavItem {
  id: SettingsSectionId;
  label: string;
  description: string;
  icon: keyof typeof Icons;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "evaluation",
    label: "Evaluation Mode",
    description: "Criteria strictness & sensitivity",
    icon: "cpu",
  },
  {
    id: "matching",
    label: "Matching Weights",
    description: "Scoring balance & priorities",
    icon: "barChart",
  },
  {
    id: "sources",
    label: "External Evidence Sources",
    description: "GitHub, competitive coding & profiles",
    icon: "code",
  },
  {
    id: "policy",
    label: "Verification Policy",
    description: "Claim validity & confidence rules",
    icon: "shieldCheck",
  },
  {
    id: "team",
    label: "Workspace & Team",
    description: "Members, access roles & branding",
    icon: "users",
  },
  {
    id: "danger",
    label: "Danger Zone",
    description: "Reset demo & cache management",
    icon: "alertCircle",
  },
];

export function SettingsNav({
  activeSection,
  onSelectSection,
}: SettingsNavProps) {
  return (
    <div>
      {/* Mobile/Tablet Dropdown Selector */}
      <div className="md:hidden mb-4">
        <label className="text-xs font-medium text-zinc-500 block mb-1.5">
          Settings Section:
        </label>
        <div className="relative">
          <select
            value={activeSection}
            onChange={(e) =>
              onSelectSection(e.target.value as SettingsSectionId)
            }
            className="h-10 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-3 pr-8 text-xs font-semibold text-zinc-900 shadow-2xs focus:border-brand-500 focus:outline-none"
          >
            {NAV_ITEMS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
          <Icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      {/* Desktop Vertical Nav List */}
      <nav className="hidden md:flex flex-col space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          const IconComponent = Icons[item.icon] || Icons.settings;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={cn(
                "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                isActive
                  ? "bg-zinc-900 text-white shadow-2xs"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
                item.id === "danger" && !isActive && "text-red-600 hover:bg-red-50 hover:text-red-700"
              )}
            >
              <IconComponent
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 transition-colors",
                  isActive
                    ? "text-white"
                    : item.id === "danger"
                    ? "text-red-500"
                    : "text-zinc-400 group-hover:text-zinc-700"
                )}
              />
              <div className="space-y-0.5">
                <span className="block text-xs font-semibold leading-tight">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "block text-[11px] leading-tight",
                    isActive
                      ? "text-zinc-300"
                      : item.id === "danger"
                      ? "text-red-400"
                      : "text-zinc-400 group-hover:text-zinc-500"
                  )}
                >
                  {item.description}
                </span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
