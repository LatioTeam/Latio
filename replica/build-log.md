# Build Log — LATIO Chấm Công

## Mobile (attend/mobile/)

| ID  | Ngày       | Trạng thái | Màn hình              | Ghi chú |
|-----|------------|------------|----------------------|---------|
| S01 | 2026-11-16 | done       | Onboarding           | Hero + 3 feature rows |
| S02 | 2026-11-16 | done       | Login (OTP)          | 2-step phone→OTP, Google SSO placeholder |
| S03 | 2026-11-16 | done       | Tạo Workspace        | name input, feature list |
| S04 | 2026-11-16 | done       | Join Workspace       | invite code, auto-uppercase |
| S05 | 2026-11-16 | done       | Home Dashboard       | shift card, clock action, quick stats |
| S06 | 2026-11-16 | done       | Check-in GPS         | Haversine + accuracy check, WiFi/QR tabs, late warning |
| S07 | 2026-11-16 | done       | Check-out            | live timer, worked-so-far |
| S08 | 2026-11-16 | done       | Lịch sử chấm công    | FlatList, StatusBadge, method label |
| S09 | 2026-11-16 | partial    | Lịch làm việc         | stub với SEED_SHIFT info |
| S10 | 2026-11-16 | done       | Danh sách nghỉ phép  | FlatList + FAB, balance header |
| S11 | 2026-11-16 | done       | Tạo đơn nghỉ phép    | leave_type pills, date inputs, reason |
| S12 | 2026-11-16 | —          | OT Request           | chưa build (thấp ưu tiên) |
| S13 | 2026-11-16 | done       | Thông báo            | type→icon map, unread highlight, markAllRead |
| S14 | 2026-11-16 | done       | Hồ sơ cá nhân        | avatar lg, role badge, settings menu, sign out |
| S22 | 2026-11-16 | done       | Payroll (nhân viên)  | SEED_PAYROLL display, formatVND |

## Web Admin (attend/web/)

| ID  | Ngày       | Trạng thái | Màn hình              | Ghi chú |
|-----|------------|------------|----------------------|---------|
| —   | 2026-11-17 | done       | Auth Login           | 2-step email→OTP |
| —   | 2026-11-17 | done       | Admin Layout (sidebar) | dark nav-bg sidebar, nav links |
| S15 | 2026-11-17 | done       | Dashboard manager    | stat cards, attendance grid realtime |
| S16 | 2026-11-17 | done       | Quản lý nhân viên    | table, invite code card |
| S18 | 2026-11-17 | done       | Ca làm việc          | shift card, weekly calendar |
| S19 | 2026-11-17 | done       | Chấm công (admin)    | table + pending approval queue |
| S20 | 2026-11-17 | done       | Duyệt nghỉ phép      | pending cards, approve/reject |
| S22 | 2026-11-17 | done       | Bảng lương (admin)   | table, tính lương, xuất Excel button |
| S23 | 2026-11-17 | done       | Cài đặt              | GPS rules, WiFi SSIDs, anti-spoofing toggles |

## Còn lại

- S12 OT Request (mobile) — thấp ưu tiên
- S17 Employee detail (web) — stub
- S21 OT approval (web) — stub
- S24 Export modal (web) — stub
- `/replica-backend` — wire Supabase thay fake data layer
