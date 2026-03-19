import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/site/rich-text";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  getRelatedReports,
  getReportBySlug,
  getStore,
} from "@/lib/repositories/content-repository";
import { formatDisplayDate } from "@/lib/utils";

interface ReportDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReportDetailPage({
  params,
}: ReportDetailPageProps) {
  const { slug } = await params;
  const store = await getStore();
  const report = await getReportBySlug(slug);

  if (!report) {
    notFound();
  }

  const relatedReports = await getRelatedReports(slug);

  return (
    <div className="editorial-shell min-h-screen">
      <SiteHeader settings={store.settings} />

      <main className="bg-brand-surface" data-auto-reveal>
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="max-w-5xl space-y-6">
            <p className="font-manrope text-brand-body text-sm">
              Home &gt; Reports &gt; Detail
            </p>
            <span className="bg-brand-blush text-brand-maroon inline-flex px-3 py-1 text-[0.65rem] font-bold tracking-[0.18em] uppercase">
              {report.categoryLabel}
            </span>
            <h1
              className="font-epilogue text-brand-ink max-w-4xl text-5xl leading-tight font-bold md:text-6xl"
              data-reveal="hero"
            >
              {report.title}
            </h1>
            <div className="border-brand-muted/30 flex flex-wrap gap-10 border-t pt-8">
              <div>
                <p className="font-manrope text-brand-body text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  Tanggal Terbit
                </p>
                <p className="font-manrope text-brand-ink mt-2 text-base font-bold">
                  {formatDisplayDate(report.publishedAt)}
                </p>
              </div>
              <div>
                <p className="font-manrope text-brand-body text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  Penulis
                </p>
                <p className="font-manrope text-brand-ink mt-2 text-base font-bold">
                  {report.author}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-14 md:px-8">
          <img
            alt={report.title}
            className="h-[34rem] w-full object-cover"
            src={report.coverImageSrc}
          />
          {report.coverCaption ? (
            <p className="font-manrope text-brand-body mt-4 text-center text-sm">
              {report.coverCaption}
            </p>
          ) : null}
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-24 md:px-8">
          <RichText html={report.bodyHtml} />
        </section>

        <section className="bg-brand-shell py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 className="font-epilogue text-brand-ink text-3xl font-bold">
              Laporan Terkait
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {relatedReports.map((related) => (
                <article data-reveal="card" key={related.id}>
                  <Link
                    className="block space-y-4"
                    data-reveal-ignore
                    href={`/reports/${related.slug}`}
                  >
                    <img
                      alt={related.title}
                      className="h-56 w-full object-cover"
                      src={related.coverImageSrc}
                    />
                    <p className="font-manrope text-brand-maroon text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                      {related.categoryLabel}
                    </p>
                    <h3 className="font-epilogue text-brand-ink text-xl leading-tight font-bold">
                      {related.title}
                    </h3>
                    <p className="font-manrope text-brand-body text-sm">
                      {formatDisplayDate(related.publishedAt)}
                    </p>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={store.settings} />
    </div>
  );
}
