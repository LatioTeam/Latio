// Seed data — mirrors real DB shape, used before Supabase is wired
import type {
  User, Workspace, WorkspaceMember, Shift,
  AttendanceRecord, LeaveRequest, LeaveBalance,
  PayrollRecord, Notification, CheckinRules,
} from "@/types";

export const SEED_USER: User = {
  id: "u-001",
  email: "nguyen.van.a@latio.vn",
  full_name: "Nguyễn Văn A",
  phone: "0901234567",
};

export const SEED_MANAGER: User = {
  id: "u-002",
  email: "tran.thi.b@latio.vn",
  full_name: "Trần Thị B",
};

export const SEED_WORKSPACE: Workspace = {
  id: "ws-001",
  name: "LATIO Agency",
  slug: "latio-agency",
  owner_id: "u-002",
  timezone: "Asia/Ho_Chi_Minh",
  invite_code: "LATIO2026",
  created_at: "2026-01-01T00:00:00+07:00",
};

export const SEED_MEMBERS: WorkspaceMember[] = [
  {
    id: "wm-001",
    workspace_id: "ws-001",
    user_id: "u-002",
    role: "owner",
    employee_code: "EMP001",
    department: "Ban Giám Đốc",
    position: "Giám Đốc",
    user: SEED_MANAGER,
  },
  {
    id: "wm-002",
    workspace_id: "ws-001",
    user_id: "u-001",
    role: "member",
    employee_code: "EMP002",
    department: "AI Marketing",
    position: "AI Marketing Specialist",
    user: SEED_USER,
  },
  {
    id: "wm-003",
    workspace_id: "ws-001",
    user_id: "u-003",
    role: "member",
    employee_code: "EMP003",
    department: "Creative",
    position: "Content Creator",
    user: { id: "u-003", email: "le.van.c@latio.vn", full_name: "Lê Văn C" },
  },
];

export const SEED_SHIFT: Shift = {
  id: "sh-001",
  workspace_id: "ws-001",
  name: "Ca Hành Chính",
  start_time: "08:30",
  end_time: "17:30",
  break_minutes: 60,
  color: "#1e4fd4",
  is_overnight: false,
};

export const SEED_CHECKIN_RULES: CheckinRules = {
  id: "cr-001",
  workspace_id: "ws-001",
  gps_enabled: true,
  gps_lat: 10.7769,
  gps_lng: 106.7009,
  gps_radius_m: 150,
  wifi_enabled: true,
  wifi_ssids: ["LATIO-Office", "LATIO-5G"],
  qr_enabled: true,
  late_threshold_minutes: 10,
};

const today = new Date().toISOString().slice(0, 10);

export const SEED_ATTENDANCE_TODAY: AttendanceRecord = {
  id: "ar-today",
  workspace_id: "ws-001",
  user_id: "u-001",
  date: today,
  status: "on-time",
};

export const SEED_ATTENDANCE_HISTORY: AttendanceRecord[] = [
  {
    id: "ar-001", workspace_id: "ws-001", user_id: "u-001",
    date: "2026-11-14", clock_in_at: "2026-11-14T08:35:00+07:00",
    clock_out_at: "2026-11-14T17:45:00+07:00",
    clock_in_method: "gps", clock_out_method: "gps",
    worked_minutes: 550, status: "late",
  },
  {
    id: "ar-002", workspace_id: "ws-001", user_id: "u-001",
    date: "2026-11-13", clock_in_at: "2026-11-13T08:28:00+07:00",
    clock_out_at: "2026-11-13T17:32:00+07:00",
    clock_in_method: "wifi", clock_out_method: "gps",
    worked_minutes: 544, status: "on-time",
  },
  {
    id: "ar-003", workspace_id: "ws-001", user_id: "u-001",
    date: "2026-11-12", status: "absent",
  },
  {
    id: "ar-004", workspace_id: "ws-001", user_id: "u-001",
    date: "2026-11-11", clock_in_at: "2026-11-11T08:30:00+07:00",
    clock_out_at: "2026-11-11T18:00:00+07:00",
    clock_in_method: "qr", worked_minutes: 570, status: "on-time",
  },
];

export const SEED_LEAVE_BALANCE: LeaveBalance = {
  user_id: "u-001",
  workspace_id: "ws-001",
  year: 2026,
  annual_days: 12,
  annual_used: 3,
  sick_days: 5,
  sick_used: 1,
};

export const SEED_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: "lr-001",
    workspace_id: "ws-001",
    user_id: "u-001",
    leave_type: "annual",
    start_date: "2026-12-20",
    end_date: "2026-12-22",
    is_half_day: false,
    reason: "Nghỉ Tết Dương Lịch sớm",
    status: "pending",
    created_at: "2026-11-10T10:00:00+07:00",
  },
];

export const SEED_PAYROLL: PayrollRecord = {
  id: "pr-001",
  workspace_id: "ws-001",
  user_id: "u-001",
  period_month: 11,
  period_year: 2026,
  worked_days: 15,
  leave_days: 1,
  ot_hours: 3.5,
  base_salary: 15_000_000_00,  // 15.000.000 VND in cents
  ot_amount: 525_000_00,
  deductions: 0,
  net_salary: 15_525_000_00,
  status: "ready",
};

export const SEED_NOTIFICATIONS: Notification[] = [
  {
    id: "n-001", user_id: "u-001", workspace_id: "ws-001",
    type: "leave_approved",
    title: "Đơn nghỉ phép đã được duyệt",
    body: "Đơn nghỉ phép từ 20/12 đến 22/12 của bạn đã được Trần Thị B duyệt.",
    reference_id: "lr-001", is_read: false,
    created_at: "2026-11-15T09:00:00+07:00",
  },
  {
    id: "n-002", user_id: "u-001", workspace_id: "ws-001",
    type: "payroll_ready",
    title: "Bảng lương tháng 11 đã sẵn sàng",
    body: "Lương tháng 11/2026 của bạn đã được tính. Nhấn để xem chi tiết.",
    is_read: true,
    created_at: "2026-11-01T08:00:00+07:00",
  },
];
