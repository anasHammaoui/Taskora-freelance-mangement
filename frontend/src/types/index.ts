// ─── Enums ────────────────────────────────────────────────────────────────────

export type TaskStatus = 'A_FAIRE' | 'TERMINEE';
export type ProjectStatus = 'EN_COURS' | 'TERMINE';
export type UserStatus = 'ACTIVE' | 'BANNED';
export type Role = 'ROLE_FREELANCER' | 'ROLE_ADMIN';
export type InvoiceStatus = 'EN_ATTENTE' | 'PAYEE' | 'ANNULEE';

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  fullName: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

export interface ClientResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  createdAt: string;
  userId: number;
  userFullName: string;
}

export interface CreateClientRequest {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  userId: number;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ProjectResponse {
  id: number;
  title: string;
  description: string;
  budget: number;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
  clientId: number;
  clientName: string;
  userId: number;
  userFullName: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
  budget?: number;
  status: ProjectStatus;
  startDate?: string;
  endDate?: string;
  clientId: number;
  userId: number;
}

// ─── Task ─────────────────────────────────────────────────────────────────────

export interface TaskResponse {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  projectId: number;
  projectTitle: string;
  userId: number;
  userFullName: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
  projectId: number;
  userId: number;
}

// ─── Invoice ──────────────────────────────────────────────────────────────────

export interface InvoiceLineResponse {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  taxRate: number;
  totalHT: number;
  totalTVA: number;
  totalTTC: number;
  createdAt: string;
  projectId: number;
  projectTitle: string;
  userId: number;
  userFullName: string;
  lines: InvoiceLineResponse[];
}

export interface CreateInvoiceLineRequest {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceRequest {
  issueDate?: string;
  dueDate?: string;
  taxRate?: number;
  projectId: number;
  userId: number;
  lines: CreateInvoiceLineRequest[];
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface MonthlyRevenueEntry {
  month: string;
  revenue: number;
}

export interface FreelancerDashboardResponse {
  totalClients: number;
  activeProjects: number;
  pendingInvoices: number;
  currentMonthRevenue: number;
  last6MonthsRevenue: MonthlyRevenueEntry[];
}

export interface UserStatusBreakdown {
  active: number;
  banned: number;
}

export interface AdminDashboardResponse {
  totalFreelancers: number;
  activeFreelancers: number;
  bannedFreelancers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalPlatformRevenue: number;
  monthlyPlatformRevenue: MonthlyRevenueEntry[];
  freelancerStatusBreakdown: UserStatusBreakdown;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
