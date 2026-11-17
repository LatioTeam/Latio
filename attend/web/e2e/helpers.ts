// Test helpers — shared across specs
import { Page } from "@playwright/test";

export const TEST_MANAGER = {
  email: "manager@latio.test",
  password: "Test1234!",
};

export const TEST_EMPLOYEE = {
  email: "employee@latio.test",
  password: "Test1234!",
};

export const TEST_WORKSPACE_ID = "00000000-0000-0000-0000-000000000001";

/** Fail on console errors */
export function failOnConsoleErrors(page: Page) {
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      // Bỏ qua lỗi hydration Next.js trong dev mode
      if (msg.text().includes("Hydration") || msg.text().includes("Warning:")) return;
      throw new Error(`Console error: ${msg.text()}`);
    }
  });
}

/** Fail on 5xx responses */
export function failOn5xx(page: Page) {
  page.on("response", (res) => {
    if (res.status() >= 500) {
      throw new Error(`${res.status()} on ${res.url()}`);
    }
  });
}

/** Setup hooks — dùng trong beforeEach */
export function setupHooks(page: Page) {
  failOnConsoleErrors(page);
  failOn5xx(page);
}

/** Mock API response helper (MSW-style via route) */
export async function mockRoute(
  page: Page,
  url: string,
  json: unknown,
  status = 200
) {
  await page.route(url, (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ data: json }),
    })
  );
}
