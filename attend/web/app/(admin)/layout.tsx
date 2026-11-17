"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Clock, Calendar, FileText,
  DollarSign, Settings, LogOut, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",   icon: LayoutDashboard, label: "Tổng quan" },
  { href: "/team",        icon: Users,           label: "Nhân viên" },
  { href: "/attendance",  icon: Clock,           label: "Chấm công" },
  { href: "/shifts",      icon: Calendar,        label: "Ca làm việc" },
  { href: "/leave",       icon: FileText,        label: "Nghỉ phép" },
  { href: "/payroll",     icon: DollarSign,      label: "Bảng lương" },
  { href: "/settings",    icon: Settings,        label: "Cài đặt" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-bg-subtle overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-nav-bg flex flex-col">
        {/* Logo */}
        <div className="h-[60px] flex items-center gap-3 px-5 border-b border-white/10">
          <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
            <span className="text-on-accent font-bold text-sm">L</span>
          </div>
          <div>
            <p className="text-nav-text font-semibold text-sm leading-tight">LATIO Admin</p>
            <p className="text-nav-text/50 text-xs">Chấm công</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-nav-active-bg text-nav-active"
                    : "text-nav-text hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-md mb-1">
            <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center">
              <span className="text-on-accent text-xs font-bold">M</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-nav-text text-xs font-medium truncate">Manager</p>
              <p className="text-nav-text/50 text-xs truncate">LATIO Agency</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-nav-text/60 hover:text-nav-text hover:bg-white/5 w-full transition-colors">
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-[60px] bg-bg border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
          <Building2 size={16} className="text-text-muted" />
          <span className="text-sm text-text-muted">LATIO Agency</span>
          <div className="ml-auto flex items-center gap-2 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-success inline-block" />
            Realtime
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
