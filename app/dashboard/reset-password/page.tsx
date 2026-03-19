import Link from "next/link";

import { resetPasswordAction } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";

interface ResetPasswordPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : null;
  const message = typeof params.message === "string" ? params.message : null;

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
          Reset Password
        </h1>

        {message ? (
          <p className="bg-brand-shell font-manrope text-brand-body mt-6 rounded-2xl px-4 py-3 text-sm">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="bg-brand-blush font-manrope text-brand-maroon mt-6 rounded-2xl px-4 py-3 text-sm">
            {error}
          </p>
        ) : null}

        <form action={resetPasswordAction} className="mt-8 space-y-5">
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
          <Button className="w-full justify-center" type="submit">
            Kirim Reset Link
          </Button>
        </form>

        <Link
          className="font-manrope text-brand-maroon mt-6 inline-block text-sm font-bold tracking-[0.18em] uppercase"
          href="/dashboard/login"
        >
          Kembali ke Login
        </Link>
      </div>
    </main>
  );
}
