import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './db.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'fieldsynchub-secret-key-2026';

app.use(cors());
app.use(express.json());

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ============ AUTH ROUTES ============

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ 
    token, 
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } 
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role, phone } = req.body;
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(`
      INSERT INTO users (email, password, name, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `).run(email, hashedPassword, name, role || 'technician', phone);
    
    const token = jwt.sign({ id: result.lastInsertRowid, email, role: role || 'technician' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: result.lastInsertRowid, name, email, role: role || 'technician', phone } });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

// ============ DASHBOARD ROUTES ============

app.get('/api/dashboard/stats', authenticate, (req, res) => {
  const totalJobs = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
  const completedJobs = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'completed'").get().count;
  const pendingJobs = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE status = 'pending'").get().count;
  const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as sum FROM jobs WHERE status = 'completed'").get().sum;
  const scheduledToday = db.prepare("SELECT COUNT(*) as count FROM jobs WHERE scheduled_date = DATE('now')").get().count;
  
  res.json({
    totalJobs,
    completedJobs,
    pendingJobs,
    totalCustomers,
    totalRevenue,
    scheduledToday,
    completionRate: totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0
  });
});

app.get('/api/dashboard/recent-jobs', authenticate, (req, res) => {
  const jobs = db.prepare(`
    SELECT j.*, c.name as customer_name, u.name as technician_name
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    ORDER BY j.created_at DESC
    LIMIT 10
  `).all();
  res.json(jobs);
});

// ============ CUSTOMER ROUTES ============

app.get('/api/customers', authenticate, (req, res) => {
  const customers = db.prepare('SELECT * FROM customers ORDER BY name').all();
  res.json(customers);
});

app.get('/api/customers/:id', authenticate, (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  
  const jobs = db.prepare('SELECT * FROM jobs WHERE customer_id = ? ORDER BY created_at DESC').all(req.params.id);
  const invoices = db.prepare(`
    SELECT i.*, j.title as job_title 
    FROM invoices i 
    LEFT JOIN jobs j ON i.job_id = j.id 
    WHERE i.customer_id = ?
    ORDER BY i.created_at DESC
  `).all(req.params.id);
  
  res.json({ ...customer, jobs, invoices });
});

