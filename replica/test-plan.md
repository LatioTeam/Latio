# Test Plan — LATIO Attend

> Skill: `/replica-test` | Date: 2026-11-17 | Based on: `replica/recon.md` flows F01–F08

---

## Coverage Summary

| Flow | Description | Cases | Automated |
|------|-------------|-------|-----------|
| F01 | Employee check-in | 12 | 7 |
| F02 | Leave request | 10 | 5 |
| F03 | View payroll | 5 | 3 |
| F04 | Manager create shift | 7 | 4 |
| F05 | Manager approve attendance | 8 | 5 |
| F06 | Manager export payroll | 6 | 3 |
| F07 | New employee onboarding | 8 | 5 |
| F08 | Manager workspace setup | 7 | 4 |
| **API unit tests** | Routes trực tiếp | 20 | 20 |
| **Total** | | **83** | **56** |

---

## F01 — Employee Check-in

### Happy path
| ID | Steps | Expected |
|----|-------|----------|
| F01-H1 | Mở app → Home → tap "Check In" → GPS trong geofence → confirm | Status "đang làm", timestamp hiển thị, nút đổi thành "Check Out" |
| F01-H2 | Check-in bằng WiFi đúng SSID | Thành công, method = "wifi" lưu vào DB |
| F01-H3 | Check-in offline → kết nối mạng → sync | Record xuất hiện sau khi online, status = on-time |

### Edge cases
| ID | Scenario | Expected |
|----|----------|----------|
| F01-E1 | GPS ngoài geofence (> radius_m) | Lỗi "Bạn đang cách văn phòng Xm" + hiển thị bản đồ |
| F01-E2 | GPS accuracy > 100m (giả mạo vị trí) | Lỗi "Độ chính xác GPS quá thấp" |
| F01-E3 | WiFi SSID không trong danh sách | Lỗi "Mạng WiFi không được phép" |
| F01-E4 | Tap "Check In" 2 lần liên tục | Chỉ tạo 1 record (idempotency key) |
| F01-E5 | Check-in lần 2 trong cùng ngày | Error 409 "Đã check-in hôm nay" |
| F01-E6 | Offline hoàn toàn, không sync | Queue local, hiển thị badge "Đang chờ sync" |
| F01-E7 | Vào sau giờ làm > late_threshold | Status = "late", badge màu vàng |
| F01-E8 | Refresh trang giữa chừng (web) | Session giữ nguyên, trạng thái hôm nay không mất |
| F01-E9 | Session hết hạn khi check-in | Redirect đến login, sau đó redirect lại |

### Negative cases
| ID | Scenario | Expected |
|----|----------|----------|
| F01-N1 | POST /api/attendance/checkin không có auth header | 401 Unauthorized |
| F01-N2 | POST /api/attendance/checkin thiếu idempotency_key | 400 "idempotency_key phải là UUID" |
| F01-N3 | User không thuộc workspace nào | 403 Forbidden |

---

## F02 — Leave Request

### Happy path
| ID | Steps | Expected |
|----|-------|----------|
| F02-H1 | Menu → Nghỉ phép → Chọn loại (annual) → Chọn ngày → Gửi | Status "pending", hiển thị trong History |
| F02-H2 | Nghỉ nửa ngày buổi sáng | `is_half_day=true`, `half_day_period="morning"` |

### Edge cases
| ID | Scenario | Expected |
|----|----------|----------|
| F02-E1 | Ngày kết thúc < ngày bắt đầu | Lỗi Zod "Ngày bắt đầu phải trước..." |
| F02-E2 | Lý do để trống | Lỗi "Vui lòng nhập lý do" |
| F02-E3 | Lý do 500+ ký tự | Truncate hoặc lỗi validation |
| F02-E4 | Nghỉ trùng đơn đã pending | Warning — hiển thị conflict |
| F02-E5 | Submit 2 lần liên tục (double click) | Chỉ 1 record tạo ra |

### Negative cases
| ID | Scenario | Expected |
|----|----------|----------|
| F02-N1 | Không đăng nhập | 401 |
| F02-N2 | leave_type không hợp lệ | 400 |

---

## F03 — View Payroll

| ID | Scenario | Expected |
|----|----------|----------|
| F03-H1 | Tab Lương → chọn tháng hiện tại | Hiển thị bảng lương chi tiết |
| F03-H2 | Tháng chưa có dữ liệu | Empty state "Chưa có bảng lương tháng này" |
| F03-E1 | Lương đang tính (status=calculating) | Badge "Đang tính..." không có số |
| F03-E2 | Scroll số lương rất lớn (1,234,567,890 VND) | Không overflow, format đúng |
| F03-N1 | Employee xem lương người khác | 403 / data không trả về |

---

## F04 — Manager Create Shift

| ID | Scenario | Expected |
|----|----------|----------|
| F04-H1 | Admin → Ca làm việc → Thêm ca → Điền thông tin → Lưu | Ca hiện trong danh sách |
| F04-H2 | Assign ca cho nhân viên | Member có shift_id, hiển thị trong calendar |
| F04-E1 | Tên ca trùng | Warning hoặc cho phép (không unique-constrained) |
| F04-E2 | start_time > end_time (ca qua đêm) | Chấp nhận, đánh dấu "ca đêm" |
| F04-E3 | Xoá ca đang có nhân viên assigned | Warning trước khi xoá |
| F04-N1 | Employee tạo ca | 403 Forbidden |

