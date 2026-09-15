"use client";

import * as React from "react";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-xs">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Icons.logo className="h-6 w-6 transition-transform group-hover:scale-105" />
            <span className="text-base font-semibold tracking-tight text-zinc-900">
              Resume<span className="text-brand-600">X</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
            <a
              href="#capabilities"
              className="transition-colors hover:text-zinc-950"
            >
              Capabilities
            </a>
            <a
              href="#evidence-verification"
              className="transition-colors hover:text-zinc-950"
            >
              Evidence Engine
            </a>
            <a
              href="#developer-intelligence"
              className="transition-colors hover:text-zinc-950"
            >
              Developer Intelligence
            </a>
            <a
              href="#architecture"
              className="transition-colors hover:text-zinc-950"
            >
              Architecture
            </a>
          </nav>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/app">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/app">
            <Button size="sm">
              Enter Workspace
              <Icons.arrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 focus:outline-none focus:ring-2 focus:ring-brand-600 rounded-md"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <Icons.x className="h-5 w-5" />
            ) : (
              <Icons.menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-zinc-200 bg-white px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2.5 text-sm font-medium text-zinc-700">
            <a
              href="#capabilities"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950"
            >
              Capabilities
            </a>
            <a
              href="#evidence-verification"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950"
            >
              Evidence Engine
            </a>
            <a
              href="#developer-intelligence"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950"
            >
              Developer Intelligence
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-zinc-950"
            >
              Architecture
            </a>
          </nav>
          <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
            <Link href="/app" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full justify-center" size="sm">
                Enter Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