app.post('/api/customers', authenticate, (req, res) => {
  const { name, email, phone, address, city, state, zip, notes } = req.body;
  const result = db.prepare(`
    INSERT INTO customers (name, email, phone, address, city, state, zip, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(name, email, phone, address, city, state, zip, notes);
  
  res.json({ id: result.lastInsertRowid, name, email, phone, address, city, state, zip, notes });
});

app.put('/api/customers/:id', authenticate, (req, res) => {
  const { name, email, phone, address, city, state, zip, notes } = req.body;
  db.prepare(`
    UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zip = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(name, email, phone, address, city, state, zip, notes, req.params.id);
  res.json({ success: true });
});

app.delete('/api/customers/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ JOB ROUTES ============

app.get('/api/jobs', authenticate, (req, res) => {
  const jobs = db.prepare(`
    SELECT j.*, c.name as customer_name, c.phone as customer_phone, c.address as customer_address,
           u.name as technician_name
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    ORDER BY j.scheduled_date DESC, j.scheduled_time DESC
  `).all();
  res.json(jobs);
});

app.get('/api/jobs/kanban', authenticate, (req, res) => {
  const pending = db.prepare(`
    SELECT j.*, c.name as customer_name, u.name as technician_name
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    WHERE j.status = 'pending'
    ORDER BY j.created_at DESC
  `).all();
  
  const scheduled = db.prepare(`
    SELECT j.*, c.name as customer_name, u.name as technician_name
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    WHERE j.status = 'scheduled'
    ORDER BY j.scheduled_date ASC
  `).all();
  
  const inProgress = db.prepare(`
    SELECT j.*, c.name as customer_name, u.name as technician_name
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    WHERE j.status = 'in_progress'
    ORDER BY j.created_at DESC
  `).all();
  
  const completed = db.prepare(`
    SELECT j.*, c.name as customer_name, u.name as technician_name
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    WHERE j.status = 'completed'
    ORDER BY j.completed_at DESC
    LIMIT 20
  `).all();
  
  res.json({ pending, scheduled, in_progress: inProgress, completed });
});

app.get('/api/jobs/:id', authenticate, (req, res) => {
  const job = db.prepare(`
    SELECT j.*, c.name as customer_name, c.phone as customer_phone, c.email as customer_email, c.address as customer_address,
           u.name as technician_name, u.phone as technician_phone
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    WHERE j.id = ?
  `).get(req.params.id);
  
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

app.post('/api/jobs', authenticate, (req, res) => {
  const { customer_id, technician_id, title, description, status, priority, scheduled_date, scheduled_time, total_amount } = req.body;
  
  const result = db.prepare(`
    INSERT INTO jobs (customer_id, technician_id, title, description, status, priority, scheduled_date, scheduled_time, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(customer_id, technician_id, title, description, status || 'pending', priority || 'normal', scheduled_date, scheduled_time, total_amount || 0);
  
  res.json({ id: result.lastInsertRowid, title, status: status || 'pending' });
});

app.put('/api/jobs/:id', authenticate, (req, res) => {
  const { customer_id, technician_id, title, description, status, priority, scheduled_date, scheduled_time, total_amount } = req.body;
  
  const completedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';
  
  db.prepare(`
    UPDATE jobs 
    SET customer_id = ?, technician_id = ?, title = ?, description = ?, status = ?, priority = ?, 
        scheduled_date = ?, scheduled_time = ?, total_amount = ?, 
        completed_at = ${status === 'completed' ? 'CURRENT_TIMESTAMP' : 'completed_at'},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(customer_id, technician_id, title, description, status, priority, scheduled_date, scheduled_time, total_amount, req.params.id);
  
  res.json({ success: true });
});

app.patch('/api/jobs/:id/status', authenticate, (req, res) => {
  const { status } = req.body;
  const completedAt = status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL';
  
  db.prepare(`
    UPDATE jobs 
    SET status = ?, 
        completed_at = ${status === 'completed' ? 'CURRENT_TIMESTAMP' : 'NULL'},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, req.params.id);
  
  res.json({ success: true });
});

app.delete('/api/jobs/:id', authenticate, (req, res) => {
  db.prepare('DELETE FROM jobs WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// ============ ESTIMATE ROUTES ============

app.get('/api/estimates', authenticate, (req, res) => {
  const estimates = db.prepare(`
    SELECT e.*, c.name as customer_name
    FROM estimates e
    LEFT JOIN customers c ON e.customer_id = c.id
    ORDER BY e.created_at DESC
  `).all();
  res.json(estimates);
});

app.post('/api/estimates', authenticate, (req, res) => {
  const { customer_id, job_id, title, description, amount, status, expires_at } = req.body;
  
  const result = db.prepare(`
    INSERT INTO estimates (customer_id, job_id, title, description, amount, status, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(customer_id, job_id, title, description, amount, status || 'draft', expires_at);
  
  res.json({ id: result.lastInsertRowid, title, amount, status: status || 'draft' });
});

app.post('/api/estimates/:id/convert', authenticate, (req, res) => {
  const estimate = db.prepare('SELECT * FROM estimates WHERE id = ?').get(req.params.id);
  if (!estimate) return res.status(404).json({ error: 'Estimate not found' });
  
  const jobResult = db.prepare(`
    INSERT INTO jobs (customer_id, title, description, status, priority, total_amount)
    VALUES (?, ?, ?, 'pending', 'normal', ?)
  `).run(estimate.customer_id, estimate.title, estimate.description, estimate.amount);
  
  db.prepare("UPDATE estimates SET status = 'converted' WHERE id = ?").run(req.params.id);
  
  res.json({ jobId: jobResult.lastInsertRowid, estimateId: req.params.id });
});

// ============ INVOICE ROUTES ============

app.get('/api/invoices', authenticate, (req, res) => {
  const invoices = db.prepare(`
    SELECT i.*, c.name as customer_name, j.title as job_title
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    LEFT JOIN jobs j ON i.job_id = j.id
    ORDER BY i.created_at DESC
  `).all();
  res.json(invoices);
});

app.get('/api/invoices/:id', authenticate, (req, res) => {
  const invoice = db.prepare(`
    SELECT i.*, c.name as customer_name, c.email as customer_email, c.address as customer_address,
           c.city as customer_city, c.state as customer_state, c.zip as customer_zip,
           j.title as job_title
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    LEFT JOIN jobs j ON i.job_id = j.id
    WHERE i.id = ?
  `).get(req.params.id);
  
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

app.post('/api/invoices', authenticate, (req, res) => {
  const { customer_id, job_id, estimate_id, amount, tax, due_date } = req.body;
  const invoiceNumber = `INV-${Date.now()}`;
  const total = amount + (tax || 0);
  
  const result = db.prepare(`
    INSERT INTO invoices (customer_id, job_id, estimate_id, invoice_number, amount, tax, total, due_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(customer_id, job_id, estimate_id, invoiceNumber, amount, tax || 0, total, due_date);
  
  res.json({ id: result.lastInsertRowid, invoice_number: invoiceNumber, total });
});

app.patch('/api/invoices/:id/status', authenticate, (req, res) => {
  const { status } = req.body;
  const paidAt = status === 'paid' ? 'CURRENT_TIMESTAMP' : 'NULL';
  
  db.prepare(`
    UPDATE invoices 
    SET status = ?, 
        paid_at = ${status === 'paid' ? 'CURRENT_TIMESTAMP' : 'NULL'}
    WHERE id = ?
  `).run(status, req.params.id);
  
  res.json({ success: true });
});

// ============ TECHNICIAN ROUTES ============

app.get('/api/technicians', authenticate, (req, res) => {
  const technicians = db.prepare("SELECT id, name, email, phone, role, avatar FROM users WHERE role = 'technician' OR role = 'admin'").all();
  res.json(technicians);
});

app.get('/api/technicians/:id', authenticate, (req, res) => {
  const tech = db.prepare("SELECT id, name, email, phone, role, avatar FROM users WHERE id = ?").get(req.params.id);
  if (!tech) return res.status(404).json({ error: 'Technician not found' });
  
  const jobs = db.prepare(`
    SELECT * FROM jobs 
    WHERE technician_id = ? 
    ORDER BY scheduled_date DESC
    LIMIT 20
  `).all(req.params.id);
  
  res.json({ ...tech, jobs });
});

// ============ REPORTS ROUTES ============

app.get('/api/reports/revenue', authenticate, (req, res) => {
  const { period = 'month' } = req.query;
  
  let dateFilter;
  switch(period) {
    case 'week':
      dateFilter = "strftime('%Y-%W', created_at)";
      break;
    case 'year':
      dateFilter = "strftime('%Y', created_at)";
      break;
    default:
      dateFilter = "strftime('%Y-%m', created_at)";
  }
  
  const revenue = db.prepare(`
    SELECT ${dateFilter} as period, SUM(total_amount) as revenue, COUNT(*) as jobs
    FROM jobs
    WHERE status = 'completed'
    GROUP BY ${dateFilter}
    ORDER BY period DESC
    LIMIT 12
  `).all();
  
  res.json(revenue);
});

app.get('/api/reports/jobs-by-status', authenticate, (req, res) => {
  const stats = db.prepare(`
    SELECT status, COUNT(*) as count, SUM(total_amount) as total
    FROM jobs
    GROUP BY status
  `).all();
  res.json(stats);
});

app.get('/api/reports/top-customers', authenticate, (req, res) => {
  const customers = db.prepare(`
    SELECT c.id, c.name, COUNT(j.id) as job_count, COALESCE(SUM(j.total_amount), 0) as total_spent
    FROM customers c
    LEFT JOIN jobs j ON c.id = j.customer_id AND j.status = 'completed'
    GROUP BY c.id
    ORDER BY total_spent DESC
    LIMIT 10
  `).all();
  res.json(customers);
});

// ============ CALENDAR ROUTES ============

app.get('/api/calendar/events', authenticate, (req, res) => {
  const { start, end } = req.query;
  
  let query = `
    SELECT j.id, j.title, j.status, j.scheduled_date as date, j.scheduled_time as time,
           j.total_amount, c.name as customer_name, u.name as technician_name
    FROM jobs j
    LEFT JOIN customers c ON j.customer_id = c.id
    LEFT JOIN users u ON j.technician_id = u.id
    WHERE j.scheduled_date IS NOT NULL
  `;
  
  const params = [];
  if (start && end) {
    query += ' AND j.scheduled_date BETWEEN ? AND ?';
    params.push(start, end);
  }
  
  query += ' ORDER BY j.scheduled_date ASC, j.scheduled_time ASC';
  
  const events = db.prepare(query).all(...params);
  res.json(events);
});

// Start server
app.listen(PORT, () => {
  console.log(`FieldSyncHub API running on http://localhost:${PORT}`);
});