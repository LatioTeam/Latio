import type { Employee, Client, Project, Task, Invoice, Expense } from './types';

export const mockEmployees: Employee[] = [
  { id: 'e1', name: 'Nguyễn Minh Tuấn', email: 'tuan.nguyen@latio.vn', phone: '0901234567', department: 'Creative', position: 'Creative Director', joinDate: '2022-01-15', salary: 35000000, status: 'active' },
  { id: 'e2', name: 'Trần Thị Hương', email: 'huong.tran@latio.vn', phone: '0912345678', department: 'Marketing', position: 'Marketing Manager', joinDate: '2022-03-01', salary: 28000000, status: 'active' },
  { id: 'e3', name: 'Lê Văn Đức', email: 'duc.le@latio.vn', phone: '0923456789', department: 'Technology', position: 'Tech Lead', joinDate: '2022-06-15', salary: 40000000, status: 'active' },
  { id: 'e4', name: 'Phạm Thị Lan', email: 'lan.pham@latio.vn', phone: '0934567890', department: 'Content', position: 'Content Strategist', joinDate: '2023-01-10', salary: 22000000, status: 'active' },
  { id: 'e5', name: 'Hoàng Minh Châu', email: 'chau.hoang@latio.vn', phone: '0945678901', department: 'Ads', position: 'Performance Marketer', joinDate: '2023-04-01', salary: 25000000, status: 'active' },
  { id: 'e6', name: 'Vũ Thị Mai', email: 'mai.vu@latio.vn', phone: '0956789012', department: 'Design', position: 'UI/UX Designer', joinDate: '2023-07-15', salary: 23000000, status: 'probation' },
  { id: 'e7', name: 'Đặng Quốc Hùng', email: 'hung.dang@latio.vn', phone: '0967890123', department: 'Sales', position: 'Business Development', joinDate: '2022-09-01', salary: 30000000, status: 'active' },
  { id: 'e8', name: 'Bùi Thị Ngọc', email: 'ngoc.bui@latio.vn', phone: '0978901234', department: 'Finance', position: 'Accountant', joinDate: '2022-11-01', salary: 20000000, status: 'active' },
];

