# Architecture — LATIO Attendance App
> Source: replica/recon.md (24 screens, 8 flows, 10 entities)
> Date: 2026-11-16

---

## Step 1 — Stack

| layer | choice | lý do |
|-------|--------|-------|
| Mobile app | **Expo (React Native) + TypeScript** | iOS + Android từ 1 codebase; OTA updates không cần qua App Store; team web có thể contribute |
| Web admin | **Next.js 15 (App Router) + TypeScript** | Server Components cho dashboard nặng; cùng component library với mobile (shared types) |
| Styling | **NativeWind (mobile) + Tailwind (web)** | Cùng utility classes, design tokens từ replica-design |
| Database | **PostgreSQL trên Supabase** | Managed, free tier đủ cho 50 người, Realtime built-in, Row Level Security, Storage tích hợp |
| ORM | **Drizzle ORM** | Type-safe, schema-as-code, migration tự động, nhẹ hơn Prisma |
| Auth | **Supabase Auth** | OTP phone/email, Google OAuth, JWT tích hợp sẵn với RLS |
| Push notifications | **Expo Notifications + FCM + APNs** | Unified API cho cả iOS và Android |
| Email | **Resend** | API đơn giản, deliverability tốt, free 3k email/tháng |
| Background jobs | **Inngest** | Payroll calculation cuối tháng, nhắc ca, sync offline queue |
| File storage | **Supabase Storage** | Avatar, ảnh chấm công, export PDF/Excel — cùng project |
| Realtime | **Supabase Realtime** | Admin dashboard live updates, không cần WebSocket server riêng |
| Hosting (web) | **Vercel** | Zero-config Next.js, edge functions cho API nhanh |
| Hosting (API jobs) | **Inngest Cloud** | Serverless, retry tự động, không cần manage server |
| Excel export | **xlsx (SheetJS)** | Pure JS, chạy trên edge, không cần server riêng |
| PDF export | **@react-pdf/renderer** | React components → PDF, chạy trên Vercel Functions |
| Maps | **react-native-maps + Mapbox** | Geofencing chính xác, không dùng Google Maps (tính phí) |
| Offline sync | **WatermelonDB** | SQLite local, sync với Supabase khi online |
| i18n | **i18next** | VI / EN, dễ thêm ngôn ngữ |

**Một database duy nhất. Không microservices. Không Kubernetes.**

---

## Step 2 — Database Schema

Xem chi tiết: `replica/schema.sql`

### Tổng quan tables (12 tables)

| table | mục đích |
|-------|---------|
| workspaces | Công ty / nhóm |
| users | Tài khoản + hồ sơ nhân viên |
| workspace_members | Liên kết user ↔ workspace với role |
| shifts | Template ca làm việc |
| shift_assignments | Phân ca cụ thể theo ngày cho từng user |
| attendance_records | Bản ghi chấm công (clock-in/out) |
| leave_requests | Đơn nghỉ phép |
| overtime_requests | Đơn tăng ca |
| salary_configs | Cấu hình lương theo từng nhân viên |
| payroll_records | Bảng lương đã tính theo tháng |
| checkin_rules | Quy tắc chấm công của workspace |
| notifications | Thông báo in-app |
| projects | LATIO-specific: dự án / client |
| project_timesheets | LATIO-specific: giờ làm theo project |

---

## Step 3 — API Routes

### Auth (Supabase Auth — tự động)
```
POST /auth/otp/send       Gửi OTP phone/email                    public
POST /auth/otp/verify     Verify OTP → JWT                       public
POST /auth/google         Google OAuth callback                   public
POST /auth/signout        Hủy session                            authenticated
```

### Workspaces
```
POST   /api/workspaces              Tạo workspace (Manager)        authenticated
GET    /api/workspaces/:id          Thông tin workspace            member
PATCH  /api/workspaces/:id          Cập nhật tên, logo             owner/manager
POST   /api/workspaces/:id/invite   Tạo invite code/link           manager | F08
POST   /api/workspaces/join         Join bằng invite code          authenticated | F07
```

### Users / Employees
```
GET    /api/workspaces/:id/members          Danh sách nhân viên    manager | S16
POST   /api/workspaces/:id/members          Thêm nhân viên         manager
GET    /api/workspaces/:id/members/:uid     Hồ sơ chi tiết         manager | S17
PATCH  /api/workspaces/:id/members/:uid     Cập nhật hồ sơ         manager/self
DELETE /api/workspaces/:id/members/:uid     Vô hiệu hóa            manager
GET    /api/me                              Profile + settings      authenticated | S14
PATCH  /api/me                             Cập nhật profile        authenticated
```

