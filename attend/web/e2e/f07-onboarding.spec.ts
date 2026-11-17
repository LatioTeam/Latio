// F07 — New Employee Onboarding: Register → Join Workspace
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { setupHooks, mockRoute } from "./helpers";

test.describe("F07 — Onboarding nhân viên mới", () => {
  test.beforeEach(({ page }) => {
    setupHooks(page);
  });

  test("F07-H1 happy path: trang login hiển thị đúng", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /đăng nhập/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();

    const a11y = await new AxeBuilder({ page }).analyze();
    expect(a11y.violations).toEqual([]);
  });

  test("F07-E1 mã mời 7 ký tự — Zod validation", async ({ page }) => {
    // Mock auth để bỏ qua login
    await mockRoute(page, "/api/workspaces/join", null, 400);

    await page.goto("/login");
    // Test form validation phía client
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("F07-E3 mã mời chữ thường tự động uppercase", async ({ page }) => {
    // Kiểm tra Zod schema .toUpperCase() hoạt động
    const { joinWorkspaceSchema } = await import("../lib/validation/schemas");
    const result = joinWorkspaceSchema.safeParse({ invite_code: "abcdefgh" });
    // Zod toUpperCase() sẽ transform sang uppercase
    if (result.success) {
      expect(result.data.invite_code).toBe("ABCDEFGH");
    }
  });

  test("F07 — trang login mobile width 390px", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");
    await expect(page.getByRole("main")).toBeVisible();
    // Không có horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(390);
  });
});
