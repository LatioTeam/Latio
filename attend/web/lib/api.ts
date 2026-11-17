// API response helpers
import { NextResponse } from "next/server";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized() {
  return err("Chưa đăng nhập", 401);
}

export function forbidden() {
  return err("Không có quyền thực hiện thao tác này", 403);
}

export function notFound(resource = "Không tìm thấy") {
  return err(resource, 404);
}

// Lấy workspace member của user hiện tại, verify họ là member của ws_id
export async function requireMembership(
  supabase: Awaited<ReturnType<typeof import("./supabase/server").createClient>>,
  workspaceId: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, member: null, error: unauthorized() };

  const { data: member } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!member) return { user, member: null, error: forbidden() };
  return { user, member, error: null };
}

// Verify user là manager+ trong workspace
export async function requireManager(
  supabase: Awaited<ReturnType<typeof import("./supabase/server").createClient>>,
  workspaceId: string
) {
  const result = await requireMembership(supabase, workspaceId);
  if (result.error) return result;
  if (!["owner", "admin", "manager"].includes(result.member!.role)) {
    return { ...result, error: forbidden() };
  }
  return { ...result, error: null };
}
