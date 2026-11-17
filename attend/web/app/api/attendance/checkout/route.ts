// POST /api/attendance/checkout — Clock-out, tính worked_minutes
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkoutSchema } from "@/lib/validation/schemas";
import { ok, err, unauthorized, forbidden, notFound } from "@/lib/api";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Input không hợp lệ");

  const { attendance_id, method, lat, lng, idempotency_key, timestamp } = parsed.data;

  // Lấy attendance record — phải của chính user này
  const { data: record } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("id", attendance_id)
    .eq("user_id", user.id)
    .single();

  if (!record) return notFound("Không tìm thấy bản ghi chấm công");
  if (record.clock_out_at) return err("Bạn đã check-out rồi", 409);

  const clockOutAt = timestamp ?? new Date().toISOString();
  const clockInTime = new Date(record.clock_in_at).getTime();
  const clockOutTime = new Date(clockOutAt).getTime();
  const workedMinutes = Math.round((clockOutTime - clockInTime) / 60_000);

  // Tính OT nếu có shift
  let newStatus = record.status;
  if (record.status !== "absent" && record.status !== "leave") {
    // Lấy ca làm việc để tính OT
    const { data: member } = await supabase
      .from("workspace_members")
      .select("shift_id")
      .eq("workspace_id", record.workspace_id)
      .eq("user_id", user.id)
      .single();

    if (member?.shift_id) {
      const { data: shift } = await supabase
        .from("shifts")
        .select("end_time, ot_start_min")
        .eq("id", member.shift_id)
        .single();

      if (shift) {
        const now = new Date(clockOutAt);
        const [h, m] = shift.end_time.split(":").map(Number);
        const shiftEnd = new Date(now);
        shiftEnd.setHours(h, m, 0, 0);
        const otThreshold = shift.ot_start_min ?? 30;
        const otMinutes = (now.getTime() - shiftEnd.getTime()) / 60_000;
        if (otMinutes >= otThreshold) newStatus = "ot";
      }
    }
  }

  const { data: updated, error: updateErr } = await supabase
    .from("attendance_records")
    .update({
      clock_out_at: clockOutAt,
      clock_out_method: method,
      clock_out_lat: lat ?? null,
      clock_out_lng: lng ?? null,
      worked_minutes: workedMinutes > 0 ? workedMinutes : 0,
      status: newStatus,
    })
    .eq("id", attendance_id)
    .select()
    .single();

  if (updateErr) return err("Lỗi check-out: " + updateErr.message, 500);

  return ok(updated);
}
