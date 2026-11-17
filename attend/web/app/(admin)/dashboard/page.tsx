// S15 — Manager Dashboard
import { SEED_MEMBERS, SEED_ATTENDANCE_HISTORY, SEED_WORKSPACE } from "@/lib/seed";
import { formatTime, formatDuration, getInitials, nameToColor } from "@/lib/utils";

const TODAY = "2026-11-17";

const todayRecords = SEED_ATTENDANCE_HISTORY.filter((r) =>
  r.clock_in_at.startsWith(TODAY)
);

const memberStatus = SEED_MEMBERS.map((m) => {
  const rec = todayRecords.find((r) => r.user_id === m.user_id);
  return { ...m, full_name: m.user?.full_name ?? m.user_id, email: m.user?.email ?? "", record: rec ?? null };
});

const checkedIn  = memberStatus.filter((m) => m.record?.clock_in_at && !m.record?.clock_out_at).length;
const checkedOut = memberStatus.filter((m) => m.record?.clock_out_at).length;
const absent     = memberStatus.filter((m) => !m.record).length;

const STATS = [
  { label: "Đã vào",    value: checkedIn,  color: "text-checkin",  bg: "bg-success-bg" },
  { label: "Đã ra",     value: checkedOut, color: "text-checkout", bg: "bg-danger-bg"  },
  { label: "Vắng",      value: absent,     color: "text-absent",   bg: "bg-surface"    },
  { label: "Tổng",      value: SEED_MEMBERS.length, color: "text-accent", bg: "bg-accent-subtle" },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[1200px] space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-text">Tổng quan hôm nay</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Thứ Hai, 17/11/2026 · {SEED_WORKSPACE.name}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div key={s.label} className={`rounded-card p-4 ${s.bg} border border-border`}>
            <p className="text-xs text-text-muted font-medium">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Employee attendance grid */}
      <div>
        <h2 className="text-base font-semibold text-text mb-3">Trạng thái nhân viên</h2>
        <div className="bg-bg rounded-card border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-subtle">
                <th className="text-left px-4 py-3 font-medium text-text-muted">Nhân viên</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Giờ vào</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Giờ ra</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Thời gian</th>
                <th className="text-left px-4 py-3 font-medium text-text-muted">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {memberStatus.map((m) => {
                const color = nameToColor(m.full_name);
                const rec = m.record;
                const isIn  = rec?.clock_in_at && !rec?.clock_out_at;
                const isOut = !!rec?.clock_out_at;

                return (
                  <tr key={m.user_id} className="border-b border-border last:border-0 hover:bg-bg-subtle transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: color }}
                        >
                          {getInitials(m.full_name)}
                        </div>
                        <div>
                          <p className="font-medium text-text">{m.full_name}</p>
                          <p className="text-xs text-text-muted">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text">
                      {rec ? formatTime(rec.clock_in_at) : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 text-text">
                      {rec?.clock_out_at ? formatTime(rec.clock_out_at) : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 text-text">
                      {rec?.worked_minutes ? formatDuration(rec.worked_minutes) : <span className="text-text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {isIn ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success-bg text-checkin">
                          <span className="w-1.5 h-1.5 rounded-full bg-checkin animate-pulse" />
                          Đang làm
                        </span>
                      ) : isOut ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface text-text-muted">
                          Đã về
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-danger-bg text-checkout">
                          Vắng
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/leave",      label: "Duyệt nghỉ phép",    count: 1, urgent: true  },
          { href: "/attendance", label: "Duyệt chấm công",    count: 0, urgent: false },
          { href: "/payroll",    label: "Tính lương tháng 11", count: null, urgent: false },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="bg-bg rounded-card border border-border p-4 hover:border-accent transition-colors flex items-center justify-between group"
          >
            <span className="text-sm font-medium text-text group-hover:text-accent">{item.label}</span>
            {item.count !== null && item.count > 0 && (
              <span className="bg-danger text-on-danger text-xs font-bold px-2 py-0.5 rounded-full">
                {item.count}
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
