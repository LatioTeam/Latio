// S18 — Shift management
import { SEED_SHIFT } from "@/lib/seed";
import { Plus } from "lucide-react";

const DAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function ShiftsPage() {
  return (
    <div className="max-w-[800px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Ca làm việc</h1>
          <p className="text-sm text-text-muted mt-0.5">Quản lý ca và lịch làm việc</p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 bg-accent text-on-accent rounded-pill text-sm font-semibold hover:bg-accent-hover transition-colors">
          <Plus size={16} />
          Tạo ca mới
        </button>
      </div>

      {/* Existing shift */}
      <div className="bg-bg rounded-card border border-border p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-text">{SEED_SHIFT.name}</h3>
            <p className="text-sm text-text-muted mt-0.5">
              {SEED_SHIFT.start_time} – {SEED_SHIFT.end_time}
            </p>
          </div>
          <span className="text-xs bg-success-bg text-checkin px-2.5 py-1 rounded-full font-medium">
            Đang áp dụng
          </span>
        </div>

        {/* Days */}
        <div className="flex gap-2 mb-4">
          {DAYS_VI.map((d, i) => {
            const active = SEED_SHIFT.work_days.includes(i + 1);
            return (
              <div
                key={d}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold
                  ${active ? "bg-accent text-on-accent" : "bg-surface text-text-muted"}`}
              >
                {d}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-muted text-xs">Trễ được phép</p>
            <p className="text-text font-medium">{SEED_SHIFT.late_threshold_min} phút</p>
          </div>
          <div>
            <p className="text-text-muted text-xs">OT bắt đầu sau</p>
            <p className="text-text font-medium">{SEED_SHIFT.ot_start_min} phút</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="text-sm text-accent font-medium hover:underline">Chỉnh sửa</button>
          <span className="text-border">·</span>
          <button className="text-sm text-text-muted hover:text-checkout hover:underline">Xóa</button>
        </div>
      </div>

      {/* Weekly calendar placeholder */}
      <div>
        <h2 className="text-base font-semibold text-text mb-3">Lịch tuần này</h2>
        <div className="bg-bg rounded-card border border-border overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS_VI.map((d) => (
              <div key={d} className="p-3 text-center text-xs font-medium text-text-muted border-r border-border last:border-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {DAYS_VI.map((d, i) => {
              const isWorkDay = SEED_SHIFT.work_days.includes(i + 1);
              return (
                <div key={d} className={`p-3 min-h-[80px] border-r border-border last:border-0 ${isWorkDay ? "" : "bg-bg-subtle"}`}>
                  {isWorkDay && (
                    <div className="text-xs bg-accent-subtle text-accent rounded px-1.5 py-1 font-medium">
                      {SEED_SHIFT.start_time}–{SEED_SHIFT.end_time}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
