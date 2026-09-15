"use client";

import * as React from "react";
import Link from "next/link";
import { ReportHeaderData } from "@/types/report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

interface ReportHeaderProps {
  header: ReportHeaderData;
}

export function ReportHeader({ header }: ReportHeaderProps) {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-4 pb-6 border-b border-zinc-200">
      {/* Printable Institutional Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-100 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <Icons.logo className="h-4 w-4 shrink-0" />
          <span className="font-semibold text-zinc-900">
            Resume<span className="text-brand-600">X</span> Technical Intelligence
          </span>
          <span>•</span>
          <span>Screening Evaluation Ledger</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Report ID: <strong className="text-zinc-800">{header.reportId}</strong></span>
          <span>•</span>
          <span>Date: {header.reportDate}</span>
        </div>
      </div>

      {/* Main Title & Context Row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-950">
              {header.candidateName}
            </h1>
            <Badge variant="brand" className="text-xs font-mono">
              {header.evaluationStatus}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-600">
            <span className="font-semibold text-zinc-900">{header.targetRole}</span>
            <span>•</span>
            <span className="text-brand-800 font-medium">{header.targetCompany}</span>
            <span>•</span>
            <span className="text-zinc-500">File: {header.documentName}</span>
          </div>
        </div>

        {/* Action Controls (Hidden on Print) */}
        <div className="no-print flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
          <Button
            size="sm"
            onClick={handlePrint}
            className="w-full text-xs justify-center font-medium bg-zinc-900 text-white hover:bg-zinc-800 cursor-pointer shadow-xs"
          >
            <Icons.fileText className="mr-1.5 h-3.5 w-3.5" />
            Print / Export PDF
          </Button>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <Link href="/app/resume">
              <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                Resume
              </Button>
            </Link>
            <Link href="/app/skills">
              <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                Skills
              </Button>
            </Link>
            <Link href="/app/evidence">
              <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                Evidence
              </Button>
            </Link>
            <Link href="/app/matches">
              <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                Alignment
              </Button>
            </Link>
            <Link href="/app/profile">
              <Button size="sm" variant="outline" className="text-[11px] h-7 px-2">
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
