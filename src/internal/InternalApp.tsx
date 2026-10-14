import { useState } from 'react';
import { LayoutDashboard, FolderOpen, Users, UserCheck, DollarSign, CheckSquare, BarChart3, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import type { ActiveModule } from './types';
import { Dashboard } from './Dashboard';
import { Projects } from './Projects';
import { Clients } from './Clients';
import { HR } from './HR';
import { Finance } from './Finance';
import { Tasks } from './Tasks';
import { Reports } from './Reports';

const navItems: { key: ActiveModule; label: string; icon: React.ElementType }[] = [
  { key: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { key: 'projects', label: 'Dự án', icon: FolderOpen },
  { key: 'clients', label: 'Khách hàng', icon: Users },
  { key: 'tasks', label: 'Nhiệm vụ', icon: CheckSquare },
  { key: 'hr', label: 'Nhân sự', icon: UserCheck },
  { key: 'finance', label: 'Tài chính', icon: DollarSign },
  { key: 'reports', label: 'Báo cáo', icon: BarChart3 },
];

export function InternalApp() {
  const [active, setActive] = useState<ActiveModule>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeLabel = navItems.find(n => n.key === active)?.label ?? '';

  const renderModule = () => {
    switch (active) {
      case 'dashboard': return <Dashboard />;
      case 'projects': return <Projects />;
      case 'clients': return <Clients />;
      case 'tasks': return <Tasks />;
      case 'hr': return <HR />;
      case 'finance': return <Finance />;
      case 'reports': return <Reports />;
    }
  };

  const Sidebar = () => (
    <aside className="flex flex-col h-full bg-gray-900 text-white">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center font-black text-white text-sm">L</div>
          <div>
            <p className="font-bold text-white text-sm">LATIO</p>
            <p className="text-xs text-gray-400">Internal System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setActive(item.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight size={14} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">G</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Giám đốc</p>
            <p className="text-xs text-gray-400 truncate">latio.agency</p>
          </div>
        </div>
        <a href="/" className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
          <LogOut size={16} /> Thoát về trang chủ
        </a>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-56 shrink-0 flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-56 shrink-0 flex flex-col shadow-xl">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center gap-3 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-800 text-sm sm:text-base">{activeLabel}</h2>
            <p className="text-xs text-gray-400 hidden sm:block">LATIO Agency · Hệ thống quản lý nội bộ</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-gray-700">Xin chào, Giám đốc!</p>
              <p className="text-xs text-gray-400">{new Date().toLocaleDateString('vi-VN')}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">G</div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {renderModule()}
        </div>
      </main>
    </div>
  );
}
