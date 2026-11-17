// Inngest background job stubs — Milestone 0
// Mỗi function được implement đầy đủ ở Milestone 1
import { inngest } from "./client";
import { createServiceClient } from "@/lib/supabase/server";

// ── Shift Reminder — nhắc nhở check-in trước ca 15 phút ──────────────────────
export const shiftReminder = inngest.createFunction(
  { id: "shift-reminder", name: "Nhắc nhở check-in" },
  { cron: "*/5 * * * *" },  // kiểm tra mỗi 5 phút
  async ({ step }) => {
    // TODO Milestone 1: query workspace_members với shift_id, tính thời gian,
    // gửi push notification qua Expo Push API
    return { status: "stub — not implemented" };
  }
);

// ── Auto Checkout — tự động checkout lúc hết ca nếu quên ───────────────────
export const attendanceAutoCheckout = inngest.createFunction(
  { id: "attendance-auto-checkout", name: "Tự động check-out hết ca" },
  { cron: "0 * * * *" },  // kiểm tra mỗi giờ
  async ({ step }) => {
    // TODO Milestone 1: tìm attendance_records chưa clock_out_at, shift đã kết thúc > 2h,
    // update clock_out_at = shift end, worked_minutes tính tương ứng
    return { status: "stub — not implemented" };
  }
);

// ── Payroll Calculation — tính lương cuối tháng ─────────────────────────────
export const payrollCalculate = inngest.createFunction(
  { id: "payroll-calculate", name: "Tính bảng lương tháng" },
  // Trigger bởi event hoặc cron ngày 1 hàng tháng
  { event: "payroll/calculate.requested" },
  async ({ event, step }) => {
    // TODO Milestone 2: aggregate attendance_records theo workspace + tháng,
    // tính worked_minutes, OT, trừ ngày phép, tạo payroll_records
    return { status: "stub — not implemented", workspaceId: event.data.workspace_id };
  }
);

export const functions = [shiftReminder, attendanceAutoCheckout, payrollCalculate];
