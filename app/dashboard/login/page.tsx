import Link from "next/link";

import { loginAction } from "@/lib/actions/auth";
import { isDemoMode } from "@/lib/repositories/content-repository";

import { Button } from "@/components/ui/button";

interface DashboardLoginPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DashboardLoginPage({
  searchParams,
}: DashboardLoginPageProps) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;

  return (
    <main
      className="bg-brand-shell flex min-h-screen items-center justify-center px-4"
      data-auto-reveal
    >
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
        <p className="font-manrope text-brand-maroon text-xs font-bold tracking-[0.24em] uppercase">
          HMPG CMS
        </p>
        <h1 className="font-epilogue text-brand-ink mt-4 text-4xl font-bold">
          Masuk ke Dashboard
        </h1>
        <p className="font-manrope text-brand-body mt-4 text-base leading-7">
          Gunakan akun admin untuk mengelola konten publik, laporan, dan aset
          visual HMPG ITB.
        </p>

        {error ? (
          <p className="bg-brand-blush font-manrope text-brand-maroon mt-6 rounded-2xl px-4 py-3 text-sm">
            {error}
          </p>
        ) : null}

        {isDemoMode() ? (
          <div className="bg-brand-shell font-manrope text-brand-body mt-6 rounded-3xl p-4 text-sm leading-7">
            <p className="text-brand-ink font-bold">Mode demo aktif</p>
            <p>Email: {process.env.DEMO_ADMIN_EMAIL ?? "admin@hmpg.local"}</p>
            <p>Password: {process.env.DEMO_ADMIN_PASSWORD ?? "hmpg-demo"}</p>
          </div>
        ) : null}

        <form action={loginAction} className="mt-8 space-y-5">
          <label className="block space-y-2">
            <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
              Email
            </span>
            <input
              className="border-brand-stroke/20 font-manrope focus:border-brand-maroon h-12 w-full rounded-2xl border px-4 text-sm outline-none"
              name="email"
              required
              type="email"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-manrope text-brand-body text-xs font-bold tracking-[0.2em] uppercase">
              Password
            </span>
            <input
              className="border-brand-stroke/20 font-manrope focus:border-brand-maroon h-12 w-full rounded-2xl border px-4 text-sm outline-none"
              name="password"
              required
              type="password"
            />
          </label>

          <Button className="mt-4 w-full justify-center" type="submit">
            Login
          </Button>
        </form>

        <Link
          className="font-manrope text-brand-maroon mt-6 inline-block text-sm font-bold tracking-[0.18em] uppercase"
          href="/dashboard/reset-password"
        >
          Reset Password
        </Link>
      </div>
    </main>
  );
}
