import * as React from "react";
import { ExternalProfileItem } from "@/types/profile";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";

interface CodingProfilesCardProps {
  profiles: ExternalProfileItem[];
}

export function CodingProfilesCard({ profiles }: CodingProfilesCardProps) {
  return (
    <Card className="border-zinc-200 bg-white shadow-xs">
      <CardHeader className="p-5 pb-3 border-b border-zinc-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-zinc-900">
              Competitive & Algorithmic Coding Platforms
            </CardTitle>
            <p className="text-xs text-zinc-500 mt-0.5">
              Competitive-platform data is not provided by the developer-intelligence endpoint.
            </p>
          </div>
          <Badge variant="neutral" className="text-[10px] font-mono">
            BENCHMARK VERIFICATION
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        {profiles.length === 0 ? (
          <p className="text-xs text-zinc-500">Not provided by the developer-intelligence source.</p>
        ) : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profiles.map((p) => {
            const isConnected = p.status === "connected" || p.status === "linked";

            return (
              <div
                key={p.platform}
                className="rounded-md border border-zinc-200 bg-zinc-50/50 p-3.5 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-zinc-900">
                      {p.platform}
                    </span>
                    <Badge
                      variant={
                        p.status === "connected"
                          ? "success"
                          : p.status === "linked"
                          ? "brand"
                          : "outline"
                      }
                      className="text-[10px] font-mono px-1.5 py-0"
                    >
                      {p.status === "connected"
                        ? "Verified Link"
                        : p.status === "linked"
                        ? "Profile Linked"
                        : "Not Linked"}
                    </Badge>
                  </div>

                  {isConnected ? (
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-zinc-500">Handle</span>
                        <span className="font-semibold text-zinc-800">@{p.handle}</span>
                      </div>

                      {p.details?.rating && (
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-zinc-500">Platform Rating</span>
                          <span className="font-semibold text-brand-800">
                            {p.details.rating}
                          </span>
                        </div>
                      )}

                      {p.details?.rank && (
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-zinc-500">Global Standing</span>
                          <span className="text-zinc-700 font-medium">
                            {p.details.rank}
                          </span>
                        </div>
                      )}

                      {p.details?.solvedCount && (
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-zinc-500">Problems Solved</span>
                          <span className="text-zinc-700 font-medium">
                            {p.details.solvedCount}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-400 italic">
                      No external handle linked for this platform benchmark.
                    </p>
                  )}
                </div>

                {isConnected && (
                  <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400 font-mono">
                      {p.details?.lastActive || "Verified"}
                    </span>
                    <a
                      href={p.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:text-brand-900 font-semibold font-mono flex items-center gap-1"
                    >
                      Profile
                      <Icons.arrowRight className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>}
      </CardContent>
    </Card>
  );
}
