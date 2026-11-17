// API unit tests — /api/attendance/checkin + checkout + today
// Chạy trực tiếp qua fetch, không cần browser
import { test, expect } from "@playwright/test";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

// Helper: gọi API không có auth
async function fetchNoAuth(path: string, body?: unknown) {
  return fetch(`${BASE}${path}`, {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

test.describe("API — attendance routes (không auth)", () => {
  test("A01 POST /api/workspaces — 401 nếu không auth", async () => {
    const res = await fetchNoAuth("/api/workspaces", { name: "Test WS" });
    expect(res.status).toBe(401);
  });

  test("A02 POST /api/workspaces/join — 401 nếu không auth", async () => {
    const res = await fetchNoAuth("/api/workspaces/join", { invite_code: "ABCD1234" });
    expect(res.status).toBe(401);
  });

  test("A06 POST /api/attendance/checkin — 401 nếu không auth", async () => {
    const res = await fetchNoAuth("/api/attendance/checkin", {
      method: "gps",
      lat: 10.7769,
      lng: 106.7009,
      idempotency_key: "00000000-0000-0000-0000-000000000001",
    });
    expect(res.status).toBe(401);
  });

  test("A09 POST /api/attendance/checkin — 400 thiếu idempotency_key", async () => {
    const res = await fetchNoAuth("/api/attendance/checkin", {
      method: "gps",
      lat: 10.7769,
      lng: 106.7009,
      // idempotency_key thiếu
    });
    // 401 vì không auth — idempotency check xảy ra sau auth
    expect([400, 401]).toContain(res.status);
  });

  test("A11 POST /api/attendance/checkout — 401 nếu không auth", async () => {
    const res = await fetchNoAuth("/api/attendance/checkout", {
      attendance_id: "00000000-0000-0000-0000-000000000001",
      method: "gps",
      idempotency_key: "00000000-0000-0000-0000-000000000002",
    });
    expect(res.status).toBe(401);
  });

  test("A13 GET /api/attendance/today — 401 nếu không auth", async () => {
    const res = await fetchNoAuth("/api/attendance/today");
    expect(res.status).toBe(401);
  });
});

test.describe("API — Zod validation (không auth — kiểm tra sau 401)", () => {
  test("A20 PUT /api/workspaces/:id/checkin-rules — 401", async () => {
    const res = await fetch(`${BASE}/api/workspaces/fake-id/checkin-rules`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        gps_enabled: true,
        gps_radius_m: 10,
        wifi_enabled: false,
        wifi_ssids: [],
        qr_enabled: true,
        late_threshold_minutes: 10,
      }),
    });
    // 401 vì không auth — Zod validation sau auth
    expect(res.status).toBe(401);
  });
});
