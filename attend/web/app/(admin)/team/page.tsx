// S16 — Team management
import { SEED_MEMBERS, SEED_WORKSPACE } from "@/lib/seed";
import { getInitials, nameToColor } from "@/lib/utils";
import { UserPlus, Copy } from "lucide-react";

const ROLE_LABEL: Record<string, string> = {
  owner: "Chủ sở hữu", admin: "Quản trị", manager: "Quản lý", member: "Nhân viên",
};

export default function TeamPage() {
  return (
    <div className="max-w-[900px] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text">Nhân viên</h1>
          <p className="text-sm text-text-muted mt-0.5">{SEED_MEMBERS.length} thành viên · {SEED_WORKSPACE.name}</p>
        </div>
        <button className="inline-flex items-center gap-2 h-9 px-4 bg-accent text-on-accent rounded-pill text-sm font-semibold hover:bg-accent-hover transition-colors">
          <UserPlus size={16} />
          Mời nhân viên
        </button>
      </div>

      {/* Invite code card */}
      <div className="bg-accent-subtle border border-accent/30 rounded-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">Mã mời workspace</p>
          <p className="text-xs text-text-muted mt-0.5">Chia sẻ mã này để nhân viên tham gia</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono font-bold text-accent text-lg tracking-widest">
            {SEED_WORKSPACE.invite_code}
          </span>
          <button className="p-2 rounded-md hover:bg-accent/10 text-accent transition-colors">
            <Copy size={16} />
          </button>
        </div>
      </div>

      {/* Members table */}
      <div className="bg-bg rounded-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-subtle">
              <th className="text-left px-4 py-3 font-medium text-text-muted">Thành viên</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Vai trò</th>
              <th className="text-left px-4 py-3 font-medium text-text-muted">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {SEED_MEMBERS.map((m) => {
              const color = nameToColor(m.user?.full_name ?? m.user_id);
              return (
                <tr key={m.user_id} className="border-b border-border last:border-0 hover:bg-bg-subtle transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: color }}
                      >
                        {getInitials(m.user?.full_name ?? "?")}
                      </div>
                      <div>
                        <p className="font-medium text-text">{m.user?.full_name ?? m.user_id}</p>
                        <p className="text-xs text-text-muted">{m.user?.email ?? ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-text-muted bg-surface px-2.5 py-1 rounded-full">
                      {ROLE_LABEL[m.role] ?? m.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-checkin">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-xs text-accent hover:underline font-medium">Chi tiết</button>
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
