import { useState } from 'react';
import { Plus, Search, Phone, Mail, MapPin, Building2, TrendingUp } from 'lucide-react';
import { mockClients } from './mockData';
import type { Client } from './types';

const statusLabel: Record<Client['status'], string> = { active: 'Đang hợp tác', inactive: 'Không hoạt động', prospect: 'Tiềm năng' };
const statusColor: Record<Client['status'], string> = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', prospect: 'bg-blue-100 text-blue-700' };

export function Clients() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = mockClients.filter(c =>
    (filterStatus === 'all' || c.status === filterStatus) &&
    (c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.industry.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Khách hàng</h1>
          <p className="text-gray-500 text-sm mt-1">{mockClients.length} khách hàng trong hệ thống</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Thêm khách hàng
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tìm khách hàng, công ty..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">Tất cả</option>
          <option value="active">Đang hợp tác</option>
          <option value="prospect">Tiềm năng</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Khách hàng</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Lĩnh vực</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Liên hệ</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Doanh thu</th>
              <th className="text-left py-3 px-4 font-medium text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-blue-50/30 cursor-pointer transition-colors" onClick={() => setSelected(c)}>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {c.company.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Building2 size={11} />{c.company}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-gray-600">{c.industry}</td>
                <td className="py-3.5 px-4 hidden md:table-cell">
                  <p className="text-gray-600 flex items-center gap-1"><Phone size={12} />{c.phone}</p>
                  <p className="text-gray-500 flex items-center gap-1 text-xs"><Mail size={11} />{c.email}</p>
                </td>
                <td className="py-3.5 px-4 hidden lg:table-cell">
                  <span className={`font-medium ${c.totalRevenue > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {c.totalRevenue > 0 ? fmt(c.totalRevenue) : 'Chưa có'}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[c.status]}`}>{statusLabel[c.status]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-green-600">{mockClients.filter(c => c.status === 'active').length}</p>
          <p className="text-sm text-gray-500 mt-1">Đang hợp tác</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{mockClients.filter(c => c.status === 'prospect').length}</p>
          <p className="text-sm text-gray-500 mt-1">Tiềm năng</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-gray-700">
            {new Intl.NumberFormat('vi-VN').format(mockClients.reduce((s, c) => s + c.totalRevenue, 0) / 1000000)}M
          </p>
          <p className="text-sm text-gray-500 mt-1">Tổng doanh thu</p>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {selected.company.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-gray-500">{selected.company}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-600"><Building2 size={16} />{selected.industry}</div>
              <div className="flex items-center gap-3 text-gray-600"><Phone size={16} />{selected.phone}</div>
              <div className="flex items-center gap-3 text-gray-600"><Mail size={16} />{selected.email}</div>
              <div className="flex items-center gap-3 text-gray-600"><MapPin size={16} />{selected.address}</div>
              <div className="flex items-center gap-3 text-gray-600"><TrendingUp size={16} />Doanh thu: <span className="font-semibold text-green-600">{fmt(selected.totalRevenue)}</span></div>
              <div className="pt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{statusLabel[selected.status]}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
