const API_BASE = 'http://localhost:3001/api';

// Helper function to handle API calls
async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Types
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
  createdAt: string;
  totalJobs: number;
  totalSpent: number;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  status: 'available' | 'busy' | 'offline';
  rating: number;
  jobsCompleted: number;
  color: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  customerId: string;
  technicianId?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration?: number;
  actualDuration?: number;
  address: string;
  notes: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

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
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  paidDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  customerId: string;
  jobId?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

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

// Dashboard
export async function getStats(): Promise<DashboardStats> {
  return fetchAPI('/stats');
}

export async function getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
  return fetchAPI('/revenue');
}

// Customers
export async function getCustomers(): Promise<Customer[]> {
  return fetchAPI('/customers');
}

export async function getCustomer(id: string): Promise<Customer | null> {
  return fetchAPI(`/customers/${id}`);
}

export async function createCustomer(data: Partial<Customer>): Promise<Customer> {
  const id = 'cust-' + Date.now();
  return fetchAPI('/customers', {
    method: 'POST',
    body: JSON.stringify({ ...data, id }),
  });
}

export async function updateCustomer(id: string, data: Partial<Customer>): Promise<void> {
  return fetchAPI(`/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: string): Promise<void> {
  return fetchAPI(`/customers/${id}`, {
    method: 'DELETE',
  });
}

// Technicians
export async function getTechnicians(): Promise<Technician[]> {
  return fetchAPI('/technicians');
}

export async function getTechnician(id: string): Promise<Technician | null> {
  return fetchAPI(`/technicians/${id}`);
}

export async function createTechnician(data: Partial<Technician>): Promise<Technician> {
  const id = 'tech-' + Date.now();
  return fetchAPI('/technicians', {
    method: 'POST',
    body: JSON.stringify({ ...data, id }),
  });
}

export async function updateTechnician(id: string, data: Partial<Technician>): Promise<void> {
  return fetchAPI(`/technicians/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Jobs
export async function getJobs(): Promise<Job[]> {
  return fetchAPI('/jobs');
}

export async function getJob(id: string): Promise<Job | null> {
  return fetchAPI(`/jobs/${id}`);
}

export async function createJob(data: Partial<Job>): Promise<Job> {
  const id = 'job-' + Date.now();
  return fetchAPI('/jobs', {
    method: 'POST',
    body: JSON.stringify({ ...data, id }),
  });
}

export async function updateJob(id: string, data: Partial<Job>): Promise<void> {
  return fetchAPI(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Invoices
export async function getInvoices(): Promise<Invoice[]> {
  return fetchAPI('/invoices');
}

export async function createInvoice(data: Partial<Invoice>): Promise<Invoice> {
  const id = 'inv-' + Date.now();
  const invoiceNumber = `INV-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  return fetchAPI('/invoices', {
    method: 'POST',
    body: JSON.stringify({ ...data, id, invoiceNumber }),
  });
}

export async function updateInvoice(id: string, data: Partial<Invoice>): Promise<void> {
  return fetchAPI(`/invoices/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Estimates
export async function getEstimates(): Promise<Estimate[]> {
  return fetchAPI('/estimates');
}

export async function createEstimate(data: Partial<Estimate>): Promise<Estimate> {
  const id = 'est-' + Date.now();
  const estimateNumber = `EST-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
  return fetchAPI('/estimates', {
    method: 'POST',
    body: JSON.stringify({ ...data, id, estimateNumber }),
  });
}