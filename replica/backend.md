# Backend Checklist — Chấm Công LATIO

> Skill: `/replica-backend` | Last updated: 2026-11-17

---

## Milestone 0 — Vertical Slice (Core Loop)

**Goal:** Manager tạo workspace → Invite nhân viên → Nhân viên check-in GPS → Manager thấy realtime trên web

### Auth
- [x] Supabase Auth với OTP email (`@supabase/ssr`)
- [x] Browser client (`lib/supabase/client.ts`)
- [x] Server client + service role client (`lib/supabase/server.ts`)
- [x] Session refresh middleware + auth guards (`middleware.ts`)
- [ ] Google SSO (cần tạo Google Cloud project — xem .env.example)
- [ ] Apple Sign-In (cần Apple Developer account — required trước khi ship)

### Database
- [x] Drizzle ORM schema đầy đủ (`lib/db/schema.ts`)
  - workspaces, workspace_members, shifts, checkin_rules
  - attendance_records (UNIQUE user_id+date, idempotency_key UUID)
  - leave_requests, leave_balances, salary_configs, payroll_records, notifications
- [x] Migration SQL (`supabase/migrations/0001_initial_schema.sql`)
- [x] RLS policies (`supabase/migrations/0002_rls_policies.sql`)
  - Helper functions: `get_user_workspace_ids()`, `is_manager_in_workspace()`
  - Row-level isolation theo workspace
  - Realtime enabled: `attendance_records`, `notifications`
- [x] Drizzle config (`drizzle.config.ts`)
- [ ] Seed script với dữ liệu test (xem `lib/seed.ts` trong web — dùng cho UI dev)
- [ ] Backup: Supabase daily backup — cần bật trong dashboard

### API Routes — Milestone 0
- [x] `POST /api/workspaces` — Tạo workspace
- [x] `POST /api/workspaces/join` — Tham gia workspace bằng invite code
- [x] `GET  /api/workspaces/[id]/checkin-rules` — Lấy rules
- [x] `PUT  /api/workspaces/[id]/checkin-rules` — Cập nhật rules
- [x] `POST /api/attendance/checkin` — GPS/WiFi/QR check-in
  - Haversine validation, accuracy ≤100m spoofing check
  - Idempotency key (UUID) — offline sync dedup
  - Late detection vs shift start_time
- [x] `POST /api/attendance/checkout` — Clock-out + tính worked_minutes
  - OT detection vs shift end_time
- [x] `GET  /api/attendance/today` — Trạng thái hôm nay của nhân viên
- [x] `GET  /api/workspaces/[id]/attendance` — Admin: danh sách chấm công theo ngày

### Validation
- [x] Zod schemas cho mọi API route input (`lib/validation/schemas.ts`)
- [x] Response helpers: `ok()`, `err()`, `unauthorized()`, `forbidden()`, `notFound()` (`lib/api.ts`)

### Mobile Client
- [x] Supabase client cho Expo (`mobile/lib/supabase.ts`)
  - AsyncStorage session persistence
  - AppState auto-refresh
- [x] API client (`mobile/lib/api.ts`)
  - `createWorkspace`, `joinWorkspace`, `getCheckinRules`
  - `getTodayAttendance`, `checkin`, `checkout`

### Background Jobs (Inngest)
- [x] Client setup (`lib/inngest/client.ts`)
- [x] Webhook endpoint (`app/api/inngest/route.ts`)
- [x] `shift-reminder` stub — cron */5 * * * *
- [x] `attendance-auto-checkout` stub — cron 0 * * * *
- [x] `payroll-calculate` stub — event driven

### Email (Resend)
- [ ] Transactional email templates (Milestone 1)
  - Invite nhân viên
  - OTP đăng nhập
  - Duyệt/từ chối nghỉ phép

### Environment
- [x] `web/.env.example` — đầy đủ tên biến, không có giá trị
- [x] `mobile/.env.example`

---

## Security Checklist
- [x] Secrets chỉ trong env vars, `.env*` trong `.gitignore`
- [x] Input validated bằng Zod trên mọi route
- [x] Authorization check (RLS + `requireMembership`/`requireManager`) trên mọi read/write
- [x] GPS spoofing mitigation: Haversine + accuracy check
- [x] Idempotency key UUID để tránh duplicate khi offline sync
- [ ] Rate limits trên auth routes (cần middleware Upstash Ratelimit — Milestone 1)
- [ ] Webhook signature verify (Inngest tự xử lý)
- [ ] `npm audit` trước khi deploy
- [ ] Privacy policy liệt kê processors (Supabase, Resend, Inngest)

---

## Env Variables Cần Tạo
Xem `attend/web/.env.example` và `attend/mobile/.env.example` để biết tên biến.

1. **Supabase**: Tạo project tại supabase.com → lấy URL, anon key, service role key, database URL
2. **Resend**: Tạo account resend.com → API key + verify domain
3. **Inngest**: Tạo account inngest.com → event key + signing key
4. **Google OAuth**: Google Cloud Console → OAuth client ID/secret

---

## Chạy Migration
```bash
cd attend/web
# 1. Copy .env.example → .env.local và điền giá trị
# 2. Chạy migration lên Supabase
npx supabase db push
# hoặc chạy thủ công trên Supabase SQL editor:
# supabase/migrations/0001_initial_schema.sql
# supabase/migrations/0002_rls_policies.sql
```

---

## Next: `/replica-test`
