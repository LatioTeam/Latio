import { useState } from 'react';
import { Plus, Search, Mail, Phone, Briefcase, DollarSign } from 'lucide-react';
import { mockEmployees } from './mockData';
import type { Employee } from './types';

const statusLabel: Record<Employee['status'], string> = { active: 'Đang làm', inactive: 'Đã nghỉ', probation: 'Thử việc' };
const statusColor: Record<Employee['status'], string> = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', probation: 'bg-yellow-100 text-yellow-700' };

const departments = ['Tất cả', ...Array.from(new Set(mockEmployees.map(e => e.department)))];

const avatarColors = ['from-blue-500 to-cyan-500', 'from-purple-500 to-pink-500', 'from-green-500 to-teal-500', 'from-orange-500 to-red-500', 'from-indigo-500 to-blue-500', 'from-pink-500 to-rose-500', 'from-yellow-500 to-orange-500', 'from-teal-500 to-cyan-500'];

export function HR() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('Tất cả');
  const [selected, setSelected] = useState<Employee | null>(null);

  const filtered = mockEmployees.filter(e =>
    (filterDept === 'Tất cả' || e.department === filterDept) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.position.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';
  const totalSalary = mockEmployees.filter(e => e.status !== 'inactive').reduce((s, e) => s + e.salary, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhân sự</h1>
          <p className="text-gray-500 text-sm mt-1">{mockEmployees.filter(e => e.status === 'active').length} nhân viên đang làm việc</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Thêm nhân viên
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Tổng nhân viên</p>
          <p className="text-2xl font-bold text-gray-900">{mockEmployees.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Đang làm việc</p>
          <p className="text-2xl font-bold text-green-600">{mockEmployees.filter(e => e.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Thử việc</p>
          <p className="text-2xl font-bold text-yellow-600">{mockEmployees.filter(e => e.status === 'probation').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">Quỹ lương/tháng</p>
          <p className="text-lg font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(totalSalary / 1000000)}M</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tìm nhân viên, vị trí..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((e, i) => (
          <div key={e.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(e)}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-white font-bold text-lg`}>
                {e.name.split(' ').slice(-1)[0].charAt(0)}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[e.status]}`}>{statusLabel[e.status]}</span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">{e.name}</h3>
            <p className="text-xs text-blue-600 font-medium mb-3">{e.position}</p>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex items-center gap-1.5"><Briefcase size={12} />{e.department}</div>
              <div className="flex items-center gap-1.5"><Mail size={12} className="shrink-0" /><span className="truncate">{e.email}</span></div>
              <div className="flex items-center gap-1.5"><DollarSign size={12} /><span className="font-medium text-gray-700">{fmt(e.salary)}/tháng</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Dept breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Phân bổ theo phòng ban</h2>
        <div className="space-y-3">
          {Array.from(new Set(mockEmployees.map(e => e.department))).map(dept => {
            const count = mockEmployees.filter(e => e.department === dept).length;
            const pct = Math.round((count / mockEmployees.length) * 100);
            return (
              <div key={dept}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{dept}</span>
                  <span className="font-medium text-gray-700">{count} người</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${avatarColors[mockEmployees.indexOf(selected) % avatarColors.length]} flex items-center justify-center text-white font-bold text-xl`}>
                  {selected.name.split(' ').slice(-1)[0].charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-blue-600 font-medium text-sm">{selected.position}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Phòng ban</p><p className="font-medium">{selected.department}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Trạng thái</p><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[selected.status]}`}>{statusLabel[selected.status]}</span></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Ngày vào</p><p className="font-medium">{new Date(selected.joinDate).toLocaleDateString('vi-VN')}</p></div>
                <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500">Lương</p><p className="font-medium text-green-600">{fmt(selected.salary)}</p></div>
              </div>
              <div className="flex items-center gap-2 text-gray-600"><Mail size={15} />{selected.email}</div>
              <div className="flex items-center gap-2 text-gray-600"><Phone size={15} />{selected.phone}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
