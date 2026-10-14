import { useState } from 'react';
import { Plus, Search, Filter, Calendar, DollarSign, Users } from 'lucide-react';
import { mockProjects } from './mockData';
import type { Project } from './types';

const statusLabel: Record<Project['status'], string> = {
  planning: 'Lên kế hoạch', active: 'Đang chạy', paused: 'Tạm dừng', completed: 'Hoàn thành', cancelled: 'Đã hủy'
};
const statusColor: Record<Project['status'], string> = {
  planning: 'bg-yellow-100 text-yellow-700', active: 'bg-green-100 text-green-700',
  paused: 'bg-gray-100 text-gray-600', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700'
};
const typeLabel: Record<Project['type'], string> = {
  'social-media': 'Social Media', ads: 'Quảng cáo', branding: 'Thương hiệu',
  content: 'Nội dung', seo: 'SEO', other: 'Khác'
};

export function Projects() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = mockProjects.filter(p =>
    (filterStatus === 'all' || p.status === filterStatus) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.clientName.toLowerCase().includes(search.toLowerCase()))
  );

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dự án</h1>
          <p className="text-gray-500 text-sm mt-1">{mockProjects.length} dự án tổng cộng</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Thêm dự án
        </button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tìm dự án, khách hàng..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select className="border border-gray-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="planning">Lên kế hoạch</option>
            <option value="active">Đang chạy</option>
            <option value="paused">Tạm dừng</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(p)}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.clientName}</p>
              </div>
              <div className="flex gap-2 ml-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[p.status]}`}>{statusLabel[p.status]}</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{p.description}</p>

            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Tiến độ</span><span className="font-semibold text-gray-700">{p.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${p.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${p.progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-gray-500">
                <DollarSign size={13} />
                <div>
                  <p className="text-gray-400">Ngân sách</p>
                  <p className="font-medium text-gray-700">{fmt(p.budget)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar size={13} />
                <div>
                  <p className="text-gray-400">Hạn chót</p>
                  <p className="font-medium text-gray-700">{new Date(p.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-gray-500">
                <Users size={13} />
                <div>
                  <p className="text-gray-400">PM</p>
                  <p className="font-medium text-gray-700 truncate">{p.managerName.split(' ').slice(-1)[0]}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{typeLabel[p.type]}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selected.name}</h2>
                <p className="text-gray-500">{selected.clientName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm">{selected.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Trạng thái:</span><span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selected.status]}`}>{statusLabel[selected.status]}</span></div>
                <div><span className="text-gray-500">Loại:</span><span className="ml-2 font-medium">{typeLabel[selected.type]}</span></div>
                <div><span className="text-gray-500">Bắt đầu:</span><span className="ml-2 font-medium">{new Date(selected.startDate).toLocaleDateString('vi-VN')}</span></div>
                <div><span className="text-gray-500">Kết thúc:</span><span className="ml-2 font-medium">{new Date(selected.endDate).toLocaleDateString('vi-VN')}</span></div>
                <div><span className="text-gray-500">Ngân sách:</span><span className="ml-2 font-medium">{fmt(selected.budget)}</span></div>
                <div><span className="text-gray-500">Đã chi:</span><span className="ml-2 font-medium">{fmt(selected.spent)}</span></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-500">Tiến độ</span><span className="font-bold">{selected.progress}%</span></div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${selected.progress}%` }} />
                </div>
              </div>
              <div><span className="text-gray-500 text-sm">PM:</span><span className="ml-2 font-medium text-sm">{selected.managerName}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
