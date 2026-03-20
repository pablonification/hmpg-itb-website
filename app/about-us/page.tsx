import type { Metadata } from "next";
import { FireIcon, TrophyIcon, UsersIcon } from "@heroicons/react/24/solid";
import type { Route } from "next";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getStore } from "@/lib/repositories/content-repository";
import { buildPageMetadata } from "@/lib/seo";

const valueIcons = [UsersIcon, TrophyIcon, FireIcon] as const;

const colorSwatches = [
  {
    color: "#831618",
    label: "Burgundy",
    description: "Semangat dan Percaya Diri",
    bordered: false,
  },
  {
    color: "#fff8f0",
    label: "Putih Gading",
    description: "Kebijaksanaan",
    bordered: true,
  },
  {
    color: "#1f1b10",
    label: "Hitam",
    description: "Ketangguhan",
    bordered: false,
  },
  {
    color: "#fde089",
    label: "Emas",
    description: "Kemakmuran",
    bordered: false,
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const store = await getStore();
  const about = store.pages.about;

  return buildPageMetadata({
    title: "About Us",
    description:
      about.historyParagraphs[0] ||
      "Pelajari sejarah, visi, misi, dan identitas visual HMPG ITB.",
    path: "/about-us",
    image: about.heroImageSrc,
    keywords: [
      "About HMPG ITB",
      "sejarah HMPG ITB",
      "visi misi HMPG ITB",
      "identitas visual HMPG ITB",
    ],
  });
}

export default async function AboutPage() {
  const store = await getStore();
  const about = store.pages.about;

  return (
    <div className="min-h-screen overflow-x-clip bg-[#fff8f0]">
      <SiteHeader activeHref={"/about-us" as Route} settings={store.settings} />

      <main data-auto-reveal>
        <section className="relative h-[409px] overflow-hidden bg-[#712224]">
          <div className="absolute inset-0 overflow-hidden">
            <img
              alt={about.heroTitle}
              className="absolute top-[-47.43%] left-[-0.04%] h-[208.8%] w-[100.08%] max-w-none object-cover"
              src={about.heroImageSrc}
            />
          </div>
          <div className="absolute inset-0 bg-[rgba(113,34,36,0.6)]" />

          <div className="relative mx-auto flex h-full w-full max-w-[1280px] items-center px-6 sm:px-8 lg:px-12">
            <div className="max-w-[744px] text-white">
              <h1
                className="font-epilogue w-full max-w-[505px] text-[3.5rem] leading-[0.95] font-extrabold md:text-[72px] md:leading-[96px]"
                data-reveal="hero"
              >
                {about.heroTitle}
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-[#fff8f0] px-6 py-[90px] sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[1232px] gap-10 lg:grid-cols-[456px_664px] lg:gap-16">
            <div
              className="relative overflow-hidden bg-[#fcf3e0]"
              data-reveal="card"
            >
              <div className="relative h-full min-h-[595px] w-full">
                <img
                  alt={about.historyTitle}
                  className="absolute inset-0 h-full w-full object-cover object-[63%_center] grayscale"
                  src={about.historyImageSrc}
                />
              </div>
            </div>

            <div className="space-y-4 self-center pt-[40.58px]">
              <p className="font-manrope text-[14px] font-bold tracking-[0.2em] text-[#831618] uppercase">
                {about.historyEyebrow}
              </p>
              <h2 className="font-epilogue max-w-[664px] text-[36px] leading-[40px] font-bold text-[#1f1b10]">
                {about.historyTitle}
              </h2>
              <div className="font-manrope space-y-[23.3px] pt-[15.25px] text-[18px] leading-[29.25px] text-[#58413f]">
                {about.historyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fcf3e0] px-6 pt-[91px] pb-[110px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1232px]">
            <div className="text-center">
              <h2 className="font-epilogue text-[36px] font-extrabold tracking-[-0.025em] text-[#1f1b10]">
                {about.valuesSectionTitle}
              </h2>
              <p className="font-manrope mt-4 text-[14px] font-bold tracking-[0.2em] text-[#5b5b81] uppercase">
                {about.valuesSectionPeriodLabel}
              </p>
            </div>

            <div className="mt-14 grid gap-6 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
              <article
                className="relative overflow-hidden bg-[#831618] px-8 py-10 text-white lg:col-span-3 lg:px-12 lg:py-12"
                data-reveal="card"
              >
                <img
                  alt=""
                  aria-hidden="true"
                  className="absolute top-[-10px] right-3 h-[112px] w-[112px] object-contain sm:top-[-18px] sm:right-4 sm:h-[144px] sm:w-[144px] md:top-[-24px] md:right-5 md:h-[168px] md:w-[168px] lg:top-[-32px] lg:right-7 lg:h-[180px] lg:w-[180px]"
                  src={about.visionBadgeSrc}
                />
                <div className="max-w-[48rem]" data-reveal-ignore>
                  <p className="font-manrope text-[14px] font-bold tracking-[0.2em] text-[#ffc3bd] uppercase">
                    Visi
                  </p>
                  <p className="font-epilogue mt-6 max-w-[768px] text-[32px] leading-[1.2] font-bold md:text-[36px] md:leading-[40px]">
                    {about.vision}
                  </p>
                </div>
              </article>

              <article
                className="border-l-4 border-[#831618] bg-[#f0e7d5] px-8 py-10 lg:col-span-3"
                data-reveal="card"
              >
                <div data-reveal-ignore>
                  <p className="font-manrope text-[14px] font-bold tracking-[0.2em] text-[#831618] uppercase">
                    Misi
                  </p>
                  <div className="mt-8 space-y-3">
                    {about.missions.map((mission, index) => (
                      <div className="flex items-start gap-4" key={mission}>
                        <span className="font-epilogue mt-[3px] w-6 shrink-0 text-[16px] leading-6 font-bold whitespace-nowrap text-[#831618]">
                          {String(index + 1).padStart(2, "0")}.
                        </span>
                        <p className="font-manrope text-[16px] leading-6 text-[#1f1b10]">
                          {mission}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </article>

              <article
                className="bg-[#fde089] px-8 py-10 lg:col-span-3 lg:px-12"
                data-reveal="card"
              >
                <div
                  className="flex flex-col gap-6 md:flex-row md:items-center"
                  data-reveal-ignore
                >
                  <p className="font-manrope shrink-0 text-[14px] font-bold tracking-[0.2em] text-[#2d2b21] uppercase md:mr-12 lg:mr-16">
                    Nilai
                  </p>
                  <div className="flex flex-1 flex-wrap items-center justify-between gap-x-8 gap-y-4 md:pr-8 lg:pr-16">
                    {about.values.map((value, index) => {
                      const Icon = valueIcons[index % valueIcons.length]!;

                      return (
                        <div
                          className="flex shrink-0 items-center gap-3"
                          key={value}
                        >
                          <Icon
                            aria-hidden="true"
                            className="h-7 w-7 shrink-0 text-[#2d2b21]"
                          />
                          <span className="font-epilogue translate-y-[2px] text-[24px] font-bold text-[#2d2b21]">
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[#fff8f0] px-6 pt-[60px] pb-[96px] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1232px]">
            <div className="text-center">
              <p className="font-manrope text-[14px] font-bold tracking-[0.2em] text-[#831618] uppercase">
                {about.identitySectionEyebrow}
              </p>
              <h2 className="font-epilogue mt-3 text-[36px] font-bold text-[#1f1b10]">
                {about.identitySectionTitle}
              </h2>
            </div>

            <div
              className="relative mx-auto mt-16 min-h-[435px] max-w-[896px] overflow-hidden border border-[rgba(223,191,188,0.3)] bg-[#fcf3e0] p-1"
              data-reveal="card"
            >
              <img
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-[-389px] left-[-16px] h-[990px] w-[921px] max-w-none object-cover opacity-35 mix-blend-multiply"
                src={about.identityTextureSrc}
              />
              <div
                className="relative flex h-full flex-col items-center gap-10 bg-white px-8 py-12 md:flex-row md:items-center md:gap-16 md:px-10 md:py-16"
                data-reveal-ignore
              >
                <img
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-multiply"
                  src={about.identityTextureSrc}
                />
                <div className="flex shrink-0 items-center justify-center">
                  <img
                    alt={store.settings.shortName}
                    className="h-48 w-48 object-contain md:h-64 md:w-64"
                    src={about.logoShowcaseSrc}
                  />
                </div>

                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <h3 className="font-epilogue text-[24px] font-bold text-[#831618]">
                    {about.logoMeaningTitle}
                  </h3>
                  <p className="font-manrope mt-6 max-w-[28rem] text-[16px] leading-[26px] text-[#58413f]">
                    {about.logoMeaningDescription}
                  </p>

                  <div className="mt-8 flex flex-wrap items-start justify-center gap-4 md:justify-start">
                    {colorSwatches.map((swatch) => (
                      <ColorSwatch
                        bordered={swatch.bordered}
                        color={swatch.color}
                        description={swatch.description}
                        key={swatch.label}
                        label={swatch.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter settings={store.settings} />
    </div>
  );
}

function ColorSwatch({
  color,
  label,
  description,
  bordered = false,
}: {
  color: string;
  label: string;
  description: string;
  bordered?: boolean;
}) {
  return (
    <div className="flex w-[96px] flex-col items-center text-center">
      <div
        className={[
          "mx-auto h-8 w-8 rounded-[12px]",
          bordered ? "border border-[#dfbfbc]" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ backgroundColor: color }}
      />
      <p className="font-manrope mt-2 text-[10px] font-bold tracking-[0.05em] text-[#1f1b10] uppercase">
        {label}
      </p>
      <p className="font-manrope mt-1 text-[10px] leading-[1.35] text-[#58413f]">
        {description}
      </p>
    </div>
  );
}
