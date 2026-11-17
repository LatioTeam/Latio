// GET + PUT /api/workspaces/[id]/checkin-rules — CRUD checkin rules
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkinRulesSchema } from "@/lib/validation/schemas";
import { ok, err, requireMembership, requireManager } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const { id: workspaceId } = await params;
  const supabase = await createClient();

  const { error: authErr } = await requireMembership(supabase, workspaceId);
  if (authErr) return authErr;

  const { data: rules } = await supabase
    .from("checkin_rules")
    .select("*")
    .eq("workspace_id", workspaceId)
    .single();

  return ok(rules);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id: workspaceId } = await params;
  const supabase = await createClient();

  const { error: authErr } = await requireManager(supabase, workspaceId);
  if (authErr) return authErr;

  const body = await request.json().catch(() => null);
  const parsed = checkinRulesSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Input không hợp lệ");

  const { data: updated, error: updateErr } = await supabase
    .from("checkin_rules")
    .update(parsed.data)
    .eq("workspace_id", workspaceId)
    .select()
    .single();

  if (updateErr) return err("Lỗi cập nhật rules: " + updateErr.message, 500);

  return ok(updated);
}
