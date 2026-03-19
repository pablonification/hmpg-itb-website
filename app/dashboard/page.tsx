import { AdminShell } from "@/components/dashboard/admin-shell";
import { requireAdminSession } from "@/lib/auth/session";
import { getStore, isDemoMode } from "@/lib/repositories/content-repository";

export default async function DashboardPage() {
  const session = await requireAdminSession();
  const store = await getStore();

  return (
    <AdminShell pathname="/dashboard" session={session}>
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
        <p className="font-manrope text-brand-maroon text-xs font-bold tracking-[0.24em] uppercase">
          Dashboard
        </p>
        <h1 className="font-epilogue text-brand-ink mt-4 text-4xl font-bold">
          Content overview
        </h1>
        <p className="font-manrope text-brand-body mt-4 max-w-3xl text-base leading-7">
          {isDemoMode()
            ? "Mode demo aktif. Semua perubahan tersimpan pada adapter in-memory lokal untuk memudahkan pengembangan dan QA."
            : "Supabase aktif. Semua perubahan akan tersimpan ke database, auth, dan storage proyek Anda."}
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        {[
          {
            label: "Published reports",
            value: store.reports.filter((item) => item.status === "published")
              .length,
          },
          {
            label: "Draft reports",
            value: store.reports.filter((item) => item.status === "draft")
              .length,
          },
          { label: "Activity highlights", value: store.activities.length },
          {
            label: "Social channels",
            value: store.settings.socialLinks.length,
          },
        ].map((item) => (
          <article
            className="rounded-[2rem] bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.04)]"
            data-reveal="card"
            key={item.label}
          >
            <div data-reveal-ignore>
              <p className="font-manrope text-brand-body text-xs font-bold tracking-[0.18em] uppercase">
                {item.label}
              </p>
              <p className="font-epilogue text-brand-maroon mt-4 text-5xl font-bold">
                {item.value}
              </p>
            </div>
          </article>
        ))}
      </section>
    </AdminShell>
  );
}
