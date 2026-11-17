// GET /api/workspaces/[id]/attendance — Admin: danh sách chấm công workspace
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ok, requireManager } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  const { id: workspaceId } = await params;
  const supabase = await createClient();

  const { error: authErr } = await requireManager(supabase, workspaceId);
  if (authErr) return authErr;

  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(100, parseInt(url.searchParams.get("limit") ?? "50"));
  const offset = (page - 1) * limit;

  const { data: records, count } = await supabase
    .from("attendance_records")
    .select(
      `id, date, clock_in_at, clock_out_at, status, clock_in_method, worked_minutes,
       user_id, workspace_id,
       workspace_members!inner(employee_code, role)`,
      { count: "exact" }
    )
    .eq("workspace_id", workspaceId)
    .eq("date", date)
    .order("clock_in_at", { ascending: true, nullsFirst: false })
    .range(offset, offset + limit - 1);

  return ok({ records: records ?? [], total: count ?? 0, date, page, limit });
}