---

## F05 — Manager Approve Attendance

| ID | Scenario | Expected |
|----|----------|----------|
| F05-H1 | Admin → Chấm công → Duyệt record pending | Status = approved |
| F05-H2 | Admin chỉnh sửa clock_in_at | Giờ cập nhật, worked_minutes tính lại |
| F05-E1 | Duyệt record đã approved | Nút disabled / 409 |
| F05-E2 | Chỉnh giờ về tương lai | Lỗi validation |
| F05-E3 | Manager ở workspace khác duyệt | 403 Forbidden |
| F05-N1 | Employee tự duyệt record của mình | 403 Forbidden |

---

## F06 — Manager Export Payroll

| ID | Scenario | Expected |
|----|----------|----------|
| F06-H1 | Admin → Bảng lương → Xuất Excel | File .xlsx download |
| F06-H2 | Xuất PDF | File .pdf download |
| F06-E1 | Nhân viên thiếu dữ liệu giờ làm | Highlight row, không block export |
| F06-E2 | Tháng không có attendance records | Export file trống với header |
| F06-N1 | Employee gọi export | 403 |

---

## F07 — New Employee Onboarding

| ID | Scenario | Expected |
|----|----------|----------|
| F07-H1 | Mở app → Register → Nhập email → OTP → Join workspace bằng code | Home screen empty state |
| F07-E1 | Mã mời sai (7 ký tự) | Lỗi "Mã mời phải đúng 8 ký tự" |
| F07-E2 | Mã mời đúng format nhưng không tồn tại | 404 "Mã mời không tồn tại" |
| F07-E3 | Mã mời chứa chữ thường | Auto uppercase (Zod `.toUpperCase()`) |
| F07-E4 | Join workspace đã tham gia | 409 "Đã là thành viên" |
| F07-E5 | Join workspace bị deactivate rồi join lại | Reactivate thành công |
| F07-N1 | Không có session khi join | 401 |

---

## F08 — Manager Workspace Setup

| ID | Scenario | Expected |
|----|----------|----------|
| F08-H1 | Register → Create workspace → Điền tên | Workspace tạo, owner member, default checkin_rules |
| F08-H2 | Cài GPS rules (toạ độ + radius) | Rules lưu, GET trả về đúng |
| F08-E1 | Tên workspace 1 ký tự | Zod lỗi "tối thiểu 2 ký tự" |
| F08-E2 | Tên workspace chứa emoji | Slugify xử lý → slug hợp lệ |
| F08-E3 | Tạo 2 workspace tên giống nhau | Slug thêm suffix -1, -2 |
| F08-N1 | Employee tạo workspace | Cho phép (không restrict) — cần spec lại |

---

## API Unit Tests (hệ thống)

| ID | Route | Scenario | Expected |
|----|-------|----------|----------|
| A01 | POST /api/workspaces | Valid input | 201 + workspace object |
| A02 | POST /api/workspaces | Không auth | 401 |
| A03 | POST /api/workspaces/join | Valid invite_code | 201 |
| A04 | POST /api/workspaces/join | Code sai | 404 |
| A05 | POST /api/workspaces/join | Join 2 lần | 409 |
| A06 | POST /api/attendance/checkin | Valid GPS | 201 + record |
| A07 | POST /api/attendance/checkin | Same idempotency_key | 200 + existing record |
| A08 | POST /api/attendance/checkin | Duplicate ngày | 409 |
| A09 | POST /api/attendance/checkin | Thiếu idempotency_key | 400 |
| A10 | POST /api/attendance/checkin | accuracy > 100 | 400 spoofing error |
| A11 | POST /api/attendance/checkout | Valid | 200 + worked_minutes |
| A12 | POST /api/attendance/checkout | Đã checkout | 409 |
| A13 | GET /api/attendance/today | Chưa checkin | 200 + null data |
| A14 | GET /api/attendance/today | Đã checkin | 200 + record |
| A15 | GET /api/workspaces/[id]/attendance | Manager | 200 + list |
| A16 | GET /api/workspaces/[id]/attendance | Employee | 403 |
| A17 | GET /api/workspaces/[id]/checkin-rules | Member | 200 + rules |
| A18 | PUT /api/workspaces/[id]/checkin-rules | Manager | 200 + updated |
| A19 | PUT /api/workspaces/[id]/checkin-rules | Employee | 403 |
| A20 | PUT /api/workspaces/[id]/checkin-rules | Invalid gps_radius_m < 50 | 400 |

---

## Manual Test Checklist (không tự động hoá được)

- [ ] OTP email thực sự gửi đến inbox
- [ ] Google SSO flow end-to-end
- [ ] Expo push notifications trên thiết bị thật
- [ ] GPS trên thiết bị thật trong tòa nhà
- [ ] Export Excel mở được trong Microsoft Excel
- [ ] Supabase Realtime — mở 2 tab, checkin tab 1, tab 2 cập nhật ngay
- [ ] Session expire sau thời gian dài → redirect đúng
- [ ] Mobile: dark mode render đúng
- [ ] Mobile: accessibility (VoiceOver iOS / TalkBack Android)

---

## Môi trường Test

```
Dev server: http://localhost:3000
Test framework: Playwright + @axe-core/playwright
Seed: lib/seed.ts (Zustand fake data layer)
API test: Supertest hoặc fetch trực tiếp với mock Supabase
```
