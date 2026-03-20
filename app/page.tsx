import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getStore } from "@/lib/repositories/content-repository";
import { buildPageMetadata } from "@/lib/seo";
import { getReportPreviewImage } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore();
  const home = store.pages.home;
  const description =
    home.summaryParagraphs[0] ||
    "Portal resmi HMPG ITB untuk mengenal organisasi, aktivitas, dan laporan terbaru.";

  return buildPageMetadata({
    title: "Himpunan Mahasiswa Teknik Pangan ITB",
    description,
    path: "/",
    image: home.heroImageSrc,
    keywords: [
      "HMPG ITB",
      "Himpunan Mahasiswa Teknik Pangan",
      "Teknik Pangan ITB",
      "kegiatan mahasiswa ITB",
    ],
  });
}

export default async function HomePage() {
  const store = await getStore();
  const home = store.pages.home;
  const latestReports = [...store.reports]
    .filter((report) => report.status === "published")
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() -
        new Date(left.publishedAt).getTime(),
    )
    .slice(0, 3);
  const [featuredReport, secondaryReport, tertiaryReport] = latestReports;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fff8f0]">
      <SiteHeader activeHref={"/" as Route} settings={store.settings} />

      <main data-auto-reveal>
        <section className="relative h-[698px] overflow-hidden bg-[#e2d9c7]">
          <img
            alt={home.heroTitleLine1}
            className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-60"
            src={home.heroImageSrc}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#fff8f0_0%,rgba(255,248,240,0.6)_50%,rgba(255,248,240,0)_100%)]" />

          <div className="relative mx-auto flex h-full max-w-[1280px] items-center px-6 sm:px-8 lg:px-12">
            <div className="w-full max-w-[768px] space-y-4">
              <div className="inline-flex bg-[rgba(255,218,214,0.3)] px-3 py-1">
                <p className="font-manrope text-[15px] font-bold tracking-[0.2em] text-[#831618] uppercase">
                  {home.heroEyebrow}
                </p>
              </div>

              <h1
                className="font-epilogue text-[56px] leading-[0.95] font-extrabold tracking-[-0.03em] text-[#1f1b10] md:text-[72px] md:leading-[72px]"
                data-reveal="hero"
              >
                <span className="block">{home.heroTitleLine1}</span>
                <span className="block text-[#a42f2c]">
                  {home.heroTitleLine2}
                </span>
              </h1>

              <div className="pt-3">
                <Link
                  className="group inline-flex items-center gap-2 rounded-[2px] bg-[#831618] px-10 pt-[16.5px] pb-[17px] text-white transition duration-300 hover:bg-[#712224]"
                  data-reveal-link
                  href="/about-us"
                >
                  <span className="font-manrope text-[14px] font-bold tracking-[0.05em] text-white">
                    {home.heroCtaLabel}
                  </span>
                  <img
                    alt=""
                    aria-hidden="true"
                    className="h-[9.33px] w-[9.33px] object-contain transition duration-300 group-hover:translate-x-0.5"
                    src="/assets/figma/icon-arrow-cream.svg"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#fff8f0] py-12 sm:py-16 lg:h-[400px] lg:py-0">
          <div className="absolute inset-0 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute inset-[-60%_-14%] translate-y-[-12%] scale-[0.8] -rotate-[2.33deg] bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${home.summaryTextureSrc})` }}
            />
            <div className="absolute inset-0 bg-[rgba(113,34,36,0.65)]" />
          </div>

          <div className="relative mx-auto flex max-w-[1280px] justify-center px-6 sm:px-8 lg:px-12 lg:pt-[140px]">
            <div className="max-w-[948px] space-y-6 text-justify">
              {home.summaryParagraphs.map((paragraph) => (
                <p
                  className="font-manrope text-[15px] leading-8 font-bold text-white sm:text-[16px] md:text-[20px]"
                  key={paragraph}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fcf3e0] py-[112px]">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-6 sm:px-8 lg:px-12">
            <div className="flex items-end justify-between gap-8">
              <div className="space-y-2">
                <p className="font-manrope text-[12px] font-bold tracking-[0.1em] text-[#831618] uppercase">
                  {home.reportsSectionEyebrow}
                </p>
                <h2 className="font-epilogue text-[36px] leading-10 font-bold tracking-[-0.025em] text-[#1f1b10]">
                  {home.reportsSectionTitle}
                </h2>
              </div>

              <Link
                className="font-manrope hidden items-center gap-2 border-b border-[rgba(91,91,129,0.3)] pb-[5px] text-[12px] font-bold tracking-[0.1em] text-[#5b5b81] transition duration-300 hover:border-[#831618] hover:text-[#831618] md:inline-flex"
                href="/reports"
              >
                <span className="text-[#5b5b81]">LIHAT SELENGKAPNYA</span>
                <img
                  alt=""
                  aria-hidden="true"
                  className="h-[10.5px] w-[10.5px] object-contain"
                  src="/assets/figma/icon-arrow-muted.svg"
                />
              </Link>
            </div>

            {featuredReport ? (
              <article
                className="group relative overflow-hidden bg-[#712224] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow] duration-300 hover:bg-[#7d2928] hover:shadow-[0_18px_36px_rgba(31,27,16,0.08)]"
                data-reveal="card"
              >
                <Link
                  className="relative grid h-full md:grid-cols-2"
                  data-reveal-ignore
                  href={`/reports/${featuredReport.slug}`}
                >
                  <div className="pointer-events-none absolute inset-0 bg-white/0 transition duration-300 group-hover:bg-white/[0.035]" />
                  <span className="font-manrope absolute top-6 left-6 z-10 bg-[#fcf3e0] px-4 py-1 text-[10px] font-bold tracking-[0.1em] text-[#1f1b10] uppercase">
                    Terbaru
                  </span>

                  <div className="relative z-10 flex flex-col justify-center gap-4 px-8 pt-20 pb-12 md:px-12 md:py-12">
                    <p className="font-manrope text-[10px] font-bold tracking-[0.1em] text-[#fde089] uppercase">
                      {featuredReport.categoryLabel}
                    </p>
                    <h3 className="font-epilogue max-w-[496px] text-[30px] leading-[36px] font-bold text-[#f9f0de] transition duration-300 group-hover:text-white">
                      {featuredReport.title}
                    </h3>
                    <p className="font-manrope max-w-[496px] pt-[6.75px] text-[14px] leading-[22.75px] text-[#dfbfbc]">
                      {featuredReport.excerpt}
                    </p>

                    <div className="pt-8">
                      <span className="font-manrope inline-flex items-center gap-3 text-sm font-bold tracking-[0.08em] text-white uppercase transition-[gap,color] duration-300 group-hover:gap-4 group-hover:text-white">
                        Baca Selengkapnya
                        <img
                          alt=""
                          aria-hidden="true"
                          className="h-3 w-4 object-contain opacity-100"
                          src="/assets/figma/reports-featured-arrow-white.svg"
                        />
                      </span>
                    </div>
                  </div>

                  <div className="relative min-h-[420px] overflow-hidden md:min-h-[592px]">
                    <img
                      alt={featuredReport.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      src={getReportPreviewImage(featuredReport)}
                    />
                    <div className="absolute inset-0 bg-[#712224]/0 transition duration-300 group-hover:bg-[#712224]/8" />
                  </div>
                </Link>
              </article>
            ) : null}

            <div className="grid gap-8 lg:grid-cols-12">
              {secondaryReport ? (
                <article
                  className="group overflow-hidden bg-[#712224] shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow] duration-300 hover:bg-[#7d2928] hover:shadow-[0_18px_36px_rgba(31,27,16,0.08)] lg:col-span-8"
                  data-reveal="card"
                >
                  <Link
                    className="relative block h-full"
                    data-reveal-ignore
                    href={`/reports/${secondaryReport.slug}`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-white/0 transition duration-300 group-hover:bg-white/[0.035]" />
                    <div className="relative h-[437.98px] overflow-hidden">
                      <img
                        alt={secondaryReport.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        src={getReportPreviewImage(secondaryReport)}
                      />
                      <div className="absolute inset-0 bg-[#712224]/0 transition duration-300 group-hover:bg-[#712224]/8" />
                    </div>

                    <div className="relative z-10 space-y-2 px-8 py-12">
                      <p className="font-manrope text-[10px] font-bold tracking-[0.1em] text-[#fcf3e0] uppercase">
                        {secondaryReport.categoryLabel}
                      </p>
                      <h3 className="font-epilogue text-[24px] leading-8 font-bold text-[#f9f0de] transition duration-300 group-hover:text-white">
                        {secondaryReport.title}
                      </h3>
                      <p className="font-manrope text-[14px] leading-5 text-[#dfbfbc]">
                        {secondaryReport.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ) : null}

              {tertiaryReport ? (
                <article
                  className="group overflow-hidden bg-[#712224] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] transition-[background-color,box-shadow] duration-300 hover:bg-[#7d2928] hover:shadow-[0_18px_36px_rgba(31,27,16,0.08)] lg:col-span-4"
                  data-reveal="card"
                >
                  <Link
                    className="relative block h-full"
                    data-reveal-ignore
                    href={`/reports/${tertiaryReport.slug}`}
                  >
                    <div className="pointer-events-none absolute inset-0 bg-white/0 transition duration-300 group-hover:bg-white/[0.035]" />
                    <div className="relative h-[435px] overflow-hidden">
                      <img
                        alt={tertiaryReport.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        src={getReportPreviewImage(tertiaryReport)}
                      />
                      <div className="absolute inset-0 bg-[#712224]/0 transition duration-300 group-hover:bg-[#712224]/8" />
                    </div>

                    <div className="relative z-10 space-y-2 p-6">
                      <p className="font-manrope text-[10px] font-bold tracking-[0.1em] text-[#fcf3e0] uppercase">
                        {tertiaryReport.categoryLabel}
                      </p>
                      <h3 className="font-epilogue text-[24px] leading-[25px] font-bold text-[#f9f0de] transition duration-300 group-hover:text-white">
                        {tertiaryReport.title}
                      </h3>
                      <p className="font-manrope pt-2 text-[14px] leading-5 text-[#dfbfbc]">
                        {tertiaryReport.excerpt}
                      </p>
                    </div>
                  </Link>
                </article>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={store.settings} />
    </div>
  );
}
