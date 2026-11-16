# Recon Map — LATIO Attendance App
> Clone target: **AtWork** (Timesheet & Time Track: AtWork by VinKaTech)
> Platform: Mobile-first (iOS + Android) + Web admin panel
> Slice: Core attendance loop + salary management (MVP)
> For: **LATIO Agency** — đơn vị truyền thông AI marketing, Việt Nam
> Date: 2026-11-16

---

## Sources

| source | URL | what it gave |
|--------|-----|-------------|
| App Store listing | apps.apple.com/app/id6444318301 | feature list, pricing, version history, screenshots |
| App description | atwork.vinkatech.com | product overview |
| Lac Viet roundup | lacviet.vn/en/phan-mem-cham-cong/ | competitive landscape Vietnam |
| 1Office comparison | 1office.vn/?p=59222 | feature benchmark |

---

## Step 1 — Scope

| item | value |
|------|-------|
| App | AtWork — "Timesheet & Time Track: AtWork" (VinKaTech, Vietnam) |
| Platform | iOS, Android, Web admin |
| Slice (MVP) | Check-in/check-out → shift scheduling → salary calculation → payroll export |
| For | LATIO Agency (~30–50 nhân viên, cần chấm công từ xa, GPS + WiFi, xuất bảng lương) |

**Out of scope (MVP):** Face ID biometrics, Profit/Loss tracking, Lunar calendar, Weather widget

---

## Step 2 — Screen Inventory

| ID | Screen | Route / Entry | Purpose | Key Components | States |
|----|--------|--------------|---------|----------------|--------|
| S01 | Onboarding / Welcome | App launch, cold start | Giới thiệu app, chọn vai trò | Logo, CTA buttons, role picker (Manager / Employee) | First launch, returning user |
| S02 | Register / Login | S01 → Register | Tạo tài khoản hoặc đăng nhập | Phone/email input, OTP field, password, Google SSO | Empty, loading, error, success |
| S03 | Create Workspace | S02 → first-time manager | Tạo nhóm/công ty | Workspace name, industry, timezone, logo upload | Empty, saving |
| S04 | Join Workspace | S02 → first-time employee | Nhân viên join nhóm qua mã/link | Invite code input, QR scan | Empty, invalid code, success |
| S05 | Home / Dashboard | Bottom nav → Home | Tổng quan ngày làm việc | Clock-in button, today's status, quick stats, shift info | Pre-clock-in, clocked-in, day complete |
| S06 | Check-in Screen | S05 → Clock In | Ghi nhận chấm công vào | GPS map, WiFi indicator, QR scanner, photo capture, timestamp | Location valid, out of range, offline |
| S07 | Check-out Screen | S05 → Clock Out | Ghi nhận chấm công ra | Same as S06, work duration summary, notes field | Active shift, missed check-in warning |
| S08 | Attendance Log | Bottom nav → History | Xem lịch sử chấm công cá nhân | Calendar view, daily list, status badges (on-time/late/absent) | Empty month, filtered, loading |
| S09 | Shift Schedule | Bottom nav → Schedule | Xem lịch ca làm việc | Weekly/monthly calendar, shift cards, color coding | No shifts, multi-shift day, overnight shift |
| S10 | Leave Request | S08 / Menu → Leave | Xin nghỉ phép | Leave type picker, date range, half-day toggle, reason textarea | Draft, submitted, approved, rejected |
| S11 | Leave History | S10 → History tab | Xem trạng thái đơn nghỉ | List with status, leave balance summary | Empty, pending, approved/rejected mix |
| S12 | Overtime Request | S05 / Menu → OT | Xin tăng ca | Date, hours, reason, manager approval | Draft, pending, approved |
| S13 | Notifications | Bell icon | Nhận thông báo ca, nghỉ, lương | Notification list, read/unread states | Empty, unread badge |
| S14 | Profile / Settings | Bottom nav → Profile | Thông tin cá nhân, cài đặt | Avatar, name, ID, DOB, emergency contact, language | View, edit mode |
| **ADMIN SCREENS** | | | | | |
| S15 | Admin Dashboard | Web / Admin tab | Tổng quan toàn bộ nhân viên | Stats cards (present/absent/late), team attendance table, alerts | Loading, all present, issues flagged |
| S16 | Employee List | Admin → Employees | Quản lý danh sách nhân viên | Search, filter by department, employee cards | Empty, filtered, bulk select |
| S17 | Employee Detail | S16 → tap employee | Hồ sơ nhân viên chi tiết | Profile info, attendance history, salary info, leave balance | View, edit |
| S18 | Shift Management | Admin → Shifts | Tạo và phân ca làm việc | Calendar, shift creator modal, drag-to-assign | Empty, populated, conflict warning |
| S19 | Attendance Review | Admin → Attendance | Duyệt/chỉnh sửa chấm công | Table view, edit modal, approve/reject buttons, filter by date | Pending reviews, all approved |
| S20 | Leave Approval | Admin → Leave | Duyệt đơn nghỉ phép | Request list, approve/reject with note, batch actions | No pending, mixed queue |
| S21 | Salary Setup | Admin → Payroll Setup | Cài đặt lương cơ bản, phụ cấp | Base salary, allowances, deductions, overtime multiplier | Per-employee form |
| S22 | Payroll Report | Admin → Payroll | Tính và xuất bảng lương | Monthly summary table, per-employee breakdown, export buttons | Calculating, ready, exported |
| S23 | Check-in Rules | Admin → Settings | Cài quy tắc chấm công | GPS radius, WiFi SSID list, QR codes, working hours | Default rules, custom overrides |
| S24 | Reports & Analytics | Admin → Reports | Báo cáo thống kê | Charts (attendance rate, late %, OT hours), date filters, export | Empty period, data loaded |

