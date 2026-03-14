// Job Types
export type JobStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Job {
  id: string;
  title: string;
  description: string;
  customerId: string;
  technicianId?: string;
  status: JobStatus;
  priority: JobPriority;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // in minutes
  actualDuration?: number;
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes?: string;
  createdAt: string;
  totalJobs: number;
  totalSpent: number;
}

// Technician Types
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  avatar?: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  jobsCompleted: number;
  color: string;
}

// Invoice Types
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  jobId?: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  paidDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Estimate Types
export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';

export interface EstimateItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  jobId?: string;
  status: EstimateStatus;
  items: EstimateItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  jobsCompleted: number;
  jobsChange: number;
  pendingJobs: number;
  activeTechnicians: number;
  customersCount: number;
  averageRating: number;
}

// Calendar Event
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  job: Job;
  technician?: Technician;
  color: string;
}

// User for Auth
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician' | 'viewer';
  avatar?: string;
}

// App State
export interface AppState {
  jobs: Job[];
  customers: Customer[];
  technicians: Technician[];
  invoices: Invoice[];
  estimates: Estimate[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

// Action Types
export type AppAction =
  | { type: 'SET_JOBS'; payload: Job[] }
  | { type: 'ADD_JOB'; payload: Job }
  | { type: 'UPDATE_JOB'; payload: Job }
  | { type: 'DELETE_JOB'; payload: string }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'UPDATE_CUSTOMER'; payload: Customer }
  | { type: 'DELETE_CUSTOMER'; payload: string }
  | { type: 'SET_TECHNICIANS'; payload: Technician[] }
  | { type: 'ADD_TECHNICIAN'; payload: Technician }
  | { type: 'UPDATE_TECHNICIAN'; payload: Technician }
  | { type: 'DELETE_TECHNICIAN'; payload: string }
  | { type: 'SET_INVOICES'; payload: Invoice[] }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'SET_ESTIMATES'; payload: Estimate[] }
  | { type: 'ADD_ESTIMATE'; payload: Estimate }
  | { type: 'UPDATE_ESTIMATE'; payload: Estimate }
  | { type: 'DELETE_ESTIMATE'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };