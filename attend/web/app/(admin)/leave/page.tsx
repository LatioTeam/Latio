// S20 — Leave approval queue
import { SEED_MEMBERS } from "@/lib/seed";
import { Check, X } from "lucide-react";

const LEAVE_TYPE_LABEL: Record<string, string> = {
  annual: "Nghỉ phép năm", sick: "Nghỉ bệnh", unpaid: "Không lương", other: "Khác",
};

const MOCK_REQUESTS = [
  {
    id: "lr-001",
    user_id: SEED_MEMBERS[0].user_id,
    leave_type: "annual" as const,
    start_date: "2026-11-20",
    end_date: "2026-11-21",
    days: 2,
    reason: "Việc gia đình cần giải quyết.",
    status: "pending" as const,
    submitted_at: "2026-11-17T09:12:00+07:00",
  },
];

const memberMap = Object.fromEntries(SEED_MEMBERS.map((m) => [m.user_id, m]));

export default function LeavePage() {
  const pending = MOCK_REQUESTS.filter((r) => r.status === "pending");

  return (
    <div className="max-w-[800px] space-y-6">
      <div>
        <h1 className="text-xl font-bold text-text">Duyệt nghỉ phép</h1>
        <p className="text-sm text-text-muted mt-0.5">{pending.length} đơn chờ duyệt</p>
      </div>

      {pending.length === 0 ? (
        <div className="bg-bg rounded-card border border-border p-12 text-center">
          <p className="text-text-muted text-sm">Không có đơn nghỉ phép nào đang chờ duyệt</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map((req) => {
            const member = memberMap[req.user_id];
            return (
              <div key={req.id} className="bg-bg rounded-card border border-border p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-text">{member?.full_name}</p>
                      <span className="text-xs bg-surface text-text-muted px-2 py-0.5 rounded-full">
                        {LEAVE_TYPE_LABEL[req.leave_type]}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">
                      {req.start_date} → {req.end_date} · {req.days} ngày
                    </p>
                    {req.reason && (
                      <p className="text-sm text-text mt-2 italic">"{req.reason}"</p>
                    )}
                    <p className="text-xs text-text-subtle mt-2">
                      Gửi lúc: {new Date(req.submitted_at).toLocaleString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-success-bg text-checkin border border-success/30 rounded-pill text-sm font-medium hover:bg-success hover:text-on-success transition-colors">
                      <Check size={14} />
                      Duyệt
                    </button>
                    <button className="inline-flex items-center gap-1.5 h-9 px-4 bg-danger-bg text-checkout border border-danger/30 rounded-pill text-sm font-medium hover:bg-danger hover:text-on-danger transition-colors">
                      <X size={14} />
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History section */}
      <div>
        <h2 className="text-base font-semibold text-text mb-3">Lịch sử</h2>
        <div className="bg-bg rounded-card border border-border p-6 text-center">
          <p className="text-sm text-text-muted">Chưa có lịch sử duyệt nghỉ phép</p>
        </div>
      </div>
    </div>
  );
}
