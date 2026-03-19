"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { AdminSession } from "@/lib/auth/session";
import {
  canManageAssets,
  canManageSiteContent,
  canManageUsers,
} from "@/lib/auth/rbac";

import { SignOutButton } from "@/components/dashboard/sign-out-button";

const dashboardLinks = [
  { href: "/dashboard", label: "Overview", adminOnly: true },
  { href: "/dashboard/reports", label: "Reports", adminOnly: false },
  { href: "/dashboard/content", label: "Content", adminOnly: true },
  { href: "/dashboard/assets", label: "Assets", adminOnly: true },
  { href: "/dashboard/users", label: "Users", adminOnly: true },
] satisfies { href: string; label: string; adminOnly: boolean }[];

export function AdminShell({
  session,
  pathname,
  children,
}: {
  session: AdminSession;
  pathname: string;
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const visibleLinks = dashboardLinks.filter((link) => {
    if (!link.adminOnly) {
      return true;
    }

    if (link.href === "/dashboard/content") {
      return canManageSiteContent(session.role);
    }

    if (link.href === "/dashboard/assets") {
      return canManageAssets(session.role);
    }

    if (link.href === "/dashboard/users") {
      return canManageUsers(session.role);
    }

    return session.role === "admin";
  });

  const userBadge = (
    <div className="mb-6 rounded-2xl border border-white/40 bg-white/60 p-4 shadow-sm">
      <p className="font-manrope text-brand-body truncate text-xs font-medium">
        {session.email}
      </p>
      <div className="bg-brand-sand/50 mt-2 inline-flex items-center rounded-full px-2.5 py-1">
        <span className="bg-brand-maroon mr-1.5 block h-1.5 w-1.5 rounded-full" />
        <p className="font-manrope text-brand-maroon text-[10px] font-bold tracking-[0.15em] uppercase">
          {session.role}
        </p>
      </div>
    </div>
  );

  const navLinks = (
    <nav className="custom-scrollbar -mx-2 flex-1 space-y-1.5 overflow-y-auto px-2 pt-2 pr-4 pb-4">
      {visibleLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (link.href !== "/dashboard" && pathname.startsWith(link.href));
        return (
          <Link
            className={`font-manrope group flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
              isActive
                ? "bg-brand-maroon shadow-brand-maroon/20 scale-[1.02] !text-white shadow-lg"
                : "text-brand-body hover:text-brand-ink hover:scale-[1.01] hover:bg-white/80"
            }`}
            href={link.href as Route}
            key={link.href}
            onClick={() => setMobileMenuOpen(false)}
            style={isActive ? { color: "white" } : undefined}
          >
            <span className="relative z-10">{link.label}</span>
            {isActive && (
              <span className="bg-brand-gold block h-1.5 w-1.5 rounded-full shadow-[0_0_8px_rgba(253,224,137,0.8)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  const signOutSection = (
    <div className="mt-auto pt-6">
      <SignOutButton />
    </div>
  );

  // Desktop sidebar content (includes logo/branding)
  const desktopNavContent = (
    <>
      <div className="mb-8 flex items-center gap-4 px-2">
        <Image
          src="/assets/figma/about-logo-identity.png"
          alt="HMPG ITB logo"
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 object-contain"
          priority
        />
        <div className="min-w-0 flex-1">
          <p className="font-epilogue text-brand-ink truncate text-lg leading-tight font-bold">
            HMPG ITB
          </p>
          <p className="font-manrope text-brand-maroon truncate text-[11px] font-bold tracking-[0.2em] uppercase">
            CMS Portal
          </p>
        </div>
      </div>
      {userBadge}
      {navLinks}
      {signOutSection}
    </>
  );

  // Mobile drawer content (no logo/branding - already in header)
  const mobileNavContent = (
    <>
      {userBadge}
      {navLinks}
      {signOutSection}
    </>
  );

  return (
    <div className="bg-brand-surface editorial-shell font-manrope selection:bg-brand-maroon/20 selection:text-brand-ink min-h-screen">
      {/* Mobile header */}
      <header className="bg-brand-cream/95 border-brand-sand fixed top-0 right-0 left-0 z-50 border-b shadow-sm backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src="/assets/figma/about-logo-identity.png"
              alt="HMPG ITB logo"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-contain"
              priority
            />
            <div className="min-w-0">
              <p className="font-epilogue text-brand-ink text-sm leading-tight font-bold">
                HMPG ITB
              </p>
              <p className="font-manrope text-brand-maroon text-[9px] font-bold tracking-[0.15em] uppercase">
                CMS Portal
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl border border-white/40 bg-white/60 p-2 transition-colors hover:bg-white"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="text-brand-ink h-5 w-5"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <aside
        className={`bg-brand-cream/95 border-brand-sand fixed top-[60px] bottom-0 left-0 z-40 w-[280px] transform border-r backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="custom-scrollbar flex h-full flex-col overflow-y-auto p-6">
          {mobileNavContent}
        </div>
      </aside>

      <div className="mx-auto flex min-h-screen max-w-[90rem] gap-6 px-4 py-6 pt-[72px] md:px-8 md:py-8 md:pt-[72px] lg:pt-6">
        {/* Desktop sidebar */}
        <aside className="border-brand-sand bg-brand-cream/80 sticky top-8 hidden h-[calc(100vh-4rem)] w-[280px] flex-col rounded-[2.5rem] border p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl lg:flex">
          {desktopNavContent}
        </aside>

        <main className="max-w-full min-w-0 flex-1 space-y-8">{children}</main>
      </div>
    </div>
  );
}
