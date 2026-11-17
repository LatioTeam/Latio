// Drizzle ORM schema — mirrors replica/schema.sql
// Tất cả timestamps lưu UTC (timestamptz), convert sang Asia/Ho_Chi_Minh chỉ ở UI

import {
  pgTable, uuid, text, varchar, integer, smallint, real,
  boolean, timestamp, bigint, uniqueIndex, index,
  pgEnum, check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// ── Enums ─────────────────────────────────────────────────────────────────────

export const workspaceRoleEnum = pgEnum("workspace_role", ["owner", "admin", "manager", "member"]);
export const checkinMethodEnum = pgEnum("checkin_method", ["gps", "wifi", "qr", "manual"]);
export const attendanceStatusEnum = pgEnum("attendance_status", ["on-time", "late", "absent", "leave", "ot"]);
export const leaveTypeEnum = pgEnum("leave_type", ["annual", "sick", "unpaid", "other"]);
export const leaveStatusEnum = pgEnum("leave_status", ["pending", "approved", "rejected", "cancelled"]);
export const payrollStatusEnum = pgEnum("payroll_status", ["calculating", "ready", "exported"]);

// ── workspaces ────────────────────────────────────────────────────────────────

export const workspaces = pgTable("workspaces", {
  id:          uuid("id").primaryKey().defaultRandom(),
  name:        varchar("name", { length: 100 }).notNull(),
  slug:        varchar("slug", { length: 50 }).notNull().unique(),
  owner_id:    uuid("owner_id").notNull(),             // FK → auth.users
  timezone:    varchar("timezone", { length: 50 }).notNull().default("Asia/Ho_Chi_Minh"),
  invite_code: varchar("invite_code", { length: 12 }).notNull().unique(),
  logo_url:    text("logo_url"),
  created_at:  timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at:  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── workspace_members ─────────────────────────────────────────────────────────

export const workspaceMembers = pgTable("workspace_members", {
  id:            uuid("id").primaryKey().defaultRandom(),
  workspace_id:  uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  user_id:       uuid("user_id").notNull(),             // FK → auth.users
  role:          workspaceRoleEnum("role").notNull().default("member"),
  employee_code: varchar("employee_code", { length: 20 }),
  department:    varchar("department", { length: 100 }),
  position:      varchar("position", { length: 100 }),
  base_salary:   bigint("base_salary", { mode: "number" }),  // VND in cents
  joined_at:     timestamp("joined_at", { withTimezone: true }).notNull().defaultNow(),
  is_active:     boolean("is_active").notNull().default(true),
}, (t) => [
  uniqueIndex("workspace_members_workspace_user_idx").on(t.workspace_id, t.user_id),
]);

// ── shifts ────────────────────────────────────────────────────────────────────

export const shifts = pgTable("shifts", {
  id:                  uuid("id").primaryKey().defaultRandom(),
  workspace_id:        uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  name:                varchar("name", { length: 100 }).notNull(),
  start_time:          varchar("start_time", { length: 5 }).notNull(),   // "08:30"
  end_time:            varchar("end_time", { length: 5 }).notNull(),     // "17:30"
  break_minutes:       integer("break_minutes").notNull().default(60),
  color:               varchar("color", { length: 7 }).notNull().default("#1e4fd4"),
  is_overnight:        boolean("is_overnight").notNull().default(false),
  work_days:           integer("work_days").array().notNull().default(sql`'{1,2,3,4,5}'::int[]`),
  late_threshold_min:  integer("late_threshold_min").notNull().default(15),
  ot_start_min:        integer("ot_start_min").notNull().default(30),
  created_at:          timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── checkin_rules ─────────────────────────────────────────────────────────────

export const checkinRules = pgTable("checkin_rules", {
  id:                      uuid("id").primaryKey().defaultRandom(),
  workspace_id:            uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }).unique(),
  gps_enabled:             boolean("gps_enabled").notNull().default(true),
  gps_lat:                 real("gps_lat"),
  gps_lng:                 real("gps_lng"),
  gps_radius_m:            integer("gps_radius_m").notNull().default(150),
  wifi_enabled:            boolean("wifi_enabled").notNull().default(true),
  wifi_ssids:              text("wifi_ssids").array().default(sql`'{}'::text[]`),
  qr_enabled:              boolean("qr_enabled").notNull().default(true),
  qr_secret:               text("qr_secret"),
  late_threshold_minutes:  integer("late_threshold_minutes").notNull().default(10),
  updated_at:              timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── attendance_records ────────────────────────────────────────────────────────

export const attendanceRecords = pgTable("attendance_records", {
  id:                uuid("id").primaryKey().defaultRandom(),
  workspace_id:      uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  user_id:           uuid("user_id").notNull(),
  date:              varchar("date", { length: 10 }).notNull(),       // "2026-11-17"
  clock_in_at:       timestamp("clock_in_at", { withTimezone: true }),
  clock_out_at:      timestamp("clock_out_at", { withTimezone: true }),
  clock_in_method:   checkinMethodEnum("clock_in_method"),
  clock_out_method:  checkinMethodEnum("clock_out_method"),
  clock_in_lat:      real("clock_in_lat"),
  clock_in_lng:      real("clock_in_lng"),
  clock_out_lat:     real("clock_out_lat"),
  clock_out_lng:     real("clock_out_lng"),
  worked_minutes:    integer("worked_minutes"),
  status:            attendanceStatusEnum("status").notNull().default("absent"),
  note:              text("note"),
  is_flagged:        boolean("is_flagged").notNull().default(false),
  idempotency_key:   uuid("idempotency_key").unique(),
  created_at:        timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at:        timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("attendance_records_user_date_idx").on(t.user_id, t.date),
  index("attendance_records_workspace_date_idx").on(t.workspace_id, t.date),
]);

// ── leave_requests ────────────────────────────────────────────────────────────

export const leaveRequests = pgTable("leave_requests", {
  id:              uuid("id").primaryKey().defaultRandom(),
  workspace_id:    uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  user_id:         uuid("user_id").notNull(),
  leave_type:      leaveTypeEnum("leave_type").notNull(),
  start_date:      varchar("start_date", { length: 10 }).notNull(),
  end_date:        varchar("end_date", { length: 10 }).notNull(),
  is_half_day:     boolean("is_half_day").notNull().default(false),
  half_day_period: varchar("half_day_period", { length: 9 }),  // "morning" | "afternoon"
  reason:          text("reason").notNull(),
  status:          leaveStatusEnum("status").notNull().default("pending"),
  reviewer_id:     uuid("reviewer_id"),
  reviewer_note:   text("reviewer_note"),
  created_at:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("leave_requests_workspace_user_idx").on(t.workspace_id, t.user_id),
  index("leave_requests_status_idx").on(t.status),
]);

// ── leave_balances ────────────────────────────────────────────────────────────

export const leaveBalances = pgTable("leave_balances", {
  id:            uuid("id").primaryKey().defaultRandom(),
  workspace_id:  uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  user_id:       uuid("user_id").notNull(),
  year:          smallint("year").notNull(),
  annual_days:   real("annual_days").notNull().default(12),
  annual_used:   real("annual_used").notNull().default(0),
  sick_days:     real("sick_days").notNull().default(5),
  sick_used:     real("sick_used").notNull().default(0),
}, (t) => [
  uniqueIndex("leave_balances_user_year_idx").on(t.user_id, t.year),
]);

// ── salary_configs ────────────────────────────────────────────────────────────

export const salaryConfigs = pgTable("salary_configs", {
  id:              uuid("id").primaryKey().defaultRandom(),
  workspace_id:    uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  user_id:         uuid("user_id").notNull(),
  base_salary:     bigint("base_salary", { mode: "number" }).notNull(),  // cents
  allowance:       bigint("allowance", { mode: "number" }).notNull().default(0),
  ot_rate:         real("ot_rate").notNull().default(1.5),
  effective_from:  varchar("effective_from", { length: 10 }).notNull(),
  created_at:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("salary_configs_user_effective_idx").on(t.user_id, t.effective_from),
]);

// ── payroll_records ───────────────────────────────────────────────────────────

export const payrollRecords = pgTable("payroll_records", {
  id:              uuid("id").primaryKey().defaultRandom(),
  workspace_id:    uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  user_id:         uuid("user_id").notNull(),
  period_month:    smallint("period_month").notNull(),
  period_year:     smallint("period_year").notNull(),
  worked_days:     real("worked_days").notNull().default(0),
  leave_days:      real("leave_days").notNull().default(0),
  ot_hours:        real("ot_hours").notNull().default(0),
  base_salary:     bigint("base_salary", { mode: "number" }).notNull(),
  ot_amount:       bigint("ot_amount", { mode: "number" }).notNull().default(0),
  deductions:      bigint("deductions", { mode: "number" }).notNull().default(0),
  net_salary:      bigint("net_salary", { mode: "number" }).notNull(),
  status:          payrollStatusEnum("status").notNull().default("calculating"),
  notes:           text("notes"),
  created_at:      timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at:      timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("payroll_records_user_period_idx").on(t.user_id, t.period_month, t.period_year),
]);

// ── notifications ─────────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id:            uuid("id").primaryKey().defaultRandom(),
  workspace_id:  uuid("workspace_id").notNull().references(() => workspaces.id, { onDelete: "cascade" }),
  user_id:       uuid("user_id").notNull(),
  type:          varchar("type", { length: 50 }).notNull(),
  title:         varchar("title", { length: 200 }).notNull(),
  body:          text("body").notNull(),
  reference_id:  uuid("reference_id"),
  is_read:       boolean("is_read").notNull().default(false),
  created_at:    timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("notifications_user_read_idx").on(t.user_id, t.is_read),
]);

// ── Type exports ──────────────────────────────────────────────────────────────

export type Workspace          = typeof workspaces.$inferSelect;
export type NewWorkspace       = typeof workspaces.$inferInsert;
export type WorkspaceMember    = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;
export type AttendanceRecord   = typeof attendanceRecords.$inferSelect;
export type NewAttendanceRecord = typeof attendanceRecords.$inferInsert;
export type LeaveRequest       = typeof leaveRequests.$inferSelect;
export type PayrollRecord      = typeof payrollRecords.$inferSelect;
export type Shift              = typeof shifts.$inferSelect;
export type CheckinRules       = typeof checkinRules.$inferSelect;
