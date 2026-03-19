import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/site/rich-text";
import { requireReportsSession } from "@/lib/auth/session";
import {
  getDashboardReportBySlug,
  getRelatedReports,
} from "@/lib/repositories/content-repository";
import { formatDisplayDate, getReportPreviewImage } from "@/lib/utils";

interface DashboardReportPreviewPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DashboardReportPreviewPage({
  params,
}: DashboardReportPreviewPageProps) {
  await requireReportsSession();
  const { slug } = await params;
  const report = await getDashboardReportBySlug(slug);

  if (!report) {
    notFound();
  }

  const relatedReports =
    report.status === "published" ? await getRelatedReports(slug) : [];

  return (
    <div className="editorial-shell bg-brand-surface min-h-screen">
      <div className="border-brand-sand/70 sticky top-0 z-30 border-b bg-[rgba(255,248,240,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-8">
          <div>
            <p className="text-brand-maroon text-xs font-extrabold tracking-[0.22em] uppercase">
              Dashboard Preview
            </p>
            <h1 className="font-epilogue text-brand-ink mt-2 text-2xl font-bold">
              {report.title}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="border-brand-sand/80 rounded-xl border bg-white px-4 py-2 text-sm font-semibold"
              href={`/dashboard/reports?report=${report.slug}`}
            >
              Kembali ke editor
            </Link>
            {report.status === "published" ? (
              <Link
                className="bg-brand-maroon rounded-xl px-4 py-2 text-sm font-semibold text-white"
                href={`/reports/${report.slug}`}
                target="_blank"
              >
                Buka versi publik
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <main className="pb-24">
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
          <div className="max-w-5xl space-y-6">
            <span className="bg-brand-blush text-brand-maroon inline-flex rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] uppercase">
              {report.categoryLabel}
            </span>
            <h2 className="font-epilogue text-brand-ink text-4xl leading-tight font-bold md:text-6xl">
              {report.title}
            </h2>
            <div className="border-brand-muted/30 flex flex-wrap gap-8 border-t pt-6">
              <div>
                <p className="text-brand-body text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  Status
                </p>
                <p className="text-brand-ink mt-2 font-semibold">
                  {report.status}
                </p>
              </div>
              <div>
                <p className="text-brand-body text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  Tanggal
                </p>
                <p className="text-brand-ink mt-2 font-semibold">
                  {formatDisplayDate(report.publishedAt) ||
                    "Belum dipublikasikan"}
                </p>
              </div>
              <div>
                <p className="text-brand-body text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  Penulis
                </p>
                <p className="text-brand-ink mt-2 font-semibold">
                  {report.author || "HMPG ITB"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20 md:px-8">
          <RichText html={report.bodyHtml} />
        </section>

        {relatedReports.length > 0 ? (
          <section className="bg-brand-shell py-20">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
              <h2 className="font-epilogue text-brand-ink text-3xl font-bold">
                Related reports
              </h2>
              <div className="mt-10 grid gap-8 md:grid-cols-3">
                {relatedReports.map((related) => (
                  <article key={related.id}>
                    <Link
                      className="block space-y-4"
                      href={`/reports/${related.slug}`}
                    >
                      {getReportPreviewImage(related) ? (
                        <img
                          alt={related.title}
                          className="h-56 w-full rounded-[1.5rem] object-cover"
                          src={getReportPreviewImage(related)}
                        />
                      ) : (
                        <div className="from-brand-shell to-brand-blush h-56 w-full rounded-[1.5rem] bg-gradient-to-br" />
                      )}
                      <p className="text-brand-maroon text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                        {related.categoryLabel}
                      </p>
                      <h3 className="font-epilogue text-brand-ink text-xl font-bold">
                        {related.title}
                      </h3>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {report.status === "draft" ? (
          <section className="mx-auto max-w-7xl px-4 pt-10 md:px-8">
            <div className="border-brand-sand/70 text-brand-body rounded-[1.6rem] border bg-white px-5 py-4 text-sm leading-7">
              Draft preview ini hanya bisa diakses dari dashboard. Route publik
              tidak akan menampilkan laporan berstatus draft.
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
