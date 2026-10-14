import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { mockTasks } from './mockData';
import type { Task } from './types';

const priorityLabel: Record<Task['priority'], string> = { low: 'Thấp', medium: 'Trung bình', high: 'Cao', urgent: 'Khẩn cấp' };
const priorityColor: Record<Task['priority'], string> = {
  low: 'bg-gray-100 text-gray-600', medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700', urgent: 'bg-red-100 text-red-700'
};

const columns: { key: Task['status']; label: string; color: string }[] = [
  { key: 'todo', label: 'Chờ thực hiện', color: 'bg-gray-100' },
  { key: 'in-progress', label: 'Đang làm', color: 'bg-blue-100' },
  { key: 'review', label: 'Đang review', color: 'bg-purple-100' },
  { key: 'done', label: 'Hoàn thành', color: 'bg-green-100' },
];

type ViewMode = 'kanban' | 'list';

export function Tasks() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<ViewMode>('kanban');

  const filtered = mockTasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.assigneeName.toLowerCase().includes(search.toLowerCase()) ||
    t.projectName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhiệm vụ</h1>
          <p className="text-gray-500 text-sm mt-1">{mockTasks.length} nhiệm vụ tổng cộng</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Board</button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}>Danh sách</button>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus size={16} /> Thêm task
          </button>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tìm nhiệm vụ..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto">
          {columns.map(col => {
            const tasks = filtered.filter(t => t.status === col.key);
            return (
              <div key={col.key} className="min-w-[220px]">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${col.color}`}>
                  <span className="font-medium text-sm text-gray-700">{col.label}</span>
                  <span className="ml-auto bg-white text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
                </div>
                <div className="space-y-3">
                  {tasks.map(t => (
                    <div key={t.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-2 mb-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${priorityColor[t.priority]}`}>{priorityLabel[t.priority]}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 text-sm leading-snug mb-2">{t.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{t.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {t.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                        <span className="truncate max-w-[100px]">{t.assigneeName.split(' ').slice(-1)[0]}</span>
                        <span>{new Date(t.dueDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <div className="text-center text-sm text-gray-400 py-6 border-2 border-dashed border-gray-200 rounded-xl">
                      Không có task
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Nhiệm vụ</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Dự án</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Người thực hiện</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Ưu tiên</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Trạng thái</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden lg:table-cell">Hạn chót</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-gray-900">{t.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex gap-1 flex-wrap">{t.tags.map(tag => <span key={tag} className="bg-gray-100 rounded px-1">#{tag}</span>)}</p>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-gray-600 max-w-[150px] truncate">{t.projectName}</td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-gray-600">{t.assigneeName}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor[t.priority]}`}>{priorityLabel[t.priority]}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      t.status === 'done' ? 'bg-green-100 text-green-700' :
                      t.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                      t.status === 'review' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {t.status === 'done' ? 'Hoàn thành' : t.status === 'in-progress' ? 'Đang làm' : t.status === 'review' ? 'Review' : 'Chờ'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 hidden lg:table-cell text-gray-600">{new Date(t.dueDate).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
