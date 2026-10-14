import { mockProjects, mockInvoices, mockExpenses, mockClients, mockEmployees, mockTasks } from './mockData';

export function Reports() {
  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n);

  const totalRevenue = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalExpenses = mockExpenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
  const profit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

  const projectsByStatus = {
    active: mockProjects.filter(p => p.status === 'active').length,
    completed: mockProjects.filter(p => p.status === 'completed').length,
    planning: mockProjects.filter(p => p.status === 'planning').length,
  };

  const taskCompletion = Math.round((mockTasks.filter(t => t.status === 'done').length / mockTasks.length) * 100);

  const topClients = [...mockClients]
    .filter(c => c.totalRevenue > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);
  const maxRevenue = topClients[0]?.totalRevenue ?? 1;

  const expenseByCategory = mockExpenses.reduce<Record<string, number>>((acc, e) => {
    if (e.status === 'approved') acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const months = ['T5', 'T6', 'T7', 'T8', 'T9', 'T10'];
  const revenueData = [180, 220, 195, 260, 310, 285];
  const expenseData = [120, 145, 130, 170, 200, 185];
  const maxVal = Math.max(...revenueData, ...expenseData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng quan hiệu suất hoạt động LATIO Agency</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tổng doanh thu', value: `${fmt(totalRevenue / 1000000)}M đ`, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Tổng chi phí', value: `${fmt(totalExpenses / 1000000)}M đ`, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Lợi nhuận', value: `${fmt(profit / 1000000)}M đ`, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Biên lợi nhuận', value: `${profitMargin}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(kpi => (
          <div key={kpi.label} className={`${kpi.bg} rounded-xl p-5 border border-white`}>
            <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue vs Expense chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-2">Doanh thu vs Chi phí (triệu đồng)</h2>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500" /><span>Doanh thu</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-red-400" /><span>Chi phí</span></div>
        </div>
        <div className="flex items-end gap-4 h-48">
          {months.map((m, i) => (
            <div key={m} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-1 items-end">
                <div className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(revenueData[i] / maxVal) * 160}px` }} />
                <div className="flex-1 bg-red-400 rounded-t" style={{ height: `${(expenseData[i] / maxVal) * 160}px` }} />
              </div>
              <span className="text-xs text-gray-500">{m}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top khách hàng theo doanh thu</h2>
          <div className="space-y-4">
            {topClients.map((c, i) => (
              <div key={c.id}>
                <div className="flex justify-between text-sm mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 w-4">#{i + 1}</span>
                    <span className="font-medium text-gray-800">{c.company}</span>
                  </div>
                  <span className="font-semibold text-gray-700">{fmt(c.totalRevenue / 1000000)}M</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(c.totalRevenue / maxRevenue) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tình trạng dự án & nhiệm vụ</h2>
          <div className="space-y-4">
            {[
              { label: 'Dự án đang chạy', value: projectsByStatus.active, total: mockProjects.length, color: 'bg-green-500' },
              { label: 'Dự án hoàn thành', value: projectsByStatus.completed, total: mockProjects.length, color: 'bg-blue-500' },
              { label: 'Dự án lên kế hoạch', value: projectsByStatus.planning, total: mockProjects.length, color: 'bg-yellow-500' },
              { label: 'Tỉ lệ hoàn thành task', value: taskCompletion, total: 100, color: 'bg-purple-500', isPercent: true },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.isPercent ? `${item.value}%` : `${item.value}/${item.total}`}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.isPercent ? item.value : (item.value / item.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Phân tích chi phí theo danh mục</h2>
          <div className="space-y-3">
            {Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => {
              const pct = Math.round((amount / totalExpenses) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{cat}</span>
                    <span className="font-semibold text-gray-800">{fmt(amount / 1000000)}M ({pct}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* HR summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tóm tắt nhân sự</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Tổng nhân viên', value: mockEmployees.length },
              { label: 'Đang làm việc', value: mockEmployees.filter(e => e.status === 'active').length },
              { label: 'Thử việc', value: mockEmployees.filter(e => e.status === 'probation').length },
              { label: 'Quỹ lương/tháng', value: `${fmt(mockEmployees.filter(e => e.status !== 'inactive').reduce((s, e) => s + e.salary, 0) / 1000000)}M` },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