**Total screens: 24** (14 employee + 10 admin)

---

## Step 3 — User Flows

```
F01  Employee — Chấm công vào đầu ngày
     S05 Home → S06 Check-in (GPS/WiFi verify) → S05 Home (status: đang làm)
     Edge: out of geofence → error + map view
     Edge: offline → queue locally, sync khi có mạng
     Edge: quên check-in hôm qua → báo cáo / xin duyệt

F02  Employee — Xin nghỉ phép
     S05 → S10 Leave Request → fill form → submit → S11 History (pending)
     Edge: nghỉ nửa ngày, nghỉ theo giờ
     Edge: hết phép → warning, vẫn cho submit với lý do

F03  Employee — Xem bảng lương tháng
     S05 → S08 → tháng cụ thể → S22 Payroll detail (read-only)
     Edge: lương chưa được duyệt → trạng thái "đang tính"

F04  Manager — Tạo ca làm việc và phân công
     S15 → S18 Shift Mgmt → tạo shift → drag assign → save → notify employees
     Edge: nhân viên bị conflict ca → highlight warning

F05  Manager — Duyệt chấm công bất thường
     S15 alert → S19 Attendance Review → xem chi tiết → approve/reject edit
     Edge: chỉnh giờ check-in/out thay nhân viên

F06  Manager — Xuất bảng lương
     S15 → S22 Payroll → chọn tháng → review → export Excel/PDF
     Edge: có nhân viên thiếu dữ liệu → highlight, không block export

F07  New employee — Onboarding
     S01 → S02 Register → S04 Join (nhập mã) → S05 Home (empty state)
     Edge: mã sai → retry + contact admin hint

F08  New manager — Setup workspace
     S01 → S02 Register → S03 Create Workspace → S23 Check-in Rules → S18 Shifts → S16 Add Employees
```

**Total flows: 8** | Happy-path clicks: F01 = 3 taps (target to beat: 2 taps)

---

## Step 4 — Components

| Component | Variants | States | Used In |
|-----------|----------|--------|---------|
| ClockButton | Check-in / Check-out | idle, loading, success, error | S05, S06, S07 |
| StatusBadge | on-time, late, absent, leave, OT | — | S08, S15, S19 |
| ShiftCard | employee view / admin view | normal, overnight, conflict | S09, S18 |
| LeaveRequestForm | full-day, half-day, hourly | draft, error | S10 |
| AttendanceCalendar | monthly / weekly | empty, filled, range select | S08, S09, S19 |
| BottomNavBar | 4 tabs: Home, History, Schedule, Profile | active tab indicator | S05–S14 |
| MapGeofence | circle overlay on map | inside, outside, loading | S06, S23 |
| PayrollSummaryCard | employee / admin | pending, calculated, exported | S22 |
| ApprovalQueue | leave / attendance | empty, has items, loading | S19, S20 |
| ExportModal | Excel, PDF, PNG | idle, exporting, done | S22, S24 |
| EmployeeAvatar | small / large, with status dot | online, offline | S16, S17 |
| NotificationItem | action-required / info | unread, read | S13 |

---

## Step 5 — Inferred Data Model

