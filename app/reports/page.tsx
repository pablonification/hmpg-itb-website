import type { ReactNode } from "react";

import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import type { ReportRecord, ReportStatus } from "@/lib/data/types";
import {
  filterReports,
  getStore,
  resolveFeaturedReport,
} from "@/lib/repositories/content-repository";
import { buildPageMetadata } from "@/lib/seo";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { formatDisplayDate, getReportPreviewImage } from "@/lib/utils";

interface ReportsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const REPORTS_PER_PAGE = 6;

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore();
  const reportsPage = store.pages.reports;

  return buildPageMetadata({
    title: "Reports",
    description:
      reportsPage.heroDescription ||
      "Arsip laporan, dokumentasi, dan publikasi HMPG ITB.",
    path: "/reports",
    image: reportsPage.heroImageSrc,
    keywords: [
      "laporan HMPG ITB",
      "arsip HMPG ITB",
      "publikasi HMPG ITB",
      "kegiatan HMPG ITB",
    ],
  });
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const store = await getStore();
  const reportsPage = store.pages.reports;
  const hasHeroDescription = Boolean(reportsPage.heroDescription.trim());
  const query = typeof params.query === "string" ? params.query : "";
  const year = typeof params.year === "string" ? params.year : "all";
  const category =
    typeof params.category === "string" ? params.category : "all";
  const status = normalizeStatus(params.status);
  const requestedPage =
    typeof params.page === "string" ? Number.parseInt(params.page, 10) : 1;

  const publishedReports = store.reports.filter(
    (report) => report.status === "published",
  );
  const filteredReports = filterReports(publishedReports, {
    ...(query ? { query } : {}),
    year,
    category,
    status,
  });

  const years = [
    ...new Set(publishedReports.map((report) => report.year)),
  ].sort(
    (left, right) => Number.parseInt(right, 10) - Number.parseInt(left, 10),
  );
  const categories = Array.from(
    new Map(
      publishedReports.map((report) => [report.category, report.categoryLabel]),
    ),
    ([value, label]) => ({ value, label }),
  );

  const featuredReport =
    resolveFeaturedReport(publishedReports) ?? filteredReports[0];
  const latestReports = filteredReports.filter(
    (report) => report.slug !== featuredReport?.slug,
  );
  const totalPages = Math.max(
    1,
    Math.ceil(latestReports.length / REPORTS_PER_PAGE),
  );
  const currentPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), totalPages)
    : 1;
  const paginatedReports = latestReports.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE,
  );
  const displayCountStart =
    latestReports.length === 0 ? 0 : (currentPage - 1) * REPORTS_PER_PAGE + 1;
  const displayCountEnd =
    latestReports.length === 0
      ? 0
      : Math.min(currentPage * REPORTS_PER_PAGE, latestReports.length);

  return (
    <div className="bg-brand-surface min-h-screen">
      <SiteHeader settings={store.settings} />

      <main data-auto-reveal>
        <section
          className="bg-brand-maroon-dark relative h-[36rem] scroll-mt-24 overflow-hidden"
          id="reports-hero"
        >
          <img
            alt={reportsPage.heroTitle}
            className="absolute inset-0 h-full w-full object-cover"
            src={reportsPage.heroImageSrc}
          />
          <div className="bg-brand-maroon-dark/70 absolute inset-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_42%)] opacity-50" />

          <div className="relative mx-auto flex h-full w-full max-w-[1280px] items-center px-6 pt-8 sm:px-8 lg:px-12">
            <div className="max-w-[42rem] text-white">
              <h1
                className="font-epilogue text-[3.25rem] leading-[0.95] font-extrabold tracking-[-0.04em] sm:text-[4.3rem] lg:text-[4.5rem]"
                data-reveal="hero"
              >
                {reportsPage.heroTitle.split(" & ").map((part, index) => (
                  <span className="block" key={`${part}-${index}`}>
                    {index === 1 ? `& ${part}` : part}
                  </span>
                ))}
              </h1>

              {hasHeroDescription ? (
                <p className="font-manrope mt-7 max-w-[38rem] text-lg leading-[1.65] text-white/90 lg:text-xl">
                  {reportsPage.heroDescription}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className="bg-brand-sand pb-20">
          <div className="mx-auto max-w-[1232px] px-4 sm:px-6 lg:px-8">
            <div
              className="bg-brand-sand relative z-20 -mt-10 flex flex-col items-stretch gap-4 border border-[rgba(140,113,110,0.08)] p-4 shadow-[0_10px_30px_rgba(31,27,16,0.16)] sm:-mt-12 md:flex-row md:items-center md:gap-8 md:p-6 lg:-mt-14"
              data-reveal="card"
              id="drive-akademik"
            >
              <div className="flex items-center gap-4" data-reveal-ignore>
                <div className="bg-brand-surface flex h-16 w-16 shrink-0 items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-6 w-[1.9rem] object-contain"
                    src="/assets/figma/reports-drive-icon.svg"
                  />
                </div>

                <p className="font-epilogue text-[18px] leading-tight font-bold tracking-[-0.03em] text-[#1f1b10] md:text-[24px]">
                  {reportsPage.driveTitle}
                </p>
              </div>

              <a
                className="font-manrope inline-flex shrink-0 items-center justify-center gap-2 bg-[#1f1b10] px-6 py-4 text-xs font-bold tracking-[0.1em] text-white uppercase transition duration-300 hover:bg-[#2f2818] md:ml-auto"
                data-reveal-ignore
                href={store.settings.driveAkademikUrl}
                rel="noreferrer"
                target="_blank"
              >
                <span className="text-white">{reportsPage.driveCtaLabel}</span>
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-[9px] w-[9px] object-contain"
                  src="/assets/figma/reports-drive-arrow.svg"
                />
              </a>
            </div>

            <form
              className="border-brand-muted/10 bg-brand-surface mt-10 flex scroll-mt-20 flex-col gap-4 border p-[25px] md:flex-row md:items-center"
              id="reports-overview"
            >
              <div className="relative flex-1">
                <img
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-4 h-[18px] w-[18px] -translate-y-1/2 object-contain"
                  src="/assets/figma/reports-search-icon.svg"
                />
                <input
                  className="border-brand-muted font-manrope text-brand-ink h-[49px] w-full border-b-2 bg-white pr-4 pl-12 text-sm outline-none placeholder:text-slate-500"
                  defaultValue={query}
                  name="query"
                  placeholder="Cari laporan terbaru..."
                  type="search"
                />
              </div>

              <FilterSelect defaultValue={year} name="year">
                <option value="all">Tahun</option>
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect defaultValue={category} name="category">
                <option value="all">Kategori</option>
                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </FilterSelect>

              <FilterSelect defaultValue={status} name="status">
                <option value="all">Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </FilterSelect>
            </form>

            {featuredReport ? (
              <div className="mt-10" data-reveal="card">
                <Link
                  className="group bg-brand-shell block cursor-pointer overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow] duration-300 hover:bg-[#f0e4d1] hover:shadow-[0_18px_36px_rgba(31,27,16,0.08)]"
                  data-reveal-ignore
                  href={`/reports/${featuredReport.slug}`}
                >
                  <section className="grid overflow-hidden lg:min-h-[40rem] lg:grid-cols-[1.35fr_minmax(22rem,1fr)]">
                    <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[40rem]">
                      <span className="bg-brand-maroon font-manrope absolute top-6 left-6 z-10 px-4 py-1 text-[10px] font-bold tracking-[0.1em] text-white uppercase">
                        Featured
                      </span>
                      {getReportPreviewImage(featuredReport) ? (
                        <img
                          alt={featuredReport.title}
                          className="h-full w-full object-cover object-center"
                          src={getReportPreviewImage(featuredReport)}
                        />
                      ) : (
                        <div className="from-brand-shell to-brand-blush h-full w-full bg-gradient-to-br" />
                      )}
                      <div className="absolute inset-0 bg-[#712224]/0 transition duration-300 group-hover:bg-[#712224]/8" />
                    </div>

                    <div className="flex flex-col p-8 transition-colors duration-300 md:p-10 lg:p-12">
                      <p className="font-manrope text-brand-maroon text-xs font-bold tracking-[0.05em] uppercase">
                        {featuredReport.categoryLabel}
                      </p>
                      <h2 className="font-epilogue text-brand-ink group-hover:text-brand-maroon mt-4 text-[2rem] leading-[1.25] font-bold tracking-[-0.03em] transition-colors duration-300">
                        {featuredReport.title}
                      </h2>
                      <p className="font-manrope text-brand-body mt-6 text-base leading-[1.65]">
                        {featuredReport.excerpt}
                      </p>

                      <div className="font-manrope text-brand-maroon mt-auto inline-flex items-center gap-3 pt-14 text-xs font-bold tracking-[0.05em] uppercase transition duration-300 group-hover:gap-4">
                        Baca Selengkapnya
                        <img
                          alt=""
                          aria-hidden="true"
                          className="h-3 w-4 object-contain"
                          src="/assets/figma/reports-featured-arrow.svg"
                        />
                      </div>
                    </div>
                  </section>
                </Link>
              </div>
            ) : null}

            <section className="mt-16">
              <div className="border-brand-muted/30 flex items-end justify-between gap-4 border-b pb-4">
                <h2 className="font-epilogue text-brand-ink text-2xl font-bold tracking-[-0.03em]">
                  {reportsPage.latestSectionTitle}
                </h2>
                <p className="font-manrope text-brand-stroke hidden text-[10px] font-bold tracking-[0.1em] uppercase sm:block">
                  Menampilkan {displayCountStart}-{displayCountEnd} dari{" "}
                  {latestReports.length} dokumen
                </p>
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
                {paginatedReports.map((report) => (
                  <ReportGridCard key={report.id} report={report} />
                ))}
              </div>

              <PaginationNav
                category={category}
                currentPage={currentPage}
                query={query}
                status={status}
                totalPages={totalPages}
                year={year}
              />
            </section>
          </div>
        </section>
      </main>

      <SiteFooter settings={store.settings} />
    </div>
  );
}

function FilterSelect({
  children,
  defaultValue,
  name,
}: {
  children: ReactNode;
  defaultValue: string;
  name: string;
}) {
  return (
    <div className="relative w-full shrink-0 md:w-auto">
      <select
        className="border-brand-muted/30 bg-brand-sand text-brand-ink font-manrope h-[35px] w-full appearance-none border px-[17px] pr-8 text-[10px] font-bold tracking-[0.05em] uppercase outline-none"
        defaultValue={defaultValue}
        name={name}
      >
        {children}
      </select>
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 h-[4px] w-[7px] -translate-y-1/2 object-contain"
        src="/assets/figma/reports-filter-chevron.svg"
      />
    </div>
  );
}

function ReportGridCard({ report }: { report: ReportRecord }) {
  const previewImage = getReportPreviewImage(report);
  const periodLabel =
    report.periodLabel || formatDisplayDate(report.publishedAt);

  return (
    <article className="group" data-reveal="card">
      <Link
        className="block transition duration-300 group-hover:-translate-y-1"
        data-reveal-ignore
        href={`/reports/${report.slug}`}
      >
        <div className="bg-brand-surface overflow-hidden">
          {previewImage ? (
            <img
              alt={report.title}
              className="h-[27rem] w-full object-cover"
              src={previewImage}
            />
          ) : (
            <div className="from-brand-shell to-brand-blush h-[27rem] w-full bg-gradient-to-br" />
          )}
        </div>

        <div className="space-y-3 pt-6">
          <div className="flex items-start gap-3 text-[9px] font-bold tracking-[0.1em] uppercase">
            <span className="bg-brand-blush text-brand-maroon font-manrope px-2 py-1">
              {report.categoryLabel}
            </span>
            <span className="text-brand-stroke font-manrope pt-1">
              {periodLabel || "Belum terbit"}
            </span>
          </div>

          <h3 className="font-epilogue text-brand-ink group-hover:text-brand-maroon text-[18px] leading-[1.25] font-bold transition duration-300">
            {report.title}
          </h3>

          <p className="font-manrope text-brand-body text-sm leading-5">
            {report.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
}

function PaginationNav({
  currentPage,
  totalPages,
  query,
  year,
  category,
  status,
}: {
  currentPage: number;
  totalPages: number;
  query: string;
  year: string;
  category: string;
  status: string;
}) {
  const pageItems = buildPaginationItems(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 pt-12"
    >
      <PaginationArrow
        category={category}
        currentPage={currentPage}
        direction="prev"
        query={query}
        status={status}
        totalPages={totalPages}
        year={year}
      />

      {pageItems.map((item, index) =>
        item === "ellipsis" ? (
          <span
            className="font-manrope text-brand-ink flex h-10 w-10 items-center justify-center text-xs font-bold"
            key={`ellipsis-${index}`}
          >
            ...
          </span>
        ) : (
          <Link
            className={[
              "font-manrope flex h-10 w-10 items-center justify-center border text-xs font-bold transition duration-300",
              item === currentPage
                ? "border-brand-maroon bg-brand-maroon !text-white"
                : "border-brand-muted/30 hover:border-brand-maroon hover:text-brand-maroon text-[#1f1b10]",
            ].join(" ")}
            href={
              buildPageHref({
                page: item,
                query,
                year,
                category,
                status,
              }) as Route
            }
            key={item}
          >
            {item}
          </Link>
        ),
      )}

      <PaginationArrow
        category={category}
        currentPage={currentPage}
        direction="next"
        query={query}
        status={status}
        totalPages={totalPages}
        year={year}
      />
    </nav>
  );
}

function PaginationArrow({
  currentPage,
  totalPages,
  direction,
  query,
  year,
  category,
  status,
}: {
  currentPage: number;
  totalPages: number;
  direction: "prev" | "next";
  query: string;
  year: string;
  category: string;
  status: string;
}) {
  const disabled =
    totalPages <= 1 ||
    (direction === "prev" ? currentPage <= 1 : currentPage >= totalPages);
  const targetPage = direction === "prev" ? currentPage - 1 : currentPage + 1;

  if (disabled) {
    return (
      <span className="border-brand-muted/30 flex h-10 w-10 items-center justify-center border text-[#1f1b10] opacity-50">
        <img
          alt=""
          aria-hidden="true"
          className="h-[9px] w-[6px] object-contain"
          src={
            direction === "prev"
              ? "/assets/figma/reports-pagination-prev.svg"
              : "/assets/figma/reports-pagination-next.svg"
          }
        />
      </span>
    );
  }

  return (
    <Link
      className="border-brand-muted/30 hover:border-brand-maroon flex h-10 w-10 items-center justify-center border text-[#1f1b10] transition duration-300"
      href={
        buildPageHref({
          page: targetPage,
          query,
          year,
          category,
          status,
        }) as Route
      }
    >
      <img
        alt=""
        aria-hidden="true"
        className="h-[9px] w-[6px] object-contain"
        src={
          direction === "prev"
            ? "/assets/figma/reports-pagination-prev.svg"
            : "/assets/figma/reports-pagination-next.svg"
        }
      />
    </Link>
  );
}

function buildPageHref({
  page,
  query,
  year,
  category,
  status,
}: {
  page: number;
  query: string;
  year: string;
  category: string;
  status: string;
}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("query", query);
  }

  if (year !== "all") {
    params.set("year", year);
  }

  if (category !== "all") {
    params.set("category", category);
  }

  if (status !== "all") {
    params.set("status", status);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const nextQuery = params.toString();
  return nextQuery ? `/reports?${nextQuery}` : "/reports";
}

function normalizeStatus(
  value: string | string[] | undefined,
): ReportStatus | "all" {
  if (value === "draft" || value === "published") {
    return value;
  }

  return "all";
}

function buildPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ] as const;
}