### Shifts
```
GET    /api/workspaces/:id/shifts           Danh sách ca template  member | S09
POST   /api/workspaces/:id/shifts           Tạo ca mới             manager | S18, F04
PATCH  /api/workspaces/:id/shifts/:sid      Sửa ca                 manager
DELETE /api/workspaces/:id/shifts/:sid      Xóa ca                 manager

GET    /api/workspaces/:id/assignments      Lịch phân ca (date range)  member | S09
POST   /api/workspaces/:id/assignments      Phân ca cho nhân viên  manager | F04
PATCH  /api/workspaces/:id/assignments/:aid Đổi ca / hủy          manager
```

### Attendance
```
POST   /api/attendance/checkin              Clock-in               employee | F01, S06
POST   /api/attendance/checkout             Clock-out              employee | S07
GET    /api/attendance/today                Trạng thái hôm nay     employee | S05
GET    /api/workspaces/:id/attendance       Danh sách (admin)      manager | S19
PATCH  /api/workspaces/:id/attendance/:aid  Điều chỉnh chấm công  manager | F05
POST   /api/attendance/sync                 Upload offline queue   employee

GET    /api/attendance/me?month=&year=      Lịch sử cá nhân       employee | S08
```

### Leave
```
GET    /api/leave/balance                   Số ngày phép còn       employee | S11
POST   /api/leave/requests                  Xin nghỉ               employee | S10, F02
GET    /api/leave/requests?uid=&status=     Danh sách đơn          member
PATCH  /api/leave/requests/:rid             Duyệt / từ chối        manager | S20
DELETE /api/leave/requests/:rid             Hủy đơn (pending only) employee
```

### Overtime
```
POST   /api/overtime/requests               Xin tăng ca            employee | S12
GET    /api/overtime/requests               Danh sách              member
PATCH  /api/overtime/requests/:oid          Duyệt / từ chối        manager
```

### Payroll
```
GET    /api/workspaces/:id/salary-configs/:uid    Lấy cấu hình lương    manager
PUT    /api/workspaces/:id/salary-configs/:uid    Cài lương nhân viên   manager | S21
POST   /api/workspaces/:id/payroll/calculate      Trigger tính lương    manager | F06
GET    /api/workspaces/:id/payroll?month=&year=   Bảng lương tháng     manager | S22
GET    /api/payroll/me?month=&year=               Phiếu lương cá nhân  employee | F03
POST   /api/workspaces/:id/payroll/export         Export Excel/PDF      manager | F06
```

### Check-in Rules
```
GET    /api/workspaces/:id/checkin-rules    Lấy quy tắc hiện tại  manager | S23
PUT    /api/workspaces/:id/checkin-rules    Cập nhật quy tắc       manager
POST   /api/workspaces/:id/checkin-rules/qr Tạo QR code mới       manager
```

### Notifications
```
GET    /api/notifications               Danh sách thông báo    authenticated | S13
PATCH  /api/notifications/read-all      Đánh dấu đọc tất cả   authenticated
PATCH  /api/notifications/:nid/read     Đánh dấu đọc 1         authenticated
```

### Projects (LATIO-specific)
```
GET    /api/workspaces/:id/projects     Danh sách project/client   manager
POST   /api/workspaces/:id/projects     Tạo project                manager
GET    /api/projects/:pid/timesheets    Giờ làm theo project       manager
POST   /api/projects/:pid/timesheets    Log giờ cho project        employee
GET    /api/projects/:pid/report        Export timesheet cho client manager
```

### Reports
```
GET    /api/workspaces/:id/reports/attendance   Báo cáo chuyên cần    manager | S24
GET    /api/workspaces/:id/reports/late         Báo cáo đi muộn       manager
GET    /api/workspaces/:id/reports/department   Báo cáo theo phòng ban manager
```

### Background Jobs (Inngest)
```
inngest/payroll.calculate         Mỗi ngày 1/tháng 00:00 ICT — tính lương tự động
inngest/shift.reminder            30 phút trước ca — push notification nhân viên  
inngest/attendance.auto-checkout  Hết giờ ca — auto check-out + penalty nếu bật
inngest/offline.sync              Webhook từ app — xử lý queue chấm công offline
inngest/leave.balance.reset       Mỗi đầu năm — reset số ngày phép
inngest/slack.notify              Trigger khi có sự kiện quan trọng → Slack webhook
```

---

## Step 4 — Những Phần Nguy Hiểm

