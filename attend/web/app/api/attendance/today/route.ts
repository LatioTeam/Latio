// GET /api/attendance/today — Trạng thái check-in hôm nay của nhân viên
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, unauthorized } from "@/lib/api";

export async function GET(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const today = new Date().toISOString().slice(0, 10);

  const { data: record } = await supabase
    .from("attendance_records")
    .select("id, date, clock_in_at, clock_out_at, status, clock_in_method, worked_minutes, workspace_id")
    .eq("user_id", user.id)
    .eq("date", today)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Trả null nếu chưa check-in — không phải lỗi
  return ok(record ?? null);
}
