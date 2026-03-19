import {
  cmsOwnedPageKeys,
  cmsOwnedReportKeys,
  cmsOwnedSettingKeys,
  cmsSocialPlatforms,
  getSocialFieldName,
} from "@/lib/cms/config";
import {
  buildPageContentFromForm,
  buildReportInputFromForm,
  buildSettingsFromForm,
} from "@/lib/cms/form-values";
import { seedPages, seedReports, seedSettings } from "@/lib/data/seed";

describe("CMS sync guardrails", () => {
  it("covers every CMS-owned settings and page key in the seed defaults", () => {
    for (const key of cmsOwnedSettingKeys) {
      expect(seedSettings).toHaveProperty(String(key));
    }

    for (const key of cmsOwnedPageKeys.home) {
      expect(seedPages.home).toHaveProperty(String(key));
    }

    for (const key of cmsOwnedPageKeys.about) {
      expect(seedPages.about).toHaveProperty(String(key));
    }

    for (const key of cmsOwnedPageKeys.reports) {
      expect(seedPages.reports).toHaveProperty(String(key));
    }

    for (const key of cmsOwnedPageKeys.contact) {
      expect(seedPages.contact).toHaveProperty(String(key));
    }

    for (const platformDef of cmsSocialPlatforms) {
      expect(
        seedSettings.socialLinks.some(
          (link) => link.platform === platformDef.platform,
        ),
      ).toBe(true);
    }
  });

  it("builds settings from form data without dropping CMS-owned fields", () => {
    const formData = new FormData();

    formData.set("shortName", "HMPG Sync Test");
    formData.set("email", "sync-test@hmpg.local");
    formData.set("driveAkademikUrl", "https://example.com/archive");
    formData.set("footerCopyright", "Copyright Sync");
    formData.set("footerAddressLines", "Line 1\nLine 2");
    formData.set(getSocialFieldName("instagram", "label"), "IG Sync");
    formData.set(
      getSocialFieldName("instagram", "href"),
      "https://instagram.com/sync",
    );
    formData.set(getSocialFieldName("instagram", "handle"), "@sync");

    const nextSettings = buildSettingsFromForm(formData, seedSettings);

    expect(nextSettings.shortName).toBe("HMPG Sync Test");
    expect(nextSettings.email).toBe("sync-test@hmpg.local");
    expect(nextSettings.driveAkademikUrl).toBe("https://example.com/archive");
    expect(nextSettings.footerCopyright).toBe("Copyright Sync");
    expect(nextSettings.footerAddressLines).toEqual(["Line 1", "Line 2"]);
    expect(
      nextSettings.socialLinks.find((link) => link.platform === "instagram"),
    ).toMatchObject({
      label: "IG Sync",
      href: "https://instagram.com/sync",
      handle: "@sync",
    });
    expect(nextSettings.logoSrc).toBe(seedSettings.logoSrc);
  });

  it("builds page content from form data for newly CMS-owned copy fields", () => {
    const homeForm = new FormData();
    homeForm.set("reportsSectionEyebrow", "Highlight");
    homeForm.set("reportsSectionTitle", "Archive Stories");
    const nextHome = buildPageContentFromForm("home", homeForm, seedPages.home);

    expect(nextHome.reportsSectionEyebrow).toBe("Highlight");
    expect(nextHome.reportsSectionTitle).toBe("Archive Stories");
    expect(nextHome.heroTitleLine1).toBe(seedPages.home.heroTitleLine1);

    const aboutForm = new FormData();
    aboutForm.set("valuesSectionTitle", "Our Compass");
    aboutForm.set("valuesSectionPeriodLabel", "Cabinet 2026/2027");
    aboutForm.set("identitySectionTitle", "Brand Identity");
    const nextAbout = buildPageContentFromForm(
      "about",
      aboutForm,
      seedPages.about,
    );

    expect(nextAbout.valuesSectionTitle).toBe("Our Compass");
    expect(nextAbout.valuesSectionPeriodLabel).toBe("Cabinet 2026/2027");
    expect(nextAbout.identitySectionTitle).toBe("Brand Identity");

    const reportsForm = new FormData();
    reportsForm.set("latestSectionTitle", "Latest Publications");
    const nextReports = buildPageContentFromForm(
      "reports",
      reportsForm,
      seedPages.reports,
    );
    expect(nextReports.latestSectionTitle).toBe("Latest Publications");

    const contactForm = new FormData();
    contactForm.set("socialSectionTitle", "Connect With Us");
    const nextContact = buildPageContentFromForm(
      "contact",
      contactForm,
      seedPages.contact,
    );
    expect(nextContact.socialSectionTitle).toBe("Connect With Us");
  });

  it("builds report inputs with preview media and related slugs intact", () => {
    const existingReport = seedReports[0]!;
    const formData = new FormData();

    formData.set("id", existingReport.id);
    formData.set("title", "CMS Sync Report");
    formData.set("excerpt", "Updated excerpt");
    formData.set("category", "editorial");
    formData.set("editionLabel", "Edition Sync");
    formData.set("periodLabel", "March 2026");
    formData.set("author", "QA");
    formData.set("publishedAt", "2026-03-19T00:00:00.000Z");
    formData.set("status", "published");
    formData.set("featured", "on");
    formData.set("coverImageSrc", "/assets/figma/report-detail-hero.png");
    formData.set(
      "bodyHtml",
      '<section><p>Sync body</p><img alt="Inline" src="/assets/figma/reports-card-keuangan.png" /></section>',
    );

    const nextReport = buildReportInputFromForm(formData, existingReport);

    for (const key of cmsOwnedReportKeys) {
      expect(nextReport).toHaveProperty(String(key));
    }

    expect(nextReport.coverImageSrc).toBe(
      "/assets/figma/report-detail-hero.png",
    );
    expect(nextReport.relatedSlugs).toEqual(existingReport.relatedSlugs);
    expect(nextReport.slug).toBe(existingReport.slug);
    expect(nextReport.featured).toBe(true);
  });
});