export const mockClients: Client[] = [
  { id: 'c1', name: 'Nguyễn Thành Long', company: 'Vingroup', email: 'long@vingroup.vn', phone: '0281234567', address: 'TP.HCM', industry: 'Real Estate', status: 'active', totalRevenue: 500000000, createdAt: '2023-01-15' },
  { id: 'c2', name: 'Trần Bảo Châu', company: 'FPT Corporation', email: 'chau@fpt.vn', phone: '0242345678', address: 'Hà Nội', industry: 'Technology', status: 'active', totalRevenue: 350000000, createdAt: '2023-03-20' },
  { id: 'c3', name: 'Lê Minh Quân', company: 'Masan Group', email: 'quan@masan.vn', phone: '0283456789', address: 'TP.HCM', industry: 'FMCG', status: 'active', totalRevenue: 280000000, createdAt: '2023-05-10' },
  { id: 'c4', name: 'Phạm Thu Hà', company: 'Viettel', email: 'ha.pham@viettel.vn', phone: '0244567890', address: 'Hà Nội', industry: 'Telecom', status: 'active', totalRevenue: 420000000, createdAt: '2023-02-28' },
  { id: 'c5', name: 'Hoàng Đức Anh', company: 'Techcombank', email: 'anh@techcombank.vn', phone: '0285678901', address: 'TP.HCM', industry: 'Banking', status: 'prospect', totalRevenue: 0, createdAt: '2024-01-05' },
  { id: 'c6', name: 'Ngô Thị Bích', company: 'Grab Vietnam', email: 'bich@grab.vn', phone: '0286789012', address: 'TP.HCM', industry: 'Logistics', status: 'active', totalRevenue: 180000000, createdAt: '2023-08-15' },
];

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Vingroup - Social Media 2024', clientId: 'c1', clientName: 'Vingroup', description: 'Quản lý toàn bộ kênh social media cho Vingroup', type: 'social-media', status: 'active', startDate: '2024-01-01', endDate: '2024-12-31', budget: 240000000, spent: 180000000, progress: 75, assignees: ['e1', 'e2', 'e4'], managerId: 'e2', managerName: 'Trần Thị Hương' },
  { id: 'p2', name: 'FPT - Performance Ads Q4', clientId: 'c2', clientName: 'FPT Corporation', description: 'Chạy ads Google, Meta cho chiến dịch Q4 2024', type: 'ads', status: 'active', startDate: '2024-10-01', endDate: '2024-12-31', budget: 150000000, spent: 45000000, progress: 30, assignees: ['e5', 'e3'], managerId: 'e5', managerName: 'Hoàng Minh Châu' },
  { id: 'p3', name: 'Masan - Brand Identity', clientId: 'c3', clientName: 'Masan Group', description: 'Xây dựng lại nhận diện thương hiệu Masan', type: 'branding', status: 'completed', startDate: '2024-06-01', endDate: '2024-09-30', budget: 120000000, spent: 115000000, progress: 100, assignees: ['e1', 'e6'], managerId: 'e1', managerName: 'Nguyễn Minh Tuấn' },
  { id: 'p4', name: 'Viettel - Content Strategy', clientId: 'c4', clientName: 'Viettel', description: 'Chiến lược nội dung cho Viettel 2025', type: 'content', status: 'planning', startDate: '2025-01-01', endDate: '2025-06-30', budget: 200000000, spent: 5000000, progress: 5, assignees: ['e4', 'e2'], managerId: 'e4', managerName: 'Phạm Thị Lan' },
  { id: 'p5', name: 'Grab - SEO Campaign', clientId: 'c6', clientName: 'Grab Vietnam', description: 'Tối ưu SEO cho landing page Grab', type: 'seo', status: 'active', startDate: '2024-09-01', endDate: '2025-02-28', budget: 80000000, spent: 30000000, progress: 40, assignees: ['e3', 'e4'], managerId: 'e3', managerName: 'Lê Văn Đức' },
];

export const mockTasks: Task[] = [
  { id: 't1', title: 'Lên kế hoạch content tháng 11', description: 'Lên lịch đăng bài và ý tưởng nội dung cho tháng 11', projectId: 'p1', projectName: 'Vingroup - Social Media 2024', assigneeId: 'e4', assigneeName: 'Phạm Thị Lan', priority: 'high', status: 'in-progress', dueDate: '2024-10-25', createdAt: '2024-10-15', tags: ['content', 'planning'] },
  { id: 't2', title: 'Thiết kế banner quảng cáo FPT', description: 'Tạo bộ banner cho chiến dịch ads Q4', projectId: 'p2', projectName: 'FPT - Performance Ads Q4', assigneeId: 'e6', assigneeName: 'Vũ Thị Mai', priority: 'urgent', status: 'todo', dueDate: '2024-10-20', createdAt: '2024-10-14', tags: ['design', 'ads'] },
  { id: 't3', title: 'Báo cáo hiệu quả ads tháng 10', description: 'Tổng hợp và phân tích số liệu ads', projectId: 'p2', projectName: 'FPT - Performance Ads Q4', assigneeId: 'e5', assigneeName: 'Hoàng Minh Châu', priority: 'medium', status: 'review', dueDate: '2024-11-05', createdAt: '2024-10-10', tags: ['report', 'ads'] },
  { id: 't4', title: 'Audit SEO website Grab', description: 'Kiểm tra toàn bộ on-page và off-page SEO', projectId: 'p5', projectName: 'Grab - SEO Campaign', assigneeId: 'e3', assigneeName: 'Lê Văn Đức', priority: 'high', status: 'done', dueDate: '2024-10-15', createdAt: '2024-10-01', tags: ['seo', 'audit'] },
  { id: 't5', title: 'Họp kickoff dự án Viettel', description: 'Họp giới thiệu team và scope dự án', projectId: 'p4', projectName: 'Viettel - Content Strategy', assigneeId: 'e2', assigneeName: 'Trần Thị Hương', priority: 'high', status: 'todo', dueDate: '2024-12-01', createdAt: '2024-10-16', tags: ['meeting', 'kickoff'] },
  { id: 't6', title: 'Review chiến lược social media Q1/2025', description: 'Đánh giá và điều chỉnh chiến lược', projectId: 'p1', projectName: 'Vingroup - Social Media 2024', assigneeId: 'e2', assigneeName: 'Trần Thị Hương', priority: 'medium', status: 'todo', dueDate: '2024-12-15', createdAt: '2024-10-16', tags: ['strategy', 'review'] },
];

