// API client cho mobile — gọi Next.js API routes qua fetch
import { supabase } from "./supabase";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Chưa đăng nhập");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_URL}${path}`, { ...options, headers: { ...headers, ...options.headers } });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error ?? "Lỗi không xác định" };
    return { data: json.data, error: null };
  } catch (e: unknown) {
    return { data: null, error: e instanceof Error ? e.message : "Lỗi mạng" };
  }
}

// ── Workspace ────────────────────────────────────────────────────────────────

export async function createWorkspace(name: string) {
  return apiFetch<{ id: string; name: string; invite_code: string }>("/api/workspaces", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function joinWorkspace(invite_code: string) {
  return apiFetch<{ workspace: { id: string; name: string } }>("/api/workspaces/join", {
    method: "POST",
    body: JSON.stringify({ invite_code }),
  });
}

export async function getCheckinRules(workspaceId: string) {
  return apiFetch<{
    gps_enabled: boolean; gps_lat: number | null; gps_lng: number | null;
    gps_radius_m: number; wifi_enabled: boolean; wifi_ssids: string[];
    qr_enabled: boolean; late_threshold_minutes: number;
  }>(`/api/workspaces/${workspaceId}/checkin-rules`);
}

// ── Attendance ───────────────────────────────────────────────────────────────

export async function getTodayAttendance() {
  return apiFetch<{
    id: string; date: string; clock_in_at: string; clock_out_at: string | null;
    status: string; clock_in_method: string; worked_minutes: number | null;
  } | null>("/api/attendance/today");
}

export async function checkin(params: {
  method: "gps" | "wifi" | "qr" | "manual";
  lat?: number; lng?: number; accuracy?: number;
  wifi_ssid?: string; idempotency_key: string; timestamp?: string;
}) {
  return apiFetch<{ id: string; status: string }>("/api/attendance/checkin", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function checkout(params: {
  attendance_id: string;
  method: "gps" | "wifi" | "qr" | "manual";
  lat?: number; lng?: number;
  idempotency_key: string; timestamp?: string;
}) {
  return apiFetch<{ id: string; worked_minutes: number }>("/api/attendance/checkout", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
