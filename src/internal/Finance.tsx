import { useState } from 'react';
import { Plus, FileText, TrendingUp, TrendingDown, DollarSign, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { mockInvoices, mockExpenses } from './mockData';
import type { Invoice, Expense } from './types';

const invStatusLabel: Record<Invoice['status'], string> = { draft: 'Nháp', sent: 'Đã gửi', paid: 'Đã thu', overdue: 'Quá hạn', cancelled: 'Đã hủy' };
const invStatusColor: Record<Invoice['status'], string> = {
  draft: 'bg-gray-100 text-gray-600', sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700', overdue: 'bg-red-100 text-red-700', cancelled: 'bg-gray-100 text-gray-400'
};
const expStatusLabel: Record<Expense['status'], string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Từ chối' };
const expStatusColor: Record<Expense['status'], string> = { pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

type Tab = 'invoices' | 'expenses';

export function Finance() {
  const [tab, setTab] = useState<Tab>('invoices');
  const [selected, setSelected] = useState<Invoice | null>(null);

  const fmt = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

  const totalPaid = mockInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0);
  const totalPending = mockInvoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.total, 0);
  const totalOverdue = mockInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.total, 0);
  const totalExpenses = mockExpenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tài chính</h1>
          <p className="text-gray-500 text-sm mt-1">Quản lý hóa đơn và chi phí</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Plus size={16} /> {tab === 'invoices' ? 'Tạo hóa đơn' : 'Thêm chi phí'}
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><CheckCircle size={16} className="text-green-500" /><span className="text-xs text-gray-500">Đã thu</span></div>
          <p className="text-xl font-bold text-green-600">{new Intl.NumberFormat('vi-VN').format(totalPaid / 1000000)}M</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><Clock size={16} className="text-blue-500" /><span className="text-xs text-gray-500">Chờ thu</span></div>
          <p className="text-xl font-bold text-blue-600">{new Intl.NumberFormat('vi-VN').format(totalPending / 1000000)}M</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><AlertCircle size={16} className="text-red-500" /><span className="text-xs text-gray-500">Quá hạn</span></div>
          <p className="text-xl font-bold text-red-600">{new Intl.NumberFormat('vi-VN').format(totalOverdue / 1000000)}M</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2"><TrendingDown size={16} className="text-orange-500" /><span className="text-xs text-gray-500">Chi phí đã duyệt</span></div>
          <p className="text-xl font-bold text-orange-600">{new Intl.NumberFormat('vi-VN').format(totalExpenses / 1000000)}M</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => setTab('invoices')} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'invoices' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Hóa đơn ({mockInvoices.length})
        </button>
        <button onClick={() => setTab('expenses')} className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'expenses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
          Chi phí ({mockExpenses.length})
        </button>
      </div>

      {tab === 'invoices' && (
        <div className="space-y-3">
          {mockInvoices.map(inv => (
            <div key={inv.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelected(inv)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <FileText size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{inv.number}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${invStatusColor[inv.status]}`}>{invStatusLabel[inv.status]}</span>
                    </div>
                    <p className="text-sm text-gray-600">{inv.clientName} · {inv.projectName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Phát hành: {new Date(inv.issueDate).toLocaleDateString('vi-VN')} · Hạn: {new Date(inv.dueDate).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{fmt(inv.total)}</p>
                  <p className="text-xs text-gray-400">Đã bao gồm VAT</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'expenses' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Chi phí</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Danh mục</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 hidden md:table-cell">Người đề xuất</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Số tiền</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {mockExpenses.map(e => (
                <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-medium text-gray-900">{e.title}</p>
                    <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString('vi-VN')}{e.projectName ? ` · ${e.projectName}` : ''}</p>
                  </td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-gray-600">{e.category}</td>
                  <td className="py-3.5 px-4 hidden md:table-cell text-gray-600">{e.employeeName}</td>
                  <td className="py-3.5 px-4 font-semibold text-gray-900">{fmt(e.amount)}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${expStatusColor[e.status]}`}>{expStatusLabel[e.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selected.number}</h2>
                <p className="text-gray-500">{selected.clientName}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div className="border-b border-gray-100 pb-4">
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1.5">
                    <span className="text-gray-600">{item.description}</span>
                    <span className="font-medium">{fmt(item.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Chưa VAT:</span><span>{fmt(selected.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">VAT (10%):</span><span>{fmt(selected.tax)}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2"><span>Tổng cộng:</span><span className="text-blue-600">{fmt(selected.total)}</span></div>
              </div>
              <div className="pt-2">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${invStatusColor[selected.status]}`}>{invStatusLabel[selected.status]}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
