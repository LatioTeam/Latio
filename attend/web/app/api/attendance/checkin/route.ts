// POST /api/attendance/checkin — Check-in GPS/WiFi/QR với idempotency
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkinSchema } from "@/lib/validation/schemas";
import { ok, err, unauthorized, forbidden } from "@/lib/api";

// Haversine formula — tính khoảng cách giữa 2 toạ độ GPS (metres)
function haversineMetres(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  const parsed = checkinSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Input không hợp lệ");

  const { method, lat, lng, accuracy, wifi_ssid, idempotency_key, timestamp } = parsed.data;

  // Lấy workspace member (giả sử user chỉ thuộc 1 workspace active, hoặc frontend gửi workspace_id)
  // Lấy workspace đầu tiên active của user
  const { data: member, error: memberErr } = await supabase
    .from("workspace_members")
    .select("workspace_id, shift_id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (memberErr || !member) return forbidden();

  const workspaceId = member.workspace_id;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD VN timezone handled on client

  // Idempotency check — nếu đã có record với key này, trả lại record cũ
  const { data: existing } = await supabase
    .from("attendance_records")
    .select("*")
    .eq("idempotency_key", idempotency_key)
    .single();

  if (existing) return ok(existing);

  // Kiểm tra đã check-in hôm nay chưa (tránh duplicate ngay cả khi idempotency key khác)
  const { data: todayRecord } = await supabase
    .from("attendance_records")
    .select("id, clock_in_at, clock_out_at")
    .eq("user_id", user.id)
    .eq("workspace_id", workspaceId)
    .eq("date", today)
    .single();

  if (todayRecord && todayRecord.clock_in_at) {
    return err("Bạn đã check-in hôm nay rồi", 409);
  }

  // Lấy checkin_rules của workspace
  const { data: rules } = await supabase
    .from("checkin_rules")
    .select("*")
    .eq("workspace_id", workspaceId)
    .single();

  // Validate GPS nếu method = gps
  if (method === "gps" && rules?.gps_enabled) {
    if (!lat || !lng) return err("Thiếu toạ độ GPS");
    if (accuracy && accuracy > 100) return err("Độ chính xác GPS quá thấp (>100m), có thể đang giả mạo vị trí");

    if (rules.gps_lat && rules.gps_lng) {
      const distance = haversineMetres(lat, lng, rules.gps_lat, rules.gps_lng);
      if (distance > (rules.gps_radius_m ?? 150)) {
        return err(`Bạn đang ở cách văn phòng ${Math.round(distance)}m, ngoài phạm vi cho phép (${rules.gps_radius_m}m)`);
      }
    }
  }

  // Validate WiFi nếu method = wifi
  if (method === "wifi" && rules?.wifi_enabled) {
    if (!wifi_ssid) return err("Thiếu tên WiFi");
    const allowed: string[] = rules.wifi_ssids ?? [];
    if (allowed.length > 0 && !allowed.includes(wifi_ssid)) {
      return err(`Mạng WiFi "${wifi_ssid}" không được phép check-in`);
    }
  }

  // Lấy ca làm việc để tính on-time/late
  let status: "on-time" | "late" | "absent" = "on-time";
  if (member.shift_id) {
    const { data: shift } = await supabase
      .from("shifts")
      .select("start_time, late_threshold_min")
      .eq("id", member.shift_id)
      .single();

    if (shift) {
      const now = new Date();
      const [h, m] = shift.start_time.split(":").map(Number);
      const shiftStart = new Date(now);
      shiftStart.setHours(h, m, 0, 0);
      const lateThreshold = shift.late_threshold_min ?? 10;
      const diffMin = (now.getTime() - shiftStart.getTime()) / 60_000;
      if (diffMin > lateThreshold) status = "late";
    }
  }

  const clockInAt = timestamp ?? new Date().toISOString();

  const { data: record, error: insertErr } = await supabase
    .from("attendance_records")
    .insert({
      workspace_id: workspaceId,
      user_id: user.id,
      date: today,
      clock_in_at: clockInAt,
      clock_in_method: method,
      clock_in_lat: lat ?? null,
      clock_in_lng: lng ?? null,
      status,
      idempotency_key,
    })
    .select()
    .single();

  if (insertErr) {
    // Unique violation (user+date) — trả record hiện có
    if (insertErr.code === "23505") {
      return err("Bạn đã check-in hôm nay rồi", 409);
    }
    return err("Lỗi check-in: " + insertErr.message, 500);
  }

  return ok(record, 201);
}
