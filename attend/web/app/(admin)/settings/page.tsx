// S23 — Workspace settings
import { SEED_WORKSPACE, SEED_CHECKIN_RULES } from "@/lib/seed";
import { MapPin, Wifi, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-[700px] space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Cài đặt</h1>
        <p className="text-sm text-text-muted mt-0.5">Cấu hình workspace và quy tắc chấm công</p>
      </div>

      {/* Workspace info */}
      <section className="bg-bg rounded-card border border-border p-5 space-y-4">
        <h2 className="text-base font-semibold text-text">Workspace</h2>
        <div className="grid gap-4">
          {[
            { label: "Tên workspace", value: SEED_WORKSPACE.name },
            { label: "Slug",          value: SEED_WORKSPACE.slug },
            { label: "Múi giờ",       value: SEED_WORKSPACE.timezone },
            { label: "Mã mời",        value: SEED_WORKSPACE.invite_code, mono: true },
          ].map(({ label, value, mono }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-text-muted">{label}</span>
              <span className={`text-sm text-text font-medium ${mono ? "font-mono tracking-widest" : ""}`}>
                {value}
              </span>
            </div>
          ))}
        </div>
        <button className="text-sm text-accent font-medium hover:underline">Chỉnh sửa</button>
      </section>

      {/* GPS rules */}
      <section className="bg-bg rounded-card border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <MapPin size={18} className="text-accent" />
          <h2 className="text-base font-semibold text-text">Vị trí GPS</h2>
        </div>
        <div className="grid gap-4">
          {[
            { label: "Vĩ độ",         value: SEED_CHECKIN_RULES.gps_lat.toString() },
            { label: "Kinh độ",       value: SEED_CHECKIN_RULES.gps_lng.toString() },
            { label: "Bán kính",      value: `${SEED_CHECKIN_RULES.gps_radius_m}m` },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <span className="text-sm text-text-muted">{label}</span>
              <span className="text-sm font-mono text-text">{value}</span>
            </div>
          ))}
        </div>
        <button className="text-sm text-accent font-medium hover:underline">Cập nhật vị trí văn phòng</button>
      </section>

      {/* WiFi rules */}
      <section className="bg-bg rounded-card border border-border p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Wifi size={18} className="text-accent" />
          <h2 className="text-base font-semibold text-text">WiFi văn phòng</h2>
        </div>
        <div className="space-y-2">
          {SEED_CHECKIN_RULES.wifi_ssids.map((ssid) => (
            <div key={ssid} className="flex items-center justify-between py-2 px-3 bg-bg-subtle rounded-md">
              <span className="text-sm font-mono text-text">{ssid}</span>
              <button className="text-xs text-checkout hover:underline">Xóa</button>
            </div>
          ))}
        </div>
        <button className="text-sm text-accent font-medium hover:underline">Thêm SSID</button>
      </section>

      {/* Anti-spoofing */}
      <section className="bg-bg rounded-card border border-border p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-accent" />
          <h2 className="text-base font-semibold text-text">Bảo mật chống giả mạo</h2>
        </div>
        {[
          { label: "Yêu cầu độ chính xác GPS ≤ 100m", enabled: true },
          { label: "Chặn chấm công khi GPS và WiFi mâu thuẫn", enabled: false },
          { label: "Yêu cầu chụp ảnh khi check-in thủ công", enabled: false },
        ].map(({ label, enabled }) => (
          <label key={label} className="flex items-center justify-between py-2 cursor-pointer">
            <span className="text-sm text-text">{label}</span>
            <div className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? "bg-accent" : "bg-border"}`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </div>
          </label>
        ))}
      </section>
    </div>
  );
}
