// POST /api/workspaces — Tạo workspace mới
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createWorkspaceSchema } from "@/lib/validation/schemas";
import { ok, err, unauthorized } from "@/lib/api";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";  // loại bỏ I,O,0,1 dễ nhầm
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return unauthorized();

  const body = await request.json().catch(() => null);
  const parsed = createWorkspaceSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.errors[0]?.message ?? "Input không hợp lệ");

  const { name } = parsed.data;
  const baseSlug = slugify(name);

  // Thử insert, nếu slug trùng thì thêm suffix
  let slug = baseSlug;
  let attempt = 0;
  while (attempt < 5) {
    const { data: workspace, error } = await supabase
      .from("workspaces")
      .insert({
        name,
        slug: attempt === 0 ? slug : `${baseSlug}-${attempt}`,
        owner_id: user.id,
        invite_code: generateInviteCode(),
      })
      .select()
      .single();

    if (!error && workspace) {
      // Thêm owner vào workspace_members
      await supabase.from("workspace_members").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
        employee_code: "EMP001",
      });

      // Tạo checkin_rules mặc định
      await supabase.from("checkin_rules").insert({
        workspace_id: workspace.id,
        gps_enabled: true,
        gps_radius_m: 150,
        wifi_enabled: true,
        wifi_ssids: [],
        qr_enabled: true,
        late_threshold_minutes: 10,
      });

      return ok(workspace, 201);
    }

    if (error?.code !== "23505") {  // unique violation
      return err("Lỗi tạo workspace: " + error?.message, 500);
    }
    attempt++;
  }

  return err("Không thể tạo workspace lúc này, thử lại sau", 500);
}
