// S22 — Payroll management (admin)
import { SEED_MEMBERS, SEED_PAYROLL } from "@/lib/seed";
import { formatVND } from "@/lib/utils";
import { Download, Calculator } from "lucide-react";

const STATUS_CONFIG = {
  calculating: { label: "Đang tính",  cls: "bg-warning-bg text-warning"  },
  ready:       { label: "Sẵn sàng",   cls: "bg-success-bg text-checkin"  },
  exported:    { label: "Đã xuất",    cls: "bg-surface text-text-muted"   },
};

const memberMap = Object.fromEntries(SEED_MEMBERS.map((m) => [m.user_id, m]));

export default function PayrollPage() {
  const payrolls = SEED_PAYROLL;
  const totalNet = payrolls.reduce((s, p) => s + p.net_salary, 0);
  const readyCount = payrolls.filter((p) => p.status === "ready").length;

  return (
    <div className="max-w-[1000px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Bảng lương</h1>
          <p className="text-sm text-text-muted mt-0.5">Tháng 11/2026</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 h-9 px-4 border border-border text-text rounded-pill text-sm font-medium hover:bg-bg-subtle transition-colors">
            <Calculator size={16} />
            Tính lương
          </button>
          <button className="inline-flex items-center gap-2 h-9 px-4 bg-accent text-on-accent rounded-pill text-sm font-semibold hover:bg-accent-hover transition-colors">
            <Download size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-bg rounded-card border border-border p-4">
          <p className="text-xs text-text-muted">Tổng chi lương</p>
          <p className="text-2xl font-bold text-text mt-1">{formatVND(totalNet)}</p>
        </div>
        <div className="bg-bg rounded-card border border-border p-4">
          <p className="text-xs text-text-muted">Nhân viên sẵn sàng</p>
          <p className="text-2xl font-bold text-checkin mt-1">{readyCount}/{payrolls.length}</p>
        </div>
        <div className="bg-bg rounded-card border border-border p-4">
          <p className="text-xs text-text-muted">Trạng thái</p>
          <p className="text-2xl font-bold text-text mt-1">
            {readyCount === payrolls.length ? "Sẵn sàng xuất" : "Chờ xác nhận"}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg rounded-card border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-subtle">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Nhân viên</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Lương cơ bản</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">OT</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Giảm trừ</th>
              <th className="text-right px-4 py-3 font-medium text-text-muted">Thực nhận</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p) => {
              const member = memberMap[p.user_id];
              const st = STATUS_CONFIG[p.status];
              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-bg-subtle transition-colors">
                  <td className="px-4 py-3 font-medium text-text">{member?.user?.full_name ?? p.user_id}</td>
                  <td className="px-4 py-3 text-right text-text">{formatVND(p.base_salary)}</td>
                  <td className="px-4 py-3 text-right text-text">{formatVND(p.ot_amount)}</td>
                  <td className="px-4 py-3 text-right text-checkout">-{formatVND(p.deductions)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-text">{formatVND(p.net_salary)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${st.cls}`}>
                      {st.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-border bg-bg-subtle">
              <td className="px-4 py-3 font-semibold text-text">Tổng cộng</td>
              <td className="px-4 py-3 text-right font-semibold text-text">
                {formatVND(payrolls.reduce((s, p) => s + p.base_salary, 0))}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-text">
                {formatVND(payrolls.reduce((s, p) => s + p.ot_amount, 0))}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-checkout">
                -{formatVND(payrolls.reduce((s, p) => s + p.deductions, 0))}
              </td>
              <td className="px-4 py-3 text-right font-bold text-accent">
                {formatVND(totalNet)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