```
Workspace
  id, name, industry, timezone, logo_url, created_at
  evidence: S03 form, S23 settings
  confidence: high

User
  id, workspace_id, role (manager | employee | owner),
  full_name, phone, email, avatar_url,
  employee_id, dob, address, emergency_contact,
  hire_date, status (active | inactive)
  evidence: S14 profile, S17 employee detail, v3.4.5 changelog
  confidence: high

Shift
  id, workspace_id, name, color,
  start_time, end_time, is_overnight,
  days_of_week[], break_duration_min,
  allowance_amount
  evidence: S09, S18, v3.3.x overnight support
  confidence: high

ShiftAssignment
  id, shift_id, user_id, date, status (scheduled | swapped | cancelled)
  evidence: S18 drag-assign, smart shift requests
  confidence: high

AttendanceRecord
  id, user_id, shift_assignment_id,
  clock_in_at, clock_out_at,
  clock_in_method (gps | wifi | qr | photo | manual),
  clock_in_location (lat, lng), wifi_ssid,
  photo_url, notes,
  status (pending | approved | adjusted),
  adjusted_by_user_id, adjusted_at
  evidence: S06, S07, S19, v3.2.x multi-method check-in
  confidence: high

LeaveRequest
  id, user_id, leave_type (annual | sick | unpaid | other),
  start_date, end_date,
  is_half_day, half_day_period (morning | afternoon),
  hours (nullable — hourly leave),
  reason, status (draft | pending | approved | rejected),
  reviewed_by_user_id, review_note, reviewed_at
  evidence: S10, S11, v3.4.3 half-day+hourly leave
  confidence: high

OvertimeRequest
  id, user_id, date, hours,
  reason, status (pending | approved | rejected),
  reviewed_by_user_id
  evidence: S12, salary management
  confidence: medium

SalaryConfig
  id, user_id, effective_from,
  base_type (monthly | daily | hourly),
  base_amount, currency,
  overtime_multiplier,
  allowances (json), deductions (json)
  evidence: S21, v3.4.5 wage effective dates
  confidence: high

PayrollRecord
  id, workspace_id, user_id, period_month, period_year,
  working_days, actual_days, leave_days, ot_hours,
  base_salary, allowances_total, deductions_total,
  ot_pay, net_salary,
  status (calculating | ready | exported),
  exported_at, exported_by
  evidence: S22, export to Excel/PDF
  confidence: high

CheckInRule
  id, workspace_id,
  method (gps | wifi | qr | photo | any),
  gps_lat, gps_lng, gps_radius_m,
  wifi_ssids (json),
  work_start_time, work_end_time,
  late_grace_period_min,
  auto_penalty_enabled
  evidence: S23, v3.2.x auto-penalty
  confidence: high

Notification
  id, user_id, type, title, body,
  reference_type, reference_id,
  is_read, created_at
  evidence: S13, push notification v3.4.5
  confidence: high
```

---

## Step 6 — What Cannot Be Cloned

| item | reason |
|------|--------|
| VinKaTech brand, logo, app name "AtWork" | IP — rebrand as LATIO Attend hoặc tên mới |
| Existing user data / 1M+ jobs database | Data owned by VinKaTech |
| Lunar calendar engine | Licensed or proprietary — dùng thư viện open-source thay thế |
| "Top 1 Vietnam" claim | Marketing asset — không copy |

---

## Step 7 — LATIO-Specific Additions (Beyond AtWork)

Vì LATIO là agency AI marketing, cần thêm:

| Feature | Priority | Lý do |
|---------|----------|-------|
| Chấm công theo dự án / client | must | Agency bill theo project |
| Timesheet xuất cho client | must | Báo cáo giờ làm cho khách hàng |
| Tích hợp Slack/Notion thông báo | should | LATIO dùng Slack nội bộ |
| Multi-location (văn phòng + WFH) | must | Nhân viên hybrid |
| Dashboard realtime cho giám đốc | should | CEO muốn xem nhanh |
| Báo cáo theo phòng ban | should | Phân bổ nguồn lực |

---

## Step 8 — Size Estimate

| dimension | count |
|-----------|-------|
| Screens | 24 |
| Flows | 8 |
| Entities | 10 |
| Hard parts | GPS geofencing realtime, offline sync, payroll calculation engine, push notifications |

**Size: M–L** (6–10 tuần với team 2 dev + 1 designer)

MVP rút gọn (chỉ core loop): **M** (3–4 tuần)

---

## Summary

**Core loop:** Nhân viên mở app → Clock In (GPS/WiFi verify) → làm việc → Clock Out → Manager duyệt → Xuất bảng lương Excel

| metric | value |
|--------|-------|
| Screens | 24 (14 employee, 10 admin) |
| Flows | 8 |
| Entities | 10 |
| Three hardest parts | 1) Offline check-in queue + sync; 2) Payroll calculation engine với OT/allowance/deduction; 3) GPS geofencing chính xác trong tòa nhà |
| Out of scope (MVP) | Face ID, Profit/Loss, Lunar calendar, Weather |

**Next step:** `/replica-architect` — chọn stack, thiết kế schema SQL, lên kế hoạch build.
