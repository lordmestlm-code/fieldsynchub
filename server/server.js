import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Simple JSON-based database
let db = {
  customers: [],
  technicians: [],
  jobs: [],
  invoices: [],
  estimates: []
};

// Load database
function loadDB() {
  if (existsSync(DB_PATH)) {
    try {
      const data = readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(data);
      console.log('📂 Loaded existing database');
    } catch (e) {
      console.log('🆕 Created new database');
      seedData();
    }
  } else {
    console.log('🆕 Created new database');
    seedData();
  }
}

// Save database
function saveDB() {
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Seed initial data
function seedData() {
  db.customers = [
    { id: 'cust-1', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', address: '123 Oak Street', city: 'Springfield', state: 'IL', zipCode: '62701', notes: 'Prefers morning appointments', createdAt: '2024-01-15T10:00:00Z', totalJobs: 12, totalSpent: 3450.00 },
    { id: 'cust-2', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 234-5678', address: '456 Maple Avenue', city: 'Springfield', state: 'IL', zipCode: '62702', notes: '', createdAt: '2024-02-20T14:30:00Z', totalJobs: 8, totalSpent: 2100.00 },
    { id: 'cust-3', name: 'Michael Brown', email: 'mbrown@email.com', phone: '(555) 345-6789', address: '789 Pine Road', city: 'Chicago', state: 'IL', zipCode: '60601', notes: 'Commercial property owner', createdAt: '2024-03-10T09:15:00Z', totalJobs: 25, totalSpent: 12500.00 },
    { id: 'cust-4', name: 'Emily Davis', email: 'emily.d@email.com', phone: '(555) 456-7890', address: '321 Elm Street', city: 'Springfield', state: 'IL', zipCode: '62703', notes: '', createdAt: '2024-04-05T11:45:00Z', totalJobs: 5, totalSpent: 890.00 },
    { id: 'cust-5', name: 'Robert Wilson', email: 'r.wilson@email.com', phone: '(555) 567-8901', address: '654 Cedar Lane', city: 'Naperville', state: 'IL', zipCode: '60540', notes: 'VIP customer - priority service', createdAt: '2024-05-12T16:00:00Z', totalJobs: 18, totalSpent: 7800.00 },
  ];
  
  db.technicians = [
    { id: 'tech-1', name: 'James Anderson', email: 'james.a@fieldsynchub.com', phone: '(555) 111-2222', specialty: 'HVAC & Electrical', status: 'available', rating: 4.8, jobsCompleted: 156, color: '#10B981' },
    { id: 'tech-2', name: 'Maria Garcia', email: 'maria.g@fieldsynchub.com', phone: '(555) 222-3333', specialty: 'Plumbing', status: 'busy', rating: 4.9, jobsCompleted: 203, color: '#3B82F6' },
    { id: 'tech-3', name: 'David Lee', email: 'david.l@fieldsynchub.com', phone: '(555) 333-4444', specialty: 'General Maintenance', status: 'available', rating: 4.6, jobsCompleted: 98, color: '#F59E0B' },
    { id: 'tech-4', name: 'Lisa Thompson', email: 'lisa.t@fieldsynchub.com', phone: '(555) 444-5555', specialty: 'Appliance Repair', status: 'offline', rating: 4.7, jobsCompleted: 134, color: '#8B5CF6' },
  ];
  
  db.jobs = [
    { id: 'job-1', title: 'AC Unit Installation', description: 'Install new central AC unit in residential home', customerId: 'cust-1', technicianId: 'tech-1', status: 'scheduled', priority: 'high', scheduledDate: '2026-03-14', scheduledTime: '09:00', estimatedDuration: 240, actualDuration: null, address: '123 Oak Street, Springfield, IL 62701', notes: 'Customer will be home. Pre-install survey completed.', price: 2500.00, createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-10T14:30:00Z' },
    { id: 'job-2', title: 'Leak Repair', description: 'Fix leaking pipe under kitchen sink', customerId: 'cust-2', technicianId: 'tech-2', status: 'in_progress', priority: 'urgent', scheduledDate: '2026-03-14', scheduledTime: '14:00', estimatedDuration: 90, actualDuration: null, address: '456 Maple Avenue, Springfield, IL 62702', notes: '', price: 350.00, createdAt: '2024-03-05T09:00:00Z', updatedAt: '2024-03-14T08:30:00Z' },
    { id: 'job-3', title: 'Annual Furnace Maintenance', description: 'Yearly furnace inspection and maintenance', customerId: 'cust-3', technicianId: 'tech-1', status: 'pending', priority: 'medium', scheduledDate: '2026-03-15', scheduledTime: '10:00', estimatedDuration: 120, actualDuration: null, address: '789 Pine Road, Chicago, IL 60601', notes: '', price: 199.00, createdAt: '2024-03-08T11:00:00Z', updatedAt: '2024-03-08T11:00:00Z' },
    { id: 'job-4', title: 'Dishwasher Installation', description: 'Install new dishwasher and connect to plumbing', customerId: 'cust-4', technicianId: null, status: 'pending', priority: 'medium', scheduledDate: '2026-03-16', scheduledTime: '11:00', estimatedDuration: 180, actualDuration: null, address: '321 Elm Street, Springfield, IL 62703', notes: '', price: 450.00, createdAt: '2024-03-10T14:00:00Z', updatedAt: '2024-03-10T14:00:00Z' },
    { id: 'job-5', title: 'Water Heater Repair', description: 'Diagnose and repair water heater not heating properly', customerId: 'cust-5', technicianId: 'tech-3', status: 'completed', priority: 'high', scheduledDate: '2026-03-13', scheduledTime: '09:00', estimatedDuration: 150, actualDuration: 165, address: '654 Cedar Lane, Naperville, IL 60540', notes: 'Replaced heating element. Customer satisfied.', price: 425.00, createdAt: '2024-03-02T10:00:00Z', updatedAt: '2024-03-13T12:45:00Z' },
    { id: 'job-6', title: 'Electrical Outlet Replacement', description: 'Replace faulty outlets in living room and bedroom', customerId: 'cust-1', technicianId: 'tech-1', status: 'completed', priority: 'low', scheduledDate: '2026-03-12', scheduledTime: '15:00', estimatedDuration: 60, actualDuration: 45, address: '123 Oak Street, Springfield, IL 62701', notes: '', price: 150.00, createdAt: '2024-03-01T16:00:00Z', updatedAt: '2024-03-12T16:30:00Z' },
  ];
  
  db.invoices = [
    { id: 'inv-1', invoiceNumber: 'INV-2024-001', customerId: 'cust-1', jobId: 'job-6', status: 'paid', items: [{ id: 'item-1', description: 'Electrical Outlet Replacement', quantity: 2, unitPrice: 75.00, total: 150.00 }], subtotal: 150.00, tax: 11.25, total: 161.25, dueDate: '2024-03-27', paidDate: '2024-03-15', notes: '', createdAt: '2024-03-12T16:30:00Z', updatedAt: '2024-03-15T10:00:00Z' },
  ];
  
  db.estimates = [];
  
  saveDB();
  console.log('🌱 Seeded initial data');
}

// API Routes

app.get('/api/stats', (req, res) => {
  const paidInvoices = db.invoices.filter(inv => inv.status === 'paid');
  const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0);
  const jobsCompleted = db.jobs.filter(job => job.status === 'completed').length;
  const pendingJobs = db.jobs.filter(job => ['pending', 'scheduled', 'in_progress'].includes(job.status)).length;
  const activeTechs = db.technicians.filter(tech => tech.status !== 'offline').length;
  
  res.json({
    totalRevenue,
    revenueChange: 12.5,
    jobsCompleted,
    jobsChange: 8,
    pendingJobs,
    activeTechnicians: activeTechs,
    customersCount: db.customers.length,
    averageRating: 4.75
  });
});

app.get('/api/customers', (req, res) => {
  res.json(db.customers.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.get('/api/customers/:id', (req, res) => {
  const customer = db.customers.find(c => c.id === req.params.id);
  res.json(customer || null);
});

app.post('/api/customers', (req, res) => {
  const { id, name, email, phone, address, city, state, zipCode, notes } = req.body;
  const customer = { 
    id, name, email: email || '', phone: phone || '', address: address || '', 
    city: city || '', state: state || '', zipCode: zipCode || '', 
    notes: notes || '', createdAt: new Date().toISOString(), totalJobs: 0, totalSpent: 0 
  };
  db.customers.push(customer);
  saveDB();
  res.json(customer);
});

app.put('/api/customers/:id', (req, res) => {
  const { name, email, phone, address, city, state, zipCode, notes } = req.body;
  const index = db.customers.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    db.customers[index] = { ...db.customers[index], name, email, phone, address, city, state, zipCode, notes };
    saveDB();
  }
  res.json({ success: true });
});

app.delete('/api/customers/:id', (req, res) => {
  db.customers = db.customers.filter(c => c.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

app.get('/api/technicians', (req, res) => {
  res.json(db.technicians.sort((a, b) => a.name.localeCompare(b.name)));
});

app.get('/api/technicians/:id', (req, res) => {
  const tech = db.technicians.find(t => t.id === req.params.id);
  res.json(tech || null);
});

app.post('/api/technicians', (req, res) => {
  const { id, name, email, phone, specialty, status, color } = req.body;
  const tech = { 
    id, name, email: email || '', phone: phone || '', specialty: specialty || '', 
    status: status || 'available', rating: 5.0, jobsCompleted: 0, color: color || '#10B981' 
  };
  db.technicians.push(tech);
  saveDB();
  res.json(tech);
});

app.put('/api/technicians/:id', (req, res) => {
  const { name, email, phone, specialty, status, color } = req.body;
  const index = db.technicians.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    db.technicians[index] = { ...db.technicians[index], name, email, phone, specialty, status, color };
    saveDB();
  }
  res.json({ success: true });
});

app.get('/api/jobs', (req, res) => {
  res.json(db.jobs.sort((a, b) => {
    const dateA = new Date(a.scheduledDate + ' ' + a.scheduledTime);
    const dateB = new Date(b.scheduledDate + ' ' + b.scheduledTime);
    return dateB.getTime() - dateA.getTime();
  }));
});

app.get('/api/jobs/:id', (req, res) => {
  const job = db.jobs.find(j => j.id === req.params.id);
  res.json(job || null);
});

app.post('/api/jobs', (req, res) => {
  const { id, title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, address, notes, price } = req.body;
  const now = new Date().toISOString();
  const job = { 
    id, title, description: description || '', customerId, technicianId, 
    status: status || 'pending', priority: priority || 'medium', 
    scheduledDate, scheduledTime, estimatedDuration: estimatedDuration || 0, 
    actualDuration: null, address: address || '', notes: notes || '', 
    price: price || 0, createdAt: now, updatedAt: now 
  };
  db.jobs.push(job);
  saveDB();
  res.json(job);
});

app.put('/api/jobs/:id', (req, res) => {
  const { title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, actualDuration, address, notes, price } = req.body;
  const index = db.jobs.findIndex(j => j.id === req.params.id);
  if (index !== -1) {
    db.jobs[index] = { ...db.jobs[index], title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, actualDuration, address, notes, price, updatedAt: new Date().toISOString() };
    saveDB();
  }
  res.json({ success: true });
});

app.get('/api/invoices', (req, res) => {
  res.json(db.invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.post('/api/invoices', (req, res) => {
  const { id, invoiceNumber, customerId, jobId, status, items, subtotal, tax, total, dueDate, notes } = req.body;
  const now = new Date().toISOString();
  const invoice = { 
    id, invoiceNumber, customerId, jobId, status: status || 'draft', 
    items: items || [], subtotal: subtotal || 0, tax: tax || 0, total: total || 0, 
    dueDate, paidDate: null, notes: notes || '', createdAt: now, updatedAt: now 
  };
  db.invoices.push(invoice);
  saveDB();
  res.json(invoice);
});

app.put('/api/invoices/:id', (req, res) => {
  const { status, paidDate } = req.body;
  const index = db.invoices.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    db.invoices[index] = { ...db.invoices[index], status, paidDate, updatedAt: new Date().toISOString() };
    saveDB();
  }
  res.json({ success: true });
});

app.get('/api/estimates', (req, res) => {
  res.json(db.estimates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
});

app.post('/api/estimates', (req, res) => {
  const { id, estimateNumber, customerId, jobId, status, items, subtotal, tax, total, validUntil, notes } = req.body;
  const now = new Date().toISOString();
  const estimate = { 
    id, estimateNumber, customerId, jobId, status: status || 'draft', 
    items: items || [], subtotal: subtotal || 0, tax: tax || 0, total: total || 0, 
    validUntil, notes: notes || '', createdAt: now, updatedAt: now 
  };
  db.estimates.push(estimate);
  saveDB();
  res.json(estimate);
});

app.get('/api/revenue', (req, res) => {
  res.json([
    { month: 'Oct', revenue: 12400 },
    { month: 'Nov', revenue: 18200 },
    { month: 'Dec', revenue: 15600 },
    { month: 'Jan', revenue: 21300 },
    { month: 'Feb', revenue: 19800 },
    { month: 'Mar', revenue: 28450 },
  ]);
});

// Calendar events
app.get('/api/calendar/events', (req, res) => {
  const { start, end } = req.query;
  const startDate = start ? new Date(start) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endDate = end ? new Date(end) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  
  const events = db.jobs
    .filter(job => {
      if (!job.scheduledDate) return false;
      const jobDate = new Date(job.scheduledDate);
      return jobDate >= startDate && jobDate <= endDate;
    })
    .map(job => {
      const customer = db.customers.find(c => c.id === job.customerId);
      const tech = db.technicians.find(t => t.id === job.technicianId);
      return {
        id: job.id,
        title: job.title,
        date: job.scheduledDate,
        time: job.scheduledTime,
        status: job.status,
        priority: job.priority,
        customerName: customer?.name || 'Unknown',
        technicianName: tech?.name || 'Unassigned',
        address: job.address
      };
    });
  
  res.json(events);
});

// Login (demo)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Demo login - accept any credentials
  if (email && password) {
    res.json({ 
      token: 'demo', 
      user: { id: 'user-1', name: 'Admin User', email, role: 'admin' } 
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Start server
loadDB();
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});