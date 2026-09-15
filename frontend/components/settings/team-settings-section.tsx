import React, { useState } from "react";
import { TeamMember, TeamRole } from "@/types/settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface TeamSettingsSectionProps {
  workspaceName: string;
  onWorkspaceNameChange: (name: string) => void;
  workspaceSlug: string;
  teamMembers: TeamMember[];
  onRoleChange: (memberId: string, newRole: TeamRole) => void;
  onRemoveMember: (memberId: string) => void;
  onAddMember: (newMember: TeamMember) => void;
}

const ROLES: { id: TeamRole; accessDescription: string }[] = [
  { id: "Admin", accessDescription: "Full Access & Billing" },
  { id: "Recruiter", accessDescription: "Recruiting & Pipeline Evaluation" },
  { id: "Reviewer", accessDescription: "Read-Only Candidate Review" },
];

export function TeamSettingsSection({
  workspaceName,
  onWorkspaceNameChange,
  workspaceSlug,
  teamMembers,
  onRoleChange,
  onRemoveMember,
  onAddMember,
}: TeamSettingsSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<TeamRole>("Recruiter");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const accessDesc =
      ROLES.find((r) => r.id === newRole)?.accessDescription || "Standard Access";

    onAddMember({
      id: `tm-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      accessLevel: accessDesc,
      lastActive: "Just invited",
    });

    setNewName("");
    setNewEmail("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-zinc-200 pb-4">
        <h2 className="text-lg font-bold tracking-tight text-zinc-950">
          Workspace & Team Configuration
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Manage workspace identity, team collaborators, and recruiting evaluation permissions.
        </p>
      </div>

      {/* Workspace Identity */}
      <div className="rounded-lg border border-zinc-200 bg-white p-4 space-y-3">
        <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
          Workspace Profile
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Workspace Name
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => onWorkspaceNameChange(e.target.value)}
              className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-700">
              Workspace Identifier (Slug)
            </label>
            <div className="flex items-center">
              <span className="h-9 rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-2.5 text-xs text-zinc-400 flex items-center">
                resumex.ai/
              </span>
              <input
                type="text"
                disabled
                value={workspaceSlug}
                className="h-9 w-full rounded-r-md border border-zinc-200 bg-zinc-100/70 px-3 text-xs text-zinc-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Team Members List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider">
              Active Team Collaborators ({teamMembers.length})
            </h3>
            <p className="text-xs text-zinc-500">
              Assign roles to control candidate pipeline progression and requisition editing rights.
            </p>
          </div>

          {!isAdding && (
            <Button
              size="sm"
              onClick={() => setIsAdding(true)}
              className="gap-1.5 text-xs"
            >
              <Icons.plus className="h-3.5 w-3.5" />
              <span>Invite Member</span>
            </Button>
          )}
        </div>

        {/* Invite Member Quick Form */}
        {isAdding && (
          <form
            onSubmit={handleAddSubmit}
            className="rounded-lg border border-brand-300 bg-brand-50/40 p-4 space-y-3 animate-in fade-in"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-950">
                Invite New Team Member (Local Session)
              </span>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              <input
                type="text"
                placeholder="Full Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="h-8 rounded-md border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Work Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="h-8 rounded-md border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 focus:border-brand-500 focus:outline-none"
              />
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as TeamRole)}
                className="h-8 rounded-md border border-zinc-200 bg-white px-2 text-xs font-medium text-zinc-800"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.id} ({r.accessDescription})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
                className="h-7 text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="h-7 text-xs">
                Send Invitation
              </Button>
            </div>
          </form>
        )}

        {/* Team Table */}
        <div className="rounded-lg border border-zinc-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Member</th>
                  <th className="py-2.5 px-4">Role & Access</th>
                  <th className="py-2.5 px-4">Last Activity</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-zinc-50/50">
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-semibold text-zinc-950 block">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-zinc-400 block">
                          {member.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <select
                            value={member.role}
                            onChange={(e) =>
                              onRoleChange(
                                member.id,
                                e.target.value as TeamRole
                              )
                            }
                            className="h-7 appearance-none rounded-md border border-zinc-200 bg-white pl-2 pr-6 text-xs font-semibold text-zinc-900 cursor-pointer hover:bg-zinc-50 focus:border-brand-500 focus:outline-none"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Recruiter">Recruiter</option>
                            <option value="Reviewer">Reviewer</option>
                          </select>
                          <Icons.chevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-400" />
                        </div>
                        <span className="text-[11px] text-zinc-400">
                          {member.accessLevel}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-zinc-500 whitespace-nowrap">
                      {member.lastActive}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {teamMembers.length > 1 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveMember(member.id)}
                          className="h-7 w-7 p-0 text-zinc-400 hover:text-red-600"
                          title="Remove team member"
                        >
                          <Icons.trash className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <span className="text-[10px] text-zinc-400 italic">
                          Primary
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
