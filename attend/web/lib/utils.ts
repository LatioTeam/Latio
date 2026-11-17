import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatVND(cents: number): string {
  return Math.round(cents / 100).toLocaleString("vi-VN") + " đ";
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

export function formatDateVI(iso: string): string {
  const d = new Date(iso);
  const days = ["CN","T2","T3","T4","T5","T6","T7"];
  return `${days[d.getDay()]} ${d.getDate().toString().padStart(2,"0")}/${(d.getMonth()+1).toString().padStart(2,"0")}`;
}

export function formatTime(iso?: string): string {
  if (!iso) return "--:--";
  const d = new Date(iso);
  return `${d.getHours().toString().padStart(2,"0")}:${d.getMinutes().toString().padStart(2,"0")}`;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "#1e4fd4","#15803d","#b91c1c","#b45309",
  "#6d28d9","#0369a1","#0f172a","#374151",
];
export function nameToColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
