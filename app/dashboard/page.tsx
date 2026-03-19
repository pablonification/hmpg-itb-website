import { AdminShell } from "@/components/dashboard/admin-shell";
import { requireAdminSession } from "@/lib/auth/session";
import { getStore, isDemoMode } from "@/lib/repositories/content-repository";

export default async function DashboardPage() {
  const session = await requireAdminSession();
  const store = await getStore();

  return (
    <AdminShell pathname="/dashboard" session={session}>
      <section className="bg-brand-wine relative overflow-hidden rounded-[2.5rem] p-8 shadow-[0_20px_40px_rgba(93,28,30,0.15)] md:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[url('/assets/figma/canvas-texture.png')] bg-cover bg-center opacity-[0.15] mix-blend-overlay"></div>
        <div className="bg-brand-maroon pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-60 blur-[100px]"></div>
        <div className="bg-brand-ink pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-40 blur-[120px]"></div>

        <div className="relative z-10">
          <div className="border-brand-muted/30 inline-flex items-center gap-2 rounded-full border bg-white/5 px-3 py-1.5 backdrop-blur-md">
            <span className="bg-brand-gold block h-2 w-2 rounded-full shadow-[0_0_8px_rgba(253,224,137,0.8)]"></span>
            <p className="font-manrope text-brand-cream text-[10px] font-bold tracking-[0.2em] uppercase">
              System Overview
            </p>
          </div>
          <h1 className="font-epilogue text-brand-cream mt-6 text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
            Dashboard
          </h1>
          <p className="font-manrope text-brand-cream/80 mt-6 max-w-2xl text-base leading-relaxed font-medium md:text-lg">
            {isDemoMode()
              ? "Mode demo aktif. Semua perubahan tersimpan pada adapter in-memory lokal untuk memudahkan pengembangan dan QA."
              : "Supabase aktif. Semua perubahan akan tersimpan ke database, auth, dan storage proyek Anda."}
          </p>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Published Reports",
            value: store.reports.filter((item) => item.status === "published")
              .length,
            delay: "0ms",
          },
          {
            label: "Draft Reports",
            value: store.reports.filter((item) => item.status === "draft")
              .length,
            delay: "100ms",
          },
          {
            label: "Activity Highlights",
            value: store.activities.length,
            delay: "200ms",
          },
          {
            label: "Social Channels",
            value: store.settings.socialLinks.length,
            delay: "300ms",
          },
        ].map((item) => (
          <article
            className="group border-brand-sand relative overflow-hidden rounded-[2.5rem] border bg-white/80 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
            key={item.label}
            style={{ animationDelay: item.delay }}
          >
            <div className="bg-brand-sand/40 group-hover:bg-brand-maroon/10 absolute -top-8 -right-8 h-32 w-32 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"></div>
            <div className="bg-brand-cream/60 group-hover:bg-brand-gold/20 absolute -bottom-8 -left-8 h-24 w-24 rounded-full blur-2xl transition-all duration-700 group-hover:scale-150"></div>

            <p className="font-manrope text-brand-body relative z-10 text-[11px] font-bold tracking-[0.2em] uppercase">
              {item.label}
            </p>
            <div className="relative z-10 mt-8 flex items-baseline gap-2">
              <p className="font-epilogue text-brand-ink group-hover:text-brand-maroon text-6xl font-bold tracking-tighter transition-colors duration-300">
                {item.value}
              </p>
            </div>

            <div className="absolute right-6 bottom-6 translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
              <div className="bg-brand-surface border-brand-sand flex h-10 w-10 items-center justify-center rounded-full border">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 11L11 1M11 1H3.5M11 1V8.5"
                    stroke="#831618"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
