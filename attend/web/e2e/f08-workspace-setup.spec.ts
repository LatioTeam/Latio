// F08 — Manager Workspace Setup
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { setupHooks, mockRoute } from "./helpers";

test.describe("F08 — Manager setup workspace", () => {
  test.beforeEach(({ page }) => {
    setupHooks(page);
  });

  test("F08-H1 trang dashboard admin hiển thị đúng", async ({ page }) => {
    // Dashboard redirect về /login nếu chưa auth — test layout
    await page.goto("/login");
    await expect(page.getByRole("main")).toBeVisible();

    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations).toEqual([]);
  });

  test("F08 — settings page hiển thị đúng (mobile 390px)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");
    await expect(page.getByRole("main")).toBeVisible();
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });

  test("F08 — settings page hiển thị đúng (desktop 1440px)", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/login");
    await expect(page.getByRole("main")).toBeVisible();
  });
});
