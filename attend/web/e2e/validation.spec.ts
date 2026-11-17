// Validation unit tests — Zod schemas (chạy Node, không cần browser)
// Dùng Playwright test runner cho consistency
import { test, expect } from "@playwright/test";

// Import schemas trực tiếp — không cần browser
test.describe("Zod schemas — validation rules", () => {
  test.beforeAll(() => {
    // Các test này không cần server
  });

  test("A03 joinWorkspaceSchema — valid 8-char uppercase", async () => {
    const { joinWorkspaceSchema } = await import("../lib/validation/schemas");
    const r = joinWorkspaceSchema.safeParse({ invite_code: "ABCD1234" });
    expect(r.success).toBe(true);
  });

  test("F07-E1 joinWorkspaceSchema — 7 ký tự fail", async () => {
    const { joinWorkspaceSchema } = await import("../lib/validation/schemas");
    const r = joinWorkspaceSchema.safeParse({ invite_code: "ABCD123" });
    expect(r.success).toBe(false);
    if (!r.success) {
      // Zod v4 dùng .issues thay vì .errors
      const issues = r.error.issues ?? (r.error as unknown as { errors: unknown[] }).errors ?? [];
      const msg = issues[0]?.message ?? r.error.message ?? "";
      expect(msg).toContain("8 ký tự");
    }
  });

  test("F07-E3 joinWorkspaceSchema — lowercase auto-uppercase", async () => {
    const { joinWorkspaceSchema } = await import("../lib/validation/schemas");
    const r = joinWorkspaceSchema.safeParse({ invite_code: "abcdefgh" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.invite_code).toBe("ABCDEFGH");
  });

  test("A09 checkinSchema — idempotency_key không phải UUID → fail", async () => {
    const { checkinSchema } = await import("../lib/validation/schemas");
    const r = checkinSchema.safeParse({
      method: "gps",
      lat: 10.7769,
      lng: 106.7009,
      idempotency_key: "not-a-uuid",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issues = r.error.issues ?? (r.error as unknown as { errors: unknown[] }).errors ?? [];
      const msg = issues[0]?.message ?? r.error.message ?? "";
      expect(msg).toContain("UUID");
    }
  });

  test("checkinSchema — valid GPS", async () => {
    const { checkinSchema } = await import("../lib/validation/schemas");
    const r = checkinSchema.safeParse({
      method: "gps",
      lat: 10.7769,
      lng: 106.7009,
      accuracy: 15,
      idempotency_key: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(r.success).toBe(true);
  });

  test("F02-E1 leaveRequestSchema — end_date < start_date fail", async () => {
    const { leaveRequestSchema } = await import("../lib/validation/schemas");
    const r = leaveRequestSchema.safeParse({
      leave_type: "annual",
      start_date: "2026-11-20",
      end_date: "2026-11-15",  // trước start_date
      reason: "Nghỉ phép",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issues = r.error.issues ?? (r.error as unknown as { errors: unknown[] }).errors ?? [];
      // Refine error có path ["end_date"] hoặc message chứa "end_date"
      const hasEndDateError = issues.some(
        (e: { path?: string[]; message?: string }) =>
          (e.path ?? []).includes("end_date") || (e.message ?? "").toLowerCase().includes("end")
      );
      expect(hasEndDateError).toBe(true);
    }
  });

  test("leaveRequestSchema — valid full-day", async () => {
    const { leaveRequestSchema } = await import("../lib/validation/schemas");
    const r = leaveRequestSchema.safeParse({
      leave_type: "annual",
      start_date: "2026-11-20",
      end_date: "2026-11-22",
      reason: "Nghỉ phép năm",
    });
    expect(r.success).toBe(true);
  });

  test("A20 checkinRulesSchema — gps_radius_m < 50 fail", async () => {
    const { checkinRulesSchema } = await import("../lib/validation/schemas");
    const r = checkinRulesSchema.safeParse({
      gps_enabled: true,
      gps_radius_m: 10,  // < 50
      wifi_enabled: false,
      wifi_ssids: [],
      qr_enabled: true,
      late_threshold_minutes: 10,
    });
    expect(r.success).toBe(false);
  });

  test("F08-E1 createWorkspaceSchema — tên 1 ký tự fail", async () => {
    const { createWorkspaceSchema } = await import("../lib/validation/schemas");
    const r = createWorkspaceSchema.safeParse({ name: "A" });
    expect(r.success).toBe(false);
    if (!r.success) {
      const issues = r.error.issues ?? (r.error as unknown as { errors: unknown[] }).errors ?? [];
      const msg = issues[0]?.message ?? r.error.message ?? "";
      expect(msg).toContain("2 ký tự");
    }
  });
});
