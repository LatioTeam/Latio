// POST /api/workspaces/join — Tham gia workspace bằng invite code
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { joinWorkspaceSchema } from "@/lib/validation/schemas";
import { ok, err, unauthorized } from "@/lib/api";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  const parsed = joinWorkspaceSchema.safeParse(body);
  if (!parsed.success) return err("Mã mời không hợp lệ");

  const { invite_code } = parsed.data;

  // Tìm workspace theo invite_code
  const { data: workspace, error: wsError } = await supabase
    .from("workspaces")
    .select("id, name, slug")
    .eq("invite_code", invite_code)
    .single();

  if (wsError || !workspace) return err("Mã mời không tồn tại hoặc đã hết hạn", 404);

  // Kiểm tra đã là thành viên chưa
  const { data: existing } = await supabase
    .from("workspace_members")
    .select("id, is_active")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    if (existing.is_active) return err("Bạn đã là thành viên của workspace này", 409);
    // Reactivate nếu đã bị vô hiệu hoá
    await supabase
      .from("workspace_members")
      .update({ is_active: true })
      .eq("id", existing.id);
    return ok({ workspace, rejoined: true });
  }

  // Thêm vào workspace
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "member",
    });

  if (memberError) return err("Lỗi tham gia workspace: " + memberError.message, 500);

  return ok({ workspace, joined: true }, 201);
}
