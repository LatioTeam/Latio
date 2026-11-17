// Core domain types for LATIO Attendance App

export type UUID = string;
export type ISODate = string;      // "2026-11-17"
export type ISODatetime = string;  // "2026-11-17T08:00:00+07:00"

// ── Auth ──────────────────────────────────────────────
export interface User {
  id: UUID;
  email: string;
  full_name: string;
  avatar_url?: string;
  phone?: string;
}

// ── Workspace ─────────────────────────────────────────
export interface Workspace {
  id: UUID;
  name: string;
  slug: string;
  owner_id: UUID;
  timezone: string;        // "Asia/Ho_Chi_Minh"
  invite_code: string;
  created_at: ISODatetime;
}

export type WorkspaceRole = "owner" | "admin" | "manager" | "member";

export interface WorkspaceMember {
  id: UUID;
  workspace_id: UUID;
  user_id: UUID;
  role: WorkspaceRole;
  employee_code?: string;
  department?: string;
  position?: string;
  user?: User;
}

// ── Shifts ────────────────────────────────────────────
export interface Shift {
  id: UUID;
  workspace_id: UUID;
  name: string;
  start_time: string;      // "08:00"
  end_time: string;        // "17:30"
  break_minutes: number;
  color: string;           // hex
  is_overnight: boolean;
}

// ── Attendance ────────────────────────────────────────
export type CheckinMethod = "gps" | "wifi" | "qr" | "manual";
export type AttendanceStatus = "on-time" | "late" | "absent" | "leave" | "ot";

export interface AttendanceRecord {
  id: UUID;
  workspace_id: UUID;
  user_id: UUID;
  date: ISODate;
  clock_in_at?: ISODatetime;
  clock_out_at?: ISODatetime;
  clock_in_method?: CheckinMethod;
  clock_out_method?: CheckinMethod;
  clock_in_lat?: number;
  clock_in_lng?: number;
  clock_out_lat?: number;
  clock_out_lng?: number;
  worked_minutes?: number;
  status: AttendanceStatus;
  note?: string;
  is_flagged?: boolean;
  idempotency_key?: UUID;
}

// ── Leave ─────────────────────────────────────────────
export type LeaveType = "annual" | "sick" | "unpaid" | "other";
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface LeaveRequest {
  id: UUID;
  workspace_id: UUID;
  user_id: UUID;
  leave_type: LeaveType;
  start_date: ISODate;
  end_date: ISODate;
  is_half_day: boolean;
  half_day_period?: "morning" | "afternoon";
  reason: string;
  status: LeaveStatus;
  reviewer_id?: UUID;
  reviewer_note?: string;
  created_at: ISODatetime;
}

export interface LeaveBalance {
  user_id: UUID;
  workspace_id: UUID;
  year: number;
  annual_days: number;
  annual_used: number;
  sick_days: number;
  sick_used: number;
}

// ── Payroll ───────────────────────────────────────────
export type PayrollStatus = "calculating" | "ready" | "exported";

export interface PayrollRecord {
  id: UUID;
  workspace_id: UUID;
  user_id: UUID;
  period_month: number;
  period_year: number;
  worked_days: number;
  leave_days: number;
  ot_hours: number;
  base_salary: number;    // VND (bigint as number)
  ot_amount: number;
  deductions: number;
  net_salary: number;
  status: PayrollStatus;
}

// ── Notifications ─────────────────────────────────────
export type NotificationType = "leave_request" | "leave_approved" | "leave_rejected" | "payroll_ready" | "shift_change" | "reminder";

export interface Notification {
  id: UUID;
  user_id: UUID;
  workspace_id: UUID;
  type: NotificationType;
  title: string;
  body: string;
  reference_id?: UUID;
  is_read: boolean;
  created_at: ISODatetime;
}

// ── Checkin Rules ─────────────────────────────────────
export interface CheckinRules {
  id: UUID;
  workspace_id: UUID;
  gps_enabled: boolean;
  gps_lat?: number;
  gps_lng?: number;
  gps_radius_m: number;
  wifi_enabled: boolean;
  wifi_ssids?: string[];
  qr_enabled: boolean;
  late_threshold_minutes: number;
}
