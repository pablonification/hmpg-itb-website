import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

async function loginAsAdmin(page: Page) {
  await page.goto("/dashboard/login");
  await page.locator('input[name="email"]').fill("admin@hmpg.local");
  await page.locator('input[name="password"]').fill("hmpg-demo");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

async function gotoContentSection(page: Page, section: string) {
  await page.goto(`/dashboard/content?section=${section}`);
  await expect(page).toHaveURL(
    new RegExp(`/dashboard/content\\?section=${section}$`),
  );
}

async function saveCurrentContentPage(page: Page) {
  const url = new URL(page.url());
  const section = url.searchParams.get("section") ?? "settings";
  await page.getByRole("button", { name: "Simpan perubahan" }).click();
  await expect(page).toHaveURL(
    new RegExp(`/dashboard/content\\?section=${section}&message=`),
  );
}

async function deleteReportIfExists(page: Page, slug: string) {
  await page.goto("/dashboard/reports");
  const reportLink = page.locator(
    `a[href="/dashboard/reports?report=${slug}"]`,
  );

  if ((await reportLink.count()) === 0) {
    return;
  }

  await reportLink.first().click();
  await expect(page).toHaveURL(
    new RegExp(`/dashboard/reports\\?report=${slug}$`),
  );
  await page.getByRole("button", { name: "Hapus Laporan" }).click();
  await expect(page).toHaveURL(/\/dashboard\/reports\?message=/);
}

test("CMS-owned content stays in sync with dashboard and public site", async ({
  page,
}) => {
  test.setTimeout(120000);

  const suffix = `sync-${Date.now()}`;
  const shortName = `HMPG ${suffix}`;
  const reportsTitle = `Archive ${suffix}`;
  const periodLabel = `Cabinet ${suffix}`;
  const latestTitle = `Latest ${suffix}`;
  const socialTitle = `Social ${suffix}`;
  const reportTitle = `CMS Report ${suffix}`;
  const reportSlug = `cms-report-${suffix}`;

  let initialShortName = "";
  let initialReportsTitle = "";
  let initialPeriodLabel = "";
  let initialLatestTitle = "";
  let initialSocialTitle = "";
  let initialHeaderLogoSrc = "";
  let createdReport = false;

  await loginAsAdmin(page);

  try {
    await gotoContentSection(page, "settings");
    initialShortName = await page
      .locator('input[name="shortName"]')
      .inputValue();
    await page.locator('input[name="shortName"]').fill(shortName);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "home");
    initialReportsTitle = await page
      .locator('input[name="reportsSectionTitle"]')
      .inputValue();
    await page.locator('input[name="reportsSectionTitle"]').fill(reportsTitle);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "about");
    initialPeriodLabel = await page
      .locator('input[name="valuesSectionPeriodLabel"]')
      .inputValue();
    await page
      .locator('input[name="valuesSectionPeriodLabel"]')
      .fill(periodLabel);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "reports");
    initialLatestTitle = await page
      .locator('input[name="latestSectionTitle"]')
      .inputValue();
    await page.locator('input[name="latestSectionTitle"]').fill(latestTitle);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "contact");
    initialSocialTitle = await page
      .locator('input[name="socialSectionTitle"]')
      .inputValue();
    await page.locator('input[name="socialSectionTitle"]').fill(socialTitle);
    await saveCurrentContentPage(page);

    await page.goto("/");
    await expect(
      page.getByRole("link", { name: new RegExp(shortName) }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: reportsTitle }),
    ).toBeVisible();

    await page.goto("/about-us");
    await expect(page.getByText(periodLabel)).toBeVisible();

    await page.goto("/reports");
    await expect(
      page.getByRole("heading", { name: latestTitle }),
    ).toBeVisible();

    await page.goto("/contact-us");
    await expect(
      page.getByRole("heading", { name: socialTitle }),
    ).toBeVisible();
    await expect(page.getByText(shortName).first()).toBeVisible();

    await page.goto("/dashboard/reports?new=1");
    await page.locator('input[name="title"]').fill(reportTitle);
    await page
      .locator('textarea[name="excerpt"]')
      .fill("Report sinkronisasi CMS.");
    await page.locator('select[name="category"]').selectOption("editorial");
    await page.locator('select[name="status"]').selectOption("published");
    await page.locator('input[name="featured"]').check();
    await page
      .locator('input[name="coverImageFile"]')
      .setInputFiles(
        path.resolve("public/assets/figma/report-detail-hero.png"),
      );
    await page.locator('[contenteditable="true"]').click();
    await page.keyboard.type("Report sinkronisasi CMS.");

    await page.getByRole("button", { name: "Simpan Laporan" }).click();
    createdReport = true;

    await expect(page).toHaveURL(/\/dashboard\/reports\?report=cms-report-/);
    await expect(
      page.locator(`a[href="/dashboard/reports/preview/${reportSlug}"]`),
    ).toBeVisible();

    await page.goto(`/dashboard/reports/preview/${reportSlug}`);
    await expect(page.getByText("Report sinkronisasi CMS.")).toBeVisible();

    await page.goto("/reports");
    const reportLink = page
      .getByRole("link", { name: new RegExp(reportTitle) })
      .first();
    await expect(reportLink).toBeVisible();
    await expect(reportLink.locator("img").first()).toHaveAttribute(
      "src",
      /report-detail-hero\.png/,
    );

    await page.goto(`/reports/${reportSlug}`);
    await expect(page).toHaveURL(new RegExp(`/reports/${reportSlug}$`));
    await expect(page.getByText("Report sinkronisasi CMS.")).toBeVisible();

    await page.goto("/dashboard/assets");
    const headerLogoCard = page
      .locator("form")
      .filter({
        has: page.getByRole("heading", { name: "Header logo" }),
      })
      .first();

    initialHeaderLogoSrc =
      (await page
        .locator('img[alt="Header logo"]')
        .first()
        .getAttribute("src")) ?? "/assets/figma/hmpg-logo-mark.png";

    await headerLogoCard
      .locator('input[name="assetFile"]')
      .setInputFiles(path.resolve("public/assets/figma/hmpg-logo-mark.png"));
    await headerLogoCard.getByRole("button", { name: "Ganti asset" }).click();
    await expect(page).toHaveURL(/\/dashboard\/assets\?message=/);

    await page.goto("/");
    const headerLogoAfter = await page
      .locator(`img[alt="${shortName} logo"]`)
      .getAttribute("src");
    expect(headerLogoAfter).toBeTruthy();
  } finally {
    if (page.isClosed()) {
      return;
    }

    await loginAsAdmin(page);

    await gotoContentSection(page, "settings");
    await page.locator('input[name="shortName"]').fill(initialShortName);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "home");
    await page
      .locator('input[name="reportsSectionTitle"]')
      .fill(initialReportsTitle);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "about");
    await page
      .locator('input[name="valuesSectionPeriodLabel"]')
      .fill(initialPeriodLabel);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "reports");
    await page
      .locator('input[name="latestSectionTitle"]')
      .fill(initialLatestTitle);
    await saveCurrentContentPage(page);

    await gotoContentSection(page, "contact");
    await page
      .locator('input[name="socialSectionTitle"]')
      .fill(initialSocialTitle);
    await saveCurrentContentPage(page);

    if (createdReport) {
      await deleteReportIfExists(page, reportSlug);
    }

    if (initialHeaderLogoSrc.startsWith("/assets/")) {
      await page.goto("/dashboard/assets");
      const headerLogoCard = page
        .locator("form")
        .filter({
          has: page.getByRole("heading", { name: "Header logo" }),
        })
        .first();

      await headerLogoCard
        .locator('input[name="assetFile"]')
        .setInputFiles(
          path.resolve("public", initialHeaderLogoSrc.replace(/^\//, "")),
        );
      await headerLogoCard.getByRole("button", { name: "Ganti asset" }).click();
      await expect(page).toHaveURL(/\/dashboard\/assets\?message=/);
    }
  }
});
