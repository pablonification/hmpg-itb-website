import { expect, test } from "@playwright/test";

test("public navigation and dashboard login work", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Himpunan Mahasiswa/i }),
  ).toBeVisible();

  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Reports" })
    .click();

  await expect(page).toHaveURL(/\/reports(#reports-overview)?$/);
  await expect(
    page.getByRole("heading", { name: /HMPG ITB Activities/i }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "HMPG's Archives" }),
  ).toBeVisible();

  await page.goto("/dashboard/login");
  await expect(
    page.getByRole("heading", { name: "Masuk ke Dashboard" }),
  ).toBeVisible();

  await page.locator('input[name="email"]').fill("admin@hmpg.local");
  await page.locator('input[name="password"]').fill("hmpg-demo");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("heading", {
      name: /Ringkasan CMS/i,
    }),
  ).toBeVisible();
});