export const mockInvoices: Invoice[] = [
  { id: 'inv1', number: 'LATIO-2024-001', clientId: 'c1', clientName: 'Vingroup', projectId: 'p1', projectName: 'Vingroup - Social Media 2024', items: [{ description: 'Dịch vụ quản lý social media tháng 10', quantity: 1, unitPrice: 20000000, amount: 20000000 }], subtotal: 20000000, tax: 2000000, total: 22000000, status: 'paid', issueDate: '2024-10-01', dueDate: '2024-10-15', paidDate: '2024-10-12' },
  { id: 'inv2', number: 'LATIO-2024-002', clientId: 'c2', clientName: 'FPT Corporation', projectId: 'p2', projectName: 'FPT - Performance Ads Q4', items: [{ description: 'Setup chiến dịch ads tháng 10', quantity: 1, unitPrice: 15000000, amount: 15000000 }, { description: 'Phí quản lý ads (10%)', quantity: 1, unitPrice: 3000000, amount: 3000000 }], subtotal: 18000000, tax: 1800000, total: 19800000, status: 'sent', issueDate: '2024-10-05', dueDate: '2024-10-25' },
  { id: 'inv3', number: 'LATIO-2024-003', clientId: 'c6', clientName: 'Grab Vietnam', projectId: 'p5', projectName: 'Grab - SEO Campaign', items: [{ description: 'Dịch vụ SEO tháng 10', quantity: 1, unitPrice: 10000000, amount: 10000000 }], subtotal: 10000000, tax: 1000000, total: 11000000, status: 'overdue', issueDate: '2024-09-30', dueDate: '2024-10-15' },
  { id: 'inv4', number: 'LATIO-2024-004', clientId: 'c4', clientName: 'Viettel', projectId: 'p4', projectName: 'Viettel - Content Strategy', items: [{ description: 'Phí lập chiến lược ban đầu', quantity: 1, unitPrice: 25000000, amount: 25000000 }], subtotal: 25000000, tax: 2500000, total: 27500000, status: 'draft', issueDate: '2024-10-16', dueDate: '2024-11-16' },
];

export const mockExpenses: Expense[] = [
  { id: 'ex1', title: 'Chi phí in ấn tài liệu', category: 'Operations', amount: 2500000, date: '2024-10-10', projectId: 'p1', projectName: 'Vingroup - Social Media 2024', employeeId: 'e2', employeeName: 'Trần Thị Hương', status: 'approved' },
  { id: 'ex2', title: 'Mua phần mềm Adobe Creative', category: 'Software', amount: 8500000, date: '2024-10-12', employeeId: 'e1', employeeName: 'Nguyễn Minh Tuấn', status: 'approved' },
  { id: 'ex3', title: 'Chi phí đi lại gặp khách hàng', category: 'Travel', amount: 1200000, date: '2024-10-14', projectId: 'p2', projectName: 'FPT - Performance Ads Q4', employeeId: 'e7', employeeName: 'Đặng Quốc Hùng', status: 'pending' },
  { id: 'ex4', title: 'Budget quảng cáo Facebook', category: 'Advertising', amount: 45000000, date: '2024-10-01', projectId: 'p2', projectName: 'FPT - Performance Ads Q4', employeeId: 'e5', employeeName: 'Hoàng Minh Châu', status: 'approved' },
  { id: 'ex5', title: 'Tổ chức team building', category: 'HR', amount: 15000000, date: '2024-10-08', employeeId: 'e8', employeeName: 'Bùi Thị Ngọc', status: 'pending' },
];
