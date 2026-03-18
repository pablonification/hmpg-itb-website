import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getStore } from "@/lib/repositories/content-repository";

const platformIcons = {
  instagram: "/assets/figma/contact-social-instagram.svg",
  linkedin: "/assets/figma/contact-social-linkedin.svg",
  youtube: "/assets/figma/contact-social-youtube.svg",
  x: "/assets/figma/contact-social-x.svg",
  tiktok: "/assets/figma/contact-social-tiktok.svg",
};

export default async function ContactPage() {
  const store = await getStore();
  const contact = store.pages.contact;

  return (
    <div className="editorial-shell min-h-screen">
      <SiteHeader settings={store.settings} />

      <main>
        <section className="grid min-h-[740px] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div className="bg-brand-maroon relative flex overflow-hidden px-6 py-20 text-white sm:px-8 md:py-24 lg:pt-32 lg:pr-12 lg:pb-24 lg:pl-[max(3rem,calc((100vw-1280px)/2+3rem))]">
            <img
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover"
              src="/assets/figma/contact-hero-card.png"
            />
            <div className="pointer-events-none absolute inset-0 bg-[rgba(113,34,36,0.7)]" />
            <div className="relative mt-auto w-full max-w-[34rem]">
              <p className="font-manrope text-xs tracking-[0.1em] text-white/70 uppercase">
                {contact.heroEyebrow}
              </p>
              <h1 className="font-epilogue mt-6 text-[4rem] leading-[0.92] font-extrabold tracking-[-0.04em] md:text-[5.5rem] lg:text-[6rem]">
                {contact.heroTitle.split(" ").map((part, index) => (
                  <span className="block" key={`${part}-${index}`}>
                    {part}
                  </span>
                ))}
              </h1>
              <div className="mt-12 max-w-[28rem] border-t border-white/20 pt-8">
                <p className="font-manrope text-base leading-[1.8] text-white/90 md:text-lg">
                  {contact.heroDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-brand-surface relative overflow-hidden px-6 py-20 sm:px-8 md:py-24 lg:pt-24 lg:pr-[max(3rem,calc((100vw-1280px)/2+3rem))] lg:pb-24 lg:pl-12">
            <img
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
              src="/assets/figma/contact-paper-texture.png"
            />
            <div className="relative flex min-h-full w-full max-w-[28rem] flex-col justify-center gap-12 md:gap-14 lg:max-w-[32rem]">
              <div>
                <p className="font-manrope text-brand-stroke text-[10px] font-bold tracking-[0.05em] uppercase">
                  Email Resmi
                </p>
                <a
                  className="font-epilogue text-brand-ink mt-2 block text-[2rem] leading-[1.2] font-semibold tracking-[-0.03em] break-words md:text-[2.1rem]"
                  href={`mailto:${store.settings.email}`}
                >
                  {store.settings.email}
                </a>
              </div>
              <div>
                <p className="font-manrope text-brand-stroke text-[10px] font-bold tracking-[0.05em] uppercase">
                  {contact.officeTitle}
                </p>
                <p className="font-epilogue text-brand-ink mt-2 text-[2rem] leading-[1.1] font-semibold tracking-[-0.03em] md:text-[2.1rem]">
                  {contact.officeAddress}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-brand-shell border-brand-stroke/10 border-y px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-[1280px]">
            <h2 className="font-epilogue text-brand-ink text-center text-[2.25rem] font-extrabold tracking-[-0.025em]">
              Sosial Media
            </h2>
            <div className="border-brand-stroke/10 bg-brand-stroke/10 mx-auto mt-12 grid max-w-[1200px] gap-px overflow-hidden border p-px sm:grid-cols-2 lg:grid-cols-5">
              {store.settings.socialLinks.map((social, index) => {
                const iconSrc = platformIcons[social.platform];
                const iconClassName =
                  social.platform === "x" || social.platform === "tiktok"
                    ? "h-[2.8rem] w-[2.8rem]"
                    : "h-[3.1rem] w-[3.1rem]";

                const isLast = index === store.settings.socialLinks.length - 1;
                const isOdd = store.settings.socialLinks.length % 2 !== 0;

                return (
                  <a
                    className={`bg-brand-surface group relative flex min-h-[212px] flex-col items-center justify-center overflow-hidden px-8 py-10 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(0,0,0,0.08)] ${
                      isLast && isOdd ? "sm:col-span-2 lg:col-span-1" : ""
                    }`}
                    href={social.href}
                    key={social.platform}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <img
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply"
                      src="/assets/figma/contact-paper-texture.png"
                    />
                    <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
                      <img
                        alt={social.label}
                        className={`${iconClassName} object-contain transition duration-300 group-hover:scale-105`}
                        src={iconSrc}
                      />
                    </div>
                    <p className="font-epilogue text-brand-ink relative mt-7 text-lg font-bold">
                      {social.label}
                    </p>
                    <p className="font-manrope text-brand-body relative mt-2 text-[12px] tracking-[-0.05em]">
                      {social.handle}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative h-[42rem] overflow-hidden bg-white">
          <img
            alt={store.settings.shortName}
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
            src={contact.showcaseImageSrc}
          />
          <div className="absolute inset-0 flex items-center justify-center gap-6 px-6 text-center md:gap-10">
            <img
              alt={`${store.settings.shortName} showcase logo`}
              className="h-32 w-32 object-contain md:h-48 md:w-48 lg:h-[250px] lg:w-[250px]"
              src="/assets/figma/contact-logo-mark.png"
            />
            <p className="font-epilogue text-brand-cream text-4xl font-bold tracking-[-0.05em] md:text-6xl lg:text-[4rem]">
              {store.settings.shortName}
            </p>
          </div>
        </section>
      </main>

      <SiteFooter settings={store.settings} />
    </div>
  );
}
