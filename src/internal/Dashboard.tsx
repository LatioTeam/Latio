import { TrendingUp, Users, FolderOpen, FileText, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { mockProjects, mockClients, mockEmployees, mockInvoices, mockTasks } from './mockData';

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{sub}</p>
    </div>
  );
}

export function Dashboard() {
  const totalRevenue = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const pendingRevenue = mockInvoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const overdueInvoices = mockInvoices.filter(i => i.status === 'overdue');
  const urgentTasks = mockTasks.filter(t => t.priority === 'urgent' && t.status !== 'done');
  const tasksDone = mockTasks.filter(t => t.status === 'done').length;

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-500 text-sm mt-1">Chào mừng trở lại, LATIO Team! Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Doanh thu tháng này" value={fmt(totalRevenue)} sub={`Chờ thu: ${fmt(pendingRevenue)}`} color="bg-green-500" />
        <StatCard icon={FolderOpen} label="Dự án đang chạy" value={activeProjects.toString()} sub={`${mockProjects.length} dự án tổng`} color="bg-blue-500" />
        <StatCard icon={Users} label="Nhân sự" value={mockEmployees.filter(e => e.status === 'active').toString()} sub={`${mockEmployees.length} nhân viên tổng`} color="bg-purple-500" />
        <StatCard icon={FileText} label="Nhiệm vụ hoàn thành" value={tasksDone.toString()} sub={`${mockTasks.length} nhiệm vụ tổng`} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FolderOpen size={18} className="text-blue-500" />
            Dự án đang hoạt động
          </h2>
          <div className="space-y-4">
            {mockProjects.filter(p => p.status === 'active').map(p => (
              <div key={p.id}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.clientName} · {p.managerName}</p>
                  </div>
                  <span className="text-xs font-semibold text-blue-600">{p.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-500" />
            Cần chú ý
          </h2>
          <div className="space-y-3">
            {overdueInvoices.map(inv => (
              <div key={inv.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Hóa đơn quá hạn #{inv.number}</p>
                  <p className="text-xs text-red-600">{inv.clientName} · {new Intl.NumberFormat('vi-VN').format(inv.total)}đ</p>
                </div>
              </div>
            ))}
            {urgentTasks.map(t => (
              <div key={t.id} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                <Clock size={16} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-orange-800">{t.title}</p>
                  <p className="text-xs text-orange-600">{t.assigneeName} · Hạn: {new Date(t.dueDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            ))}
            {overdueInvoices.length === 0 && urgentTasks.length === 0 && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm text-green-700">Mọi thứ đều ổn định!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-500" />
          Nhiệm vụ gần đây
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 px-3 font-medium text-gray-500">Nhiệm vụ</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Dự án</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Người thực hiện</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Ưu tiên</th>
                <th className="text-left py-2 px-3 font-medium text-gray-500">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {mockTasks.slice(0, 5).map(t => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-medium text-gray-800">{t.title}</td>
                  <td className="py-2.5 px-3 text-gray-600 max-w-[150px] truncate">{t.projectName}</td>
                  <td className="py-2.5 px-3 text-gray-600">{t.assigneeName}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      t.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      t.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {t.priority === 'urgent' ? 'Khẩn cấp' : t.priority === 'high' ? 'Cao' : t.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      t.status === 'done' ? 'bg-green-100 text-green-700' :
                      t.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      t.status === 'review' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status === 'done' ? 'Hoàn thành' : t.status === 'in-progress' ? 'Đang làm' : t.status === 'review' ? 'Review' : 'Chờ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue chart bars */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-500" />
          Doanh thu 6 tháng gần đây (triệu đồng)
        </h2>
        <div className="flex items-end gap-3 h-40">
          {[{ m: 'T5', v: 180 }, { m: 'T6', v: 220 }, { m: 'T7', v: 195 }, { m: 'T8', v: 260 }, { m: 'T9', v: 310 }, { m: 'T10', v: 285 }].map(d => (
            <div key={d.m} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">{d.v}M</span>
              <div className="w-full bg-blue-500 rounded-t-md" style={{ height: `${(d.v / 310) * 120}px` }} />
              <span className="text-xs text-gray-500">{d.m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
