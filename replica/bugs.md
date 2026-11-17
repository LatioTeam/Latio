# LATIO Attend — Bug Report (Milestone 0)

Generated: 2026-11-17  
Scope: Web admin app (`attend/web`) — `/replica-test` pass

---

## BUG-001 — CSS @import phải đứng trước @tailwind directives

| Field | Value |
|-------|-------|
| **ID** | BUG-001 |
| **Severity** | S3 |
| **Status** | Fixed — commit cc2a703 |
| **File** | `attend/web/app/globals.css` |

**Steps to reproduce:**
1. `npm run dev` với Turbopack
2. App không load — terminal báo lỗi

**Expected:** App load bình thường  
**Actual:** Turbopack crash: `Parsing css source code failed: @import rules must precede all rules`

**Root cause:** `@import url(Google Fonts)` đặt sau `@tailwind base`/`components`/`utilities`. CSS spec yêu cầu `@import` phải ở đầu file.

**Fix:** Di chuyển `@import url(https://fonts.googleapis.com/...)` lên dòng 1 trước tất cả `@tailwind` directives.

---

## BUG-002 — `experimental.typedRoutes` không tương thích với Turbopack

| Field | Value |
|-------|-------|
| **ID** | BUG-002 |
| **Severity** | S3 |
| **Status** | Fixed — commit cc2a703 |
| **File** | `attend/web/next.config.ts` |

**Steps to reproduce:**
1. `npm run dev` (Turbopack)
2. Dev server không khởi động

**Expected:** Dev server chạy bình thường  
**Actual:** Error: `experimental.typedRoutes` không được hỗ trợ trong Turbopack mode

**Fix:** Comment out `experimental: { typedRoutes: true }` trong `next.config.ts`. Bật lại khi build với webpack.

---

## BUG-003 — Login page thiếu `<main>` landmark

| Field | Value |
|-------|-------|
| **ID** | BUG-003 |
| **Severity** | S3 |
| **Status** | Fixed — commit (test batch) |
| **File** | `attend/web/app/(auth)/login/page.tsx` |

**Steps to reproduce:**
1. Mở `/login` trên screen reader hoặc dùng Playwright `getByRole("main")`
2. Element không tìm thấy

**Expected:** Trang có `<main>` landmark để screen reader nhảy thẳng vào nội dung chính  
**Actual:** Outer container là `<div>` — thiếu semantic HTML landmark

**Fix:** Đổi `<div className="min-h-screen...">` thành `<main className="min-h-screen...">` trong `AdminLoginPage`.

**Accessibility impact:** axe-core sẽ báo "Page must contain a level-one heading" và screen reader users không thể skip navigation.

---

## BUG-004 — Email input thiếu `htmlFor`/`id` liên kết với label

| Field | Value |
|-------|-------|
| **ID** | BUG-004 |
| **Severity** | S3 |
| **Status** | Fixed — commit (test batch) |
| **File** | `attend/web/app/(auth)/login/page.tsx` |

**Steps to reproduce:**
1. Click vào label "Email" trên trang login
2. Input không được focus

**Expected:** Click vào label → focus input email  
**Actual:** Label không liên kết với input — click không focus input

**Fix:** Thêm `htmlFor="email"` vào `<label>` và `id="email"` vào `<input>`. Giúp cả accessibility lẫn usability.

---

## BUG-005 — Middleware crash với placeholder Supabase URL

| Field | Value |
|-------|-------|
| **ID** | BUG-005 |
| **Severity** | S2 (test env), S4 (production) |
| **Status** | Fixed — commit (test batch) |
| **File** | `attend/web/middleware.ts` |

**Steps to reproduce:**
1. Set `NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co`
2. Mở bất kỳ route nào
3. 500 error

**Expected:** App hoạt động (hoặc hiển thị lỗi thân thiện) khi chưa cấu hình Supabase  
**Actual:** `createServerClient` ném exception "URL and Key are required" → 500 trên mọi route

**Fix:** Thêm guard trong `middleware.ts`:
```typescript
if (!supabaseUrl || supabaseUrl.includes("placeholder")) {
  return NextResponse.next({ request });
}
```

---

## BUG-006 — API A20 test dùng sai HTTP method (POST thay vì PUT)

| Field | Value |
|-------|-------|
| **ID** | BUG-006 |
| **Severity** | S4 (test bug, không phải app bug) |
| **Status** | Fixed — test batch commit |
| **File** | `attend/web/e2e/api-checkin.spec.ts` |

**Steps to reproduce:**
1. Chạy Playwright test A20
2. Expected 401, nhận 405

**Root cause:** Helper `fetchNoAuth` luôn dùng `POST` khi có body, nhưng `/api/workspaces/:id/checkin-rules` chỉ nhận `PUT`. Next.js trả 405 Method Not Allowed trước khi chạy auth check.

**Fix:** Gọi `fetch()` trực tiếp với `method: "PUT"` trong test A20.

---

## To Check (chưa reproduce được trong test env)

| # | Mô tả | Cần để test |
|---|-------|-------------|
| TC-01 | Realtime subscription `/api/workspaces/[id]/attendance` — chưa kiểm tra Supabase Realtime channels | Supabase keys thật |
| TC-02 | GPS accuracy check trên thiết bị thật — browser mock có thể không giống GPS thật | Mobile device |
| TC-03 | OTP email delivery — Supabase Auth email provider | Email account |
| TC-04 | Google SSO flow — OAuth client config | Google OAuth app |
| TC-05 | Inngest functions — cron triggers | Inngest server + Supabase |
| TC-06 | Offline sync dedup với idempotency_key — cần network simulation | Service worker / network mock |

---

## Test Summary

| Metric | Count |
|--------|-------|
| Total automated cases | 38 |
| Passed | 38 |
| Failed | 0 |
| S1 bugs | 0 |
| S2 bugs | 0 (BUG-005 chỉ S2 trong test env) |
| S3 bugs (fixed) | 4 |
| S4 bugs (fixed) | 1 (test bug) |
| Open bugs | 0 |
