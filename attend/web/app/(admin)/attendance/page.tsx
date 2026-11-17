// S19 — Attendance table + approval queue
import { SEED_MEMBERS, SEED_ATTENDANCE_HISTORY } from "@/lib/seed";
import { formatTime, formatDuration, formatDateVI } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  "on-time": { label: "Đúng giờ",  cls: "bg-success-bg text-checkin"  },
  "late":    { label: "Trễ",       cls: "bg-warning-bg text-warning"   },
  "absent":  { label: "Vắng",      cls: "bg-danger-bg text-checkout"   },
  "leave":   { label: "Nghỉ phép", cls: "bg-surface text-leave"        },
  "ot":      { label: "OT",        cls: "bg-info-bg text-ot"           },
};

const METHOD_LABEL: Record<string, string> = {
  gps: "GPS", wifi: "WiFi", qr: "QR", manual: "Thủ công",
};

const memberMap = Object.fromEntries(SEED_MEMBERS.map((m) => [m.user_id, m]));

export default function AttendancePage() {
  const records = [...SEED_ATTENDANCE_HISTORY].sort(
    (a, b) => new Date(b.clock_in_at).getTime() - new Date(a.clock_in_at).getTime()
  );

  const pending = records.filter((r) => r.status === "absent");

  return (
    <div className="max-w-[1200px] space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Chấm công</h1>
        <p className="text-sm text-text-muted mt-0.5">{records.length} bản ghi · tháng 11/2026</p>
      </div>

      {/* Pending approval */}
      {pending.length > 0 && (
        <div className="bg-warning-bg border border-warning/30 rounded-card p-4">
          <p className="text-sm font-semibold text-warning mb-2">
            Chờ duyệt ({pending.length} bản ghi)
          </p>
          <div className="space-y-2">
            {pending.map((r) => {
              const member = memberMap[r.user_id];
              return (
                <div key={r.id} className="flex items-center justify-between bg-bg rounded-md px-3 py-2">
                  <div className="text-sm text-text">
                    <span className="font-medium">{member?.user?.full_name ?? r.user_id}</span>
                    <span className="text-text-muted"> · {formatDateVI(r.clock_in_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs font-semibold text-checkin hover:underline">Duyệt</button>
                    <button className="text-xs font-semibold text-checkout hover:underline">Từ chối</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-bg rounded-card border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-bg-subtle">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Nhân viên</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Ngày</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Vào</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Ra</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Giờ làm</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Phương thức</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => {
              const member = memberMap[r.user_id];
              const statusCfg = STATUS_CONFIG[r.status] ?? { label: r.status, cls: "bg-surface text-text-muted" };
              return (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-bg-subtle transition-colors">
                  <td className="px-4 py-3 font-medium text-text">
                    {member?.user?.full_name ?? r.user_id}
                  </td>
                  <td className="px-4 py-3 text-text-muted">{formatDateVI(r.clock_in_at)}</td>
                  <td className="px-4 py-3 text-text">{formatTime(r.clock_in_at)}</td>
                  <td className="px-4 py-3 text-text">{formatTime(r.clock_out_at)}</td>
                  <td className="px-4 py-3 text-text">
                    {r.worked_minutes ? formatDuration(r.worked_minutes) : "—"}
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {r.clock_in_method ? (METHOD_LABEL[r.clock_in_method] ?? r.clock_in_method) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.cls}`}>
                      {statusCfg.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