| vấn đề | giải pháp |
|--------|-----------|
| **Múi giờ (timezone)** | Lưu tất cả `timestamptz` UTC trong DB; convert sang `Asia/Ho_Chi_Minh` chỉ ở UI layer. Ca qua đêm (overnight): `end_time < start_time` → tự động cộng 1 ngày. Dùng `date-fns-tz` nhất quán. |
| **Race condition clock-in** | `UNIQUE(user_id, date)` trên attendance_records cho trạng thái `active`. Nếu 2 request đến cùng lúc, 1 cái fail với constraint violation → retry UI. |
| **Offline queue** | WatermelonDB lưu queue local → sync khi online. Server dùng `idempotency_key` (UUID tạo offline) để chống duplicate. `ON CONFLICT (idempotency_key) DO NOTHING`. |
| **GPS spoofing** | Không thể prevent hoàn toàn. Giảm thiểu: compare GPS + WiFi SSID cùng lúc; flag nếu location accuracy > 100m; log để manager review. |
| **Payroll calculation** | Chạy trong Inngest (retry tự động). Idempotent: ghi vào `payroll_records` với `ON CONFLICT DO UPDATE`. Không tính lại nếu status = `exported`. |
| **Multi-tenancy** | Mọi query đều có `workspace_id` trong WHERE. RLS Postgres enforce thêm 1 lớp. Test isolation với 2 workspace trong CI. |
| **GDPR / data deletion** | Soft delete users (status = inactive). Hard delete theo yêu cầu: cascade xóa attendance, leave, payroll. Log audit_log trước khi xóa. |
| **Push notification delivery** | Dùng Expo Push API + fallback FCM/APNs trực tiếp. Retry 3 lần với exponential backoff trong Inngest. |
| **File upload photo check-in** | Giới hạn 5MB, chỉ JPEG/PNG. Upload thẳng lên Supabase Storage từ client (presigned URL). Server chỉ nhận URL sau khi upload xong. |
| **Realtime admin dashboard** | Supabase Realtime subscribe vào `attendance_records` table. Filter theo `workspace_id`. Debounce update mỗi 2 giây để không flood UI. |

---

## Step 5 — Build Order

### Milestone 0 — Vertical Slice (1 tuần)
**Mục tiêu:** Nhân viên check-in được, manager thấy trong dashboard

Screens: S01, S02, S03, S04, S05, S06, S07, S15
Tables: `workspaces`, `workspace_members`, `shifts`, `shift_assignments`, `attendance_records`
Routes:
- POST /auth/otp/send + verify
- POST /api/workspaces
- POST /api/workspaces/join
- POST /api/attendance/checkin + checkout
- GET /api/attendance/today
- GET /api/workspaces/:id/attendance

**Definition of done:** Manager tạo workspace → Invite nhân viên → Nhân viên check-in GPS → Manager thấy realtime trên web

---

### Milestone 1 — Must-haves: Attendance + Shift (tuần 2–3)
Screens: S08, S09, S16, S17, S18, S19, S23
Tables: `checkin_rules`, thêm WiFi/QR methods vào `attendance_records`
Routes: Tất cả /attendance, /shifts, /assignments, /checkin-rules
Jobs: `shift.reminder`, `attendance.auto-checkout`
Features (from features.csv):
- Check-in GPS, WiFi, QR
- Lịch sử chấm công cá nhân
- Manager chỉnh sửa chấm công
- Báo cáo đi muộn / về sớm
- Phân ca, ca qua đêm

---

### Milestone 2 — Must-haves: Leave + OT (tuần 3–4)
Screens: S10, S11, S12, S20
Tables: `leave_requests`, `overtime_requests`
Routes: /leave, /overtime
Jobs: `leave.balance.reset`
Features:
- Xin nghỉ phép nguyên/nửa ngày
- Theo dõi số ngày phép còn lại
- Manager duyệt nghỉ, duyệt OT
- Push notification duyệt/từ chối

---

### Milestone 3 — Must-haves: Payroll (tuần 4–5)
Screens: S21, S22
Tables: `salary_configs`, `payroll_records`
Routes: /salary-configs, /payroll
Jobs: `payroll.calculate` (Inngest, chạy cuối tháng)
Features:
- Cài lương cơ bản / phụ cấp / khấu trừ
- Tính lương tự động
- Phiếu lương mobile
- Export Excel + PDF

---

### Milestone 4 — LATIO Additions (tuần 5–6)
Screens: S13, S24, + Project screens
Tables: `projects`, `project_timesheets`
Routes: /projects, /reports
Jobs: `slack.notify`
Features:
- Chấm công theo dự án / client
- Timesheet xuất cho client
- Dashboard realtime CEO
- Báo cáo theo phòng ban
- Tích hợp Slack

---

### Milestone 5 — Should-haves (tuần 6–7)
- Offline sync (WatermelonDB)
- Photo check-in
- Google SSO
- Dark mode
- Nhân viên xin đổi ca

---

### Milestone 6 — Polish + Deploy
- `/replica-test` → bug fix
- `/replica-brand` → đặt tên, logo, màu LATIO
- `/replica-deploy` → Vercel + App Store + Play Store

---

## Summary

**Stack:** Expo (mobile) + Next.js (web admin) + Supabase (Postgres + Auth + Realtime + Storage) + Drizzle ORM + Inngest (jobs) + Vercel (hosting)

| metric | value |
|--------|-------|
| Tables | 14 |
| API routes | ~45 |
| Background jobs | 6 |
| Riskiest parts | ① GPS spoofing + offline sync; ② Payroll engine idempotency; ③ Supabase Realtime scale khi nhiều admin online cùng lúc |

**Next step:** `/replica-design` — thiết kế tokens màu sắc, typography, components cho LATIO Attendance App.
