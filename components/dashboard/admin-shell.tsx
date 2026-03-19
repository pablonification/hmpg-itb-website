import type { Route } from "next";
import Link from "next/link";

import type { AdminSession } from "@/lib/auth/session";

import { SignOutButton } from "@/components/dashboard/sign-out-button";

const adminLinks = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/reports", label: "Reports" },
  { href: "/dashboard/content", label: "Content" },
  { href: "/dashboard/assets", label: "Assets" },
] satisfies { href: Route; label: string }[];

export function AdminShell({
  session,
  pathname,
  children,
}: {
  session: AdminSession;
  pathname: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-brand-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-8 px-4 py-8 md:px-8">
        <aside className="bg-brand-wine text-brand-cream hidden w-64 rounded-3xl p-6 lg:block">
          <p className="font-epilogue text-2xl font-bold">HMPG CMS</p>
          <p className="font-manrope text-brand-muted mt-2 text-sm">
            {session.email}
          </p>
          <nav className="mt-10 space-y-3">
            {adminLinks.map((link) => (
              <Link
                className={`font-manrope block rounded-2xl px-4 py-3 text-sm font-semibold ${
                  pathname === link.href
                    ? "bg-brand-maroon text-white"
                    : "text-brand-muted hover:text-brand-cream hover:bg-white/5"
                }`}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-10">
            <SignOutButton />
          </div>
        </aside>

        <main className="flex-1 space-y-6" data-auto-reveal>
          {children}
        </main>
      </div>
    </div>
  );
}
