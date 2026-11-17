// Zod validation schemas — dùng ở mọi API route input
import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Tên workspace tối thiểu 2 ký tự").max(100),
});

export const joinWorkspaceSchema = z.object({
  invite_code: z.string().length(8, "Mã mời phải đúng 8 ký tự").toUpperCase(),
});

export const checkinSchema = z.object({
  method:           z.enum(["gps", "wifi", "qr", "manual"]),
  lat:              z.number().min(-90).max(90).optional(),
  lng:              z.number().min(-180).max(180).optional(),
  accuracy:         z.number().min(0).optional(),
  wifi_ssid:        z.string().max(64).optional(),
  idempotency_key:  z.string().uuid("idempotency_key phải là UUID"),
  timestamp:        z.string().datetime().optional(),   // ISO8601, dùng cho offline sync
});

export const checkoutSchema = z.object({
  attendance_id:    z.string().uuid(),
  method:           z.enum(["gps", "wifi", "qr", "manual"]),
  lat:              z.number().min(-90).max(90).optional(),
  lng:              z.number().min(-180).max(180).optional(),
  idempotency_key:  z.string().uuid(),
  timestamp:        z.string().datetime().optional(),
});

export const leaveRequestSchema = z.object({
  leave_type:      z.enum(["annual", "sick", "unpaid", "other"]),
  start_date:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  is_half_day:     z.boolean().default(false),
  half_day_period: z.enum(["morning", "afternoon"]).optional(),
  reason:          z.string().min(1).max(500),
}).refine((v) => v.start_date <= v.end_date, {
  message: "Ngày bắt đầu phải trước ngày kết thúc",
  path: ["end_date"],
});

export const leaveReviewSchema = z.object({
  status:        z.enum(["approved", "rejected"]),
  reviewer_note: z.string().max(500).optional(),
});

export const attendanceAdjustSchema = z.object({
  clock_in_at:  z.string().datetime().optional(),
  clock_out_at: z.string().datetime().optional(),
  status:       z.enum(["on-time", "late", "absent", "leave", "ot"]).optional(),
  note:         z.string().max(500).optional(),
});

export const checkinRulesSchema = z.object({
  gps_enabled:            z.boolean(),
  gps_lat:                z.number().min(-90).max(90).optional(),
  gps_lng:                z.number().min(-180).max(180).optional(),
  gps_radius_m:           z.number().min(50).max(2000),
  wifi_enabled:           z.boolean(),
  wifi_ssids:             z.array(z.string().max(64)).max(20),
  qr_enabled:             z.boolean(),
  late_threshold_minutes: z.number().min(0).max(60),
});
