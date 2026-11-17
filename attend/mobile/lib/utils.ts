import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Format VND: 15_000_000 → "15.000.000 đ" */
export function formatVND(cents: number): string {
  const dong = Math.round(cents / 100);
  return dong.toLocaleString("vi-VN") + " đ";
}

/** Format worked minutes → "8 giờ 30 phút" */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

/** Format ISO date → "Thứ Hai, 17/11/2026" */
export function formatDateVI(iso: string): string {
  const d = new Date(iso);
  const days = ["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"];
  return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}/${d.getFullYear()}`;
}

/** Format ISO time → "08:35" */
export function formatTime(iso?: string): string {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

/** Relative time → "5 phút trước" */
export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

/** Avatar initials from full name */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Deterministic colour from string (for avatar backgrounds) */
const AVATAR_COLORS = [
  "#1e4fd4","#15803d","#b91c1c","#b45309",
  "#6d28d9","#0369a1","#0f172a","#374151",
];
export function nameToColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

/** Check if today's shift is open: before end_time */
export function isShiftOpen(startTime: string, endTime: string): boolean {
  const now = new Date();
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= start - 60 && cur <= end + 30;
}
