export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'probation';
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  status: 'active' | 'inactive' | 'prospect';
  totalRevenue: number;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  description: string;
  type: 'social-media' | 'ads' | 'branding' | 'content' | 'seo' | 'other';
  status: 'planning' | 'active' | 'paused' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  assignees: string[];
  managerId: string;
  managerName: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assigneeName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  dueDate: string;
  createdAt: string;
  tags: string[];
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Expense {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  projectId?: string;
  projectName?: string;
  employeeId: string;
  employeeName: string;
  status: 'pending' | 'approved' | 'rejected';
  receipt?: string;
  notes?: string;
}

export type ActiveModule = 'dashboard' | 'projects' | 'clients' | 'hr' | 'finance' | 'tasks' | 'reports';
