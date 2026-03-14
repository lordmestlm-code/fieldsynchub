import express from 'express';
import cors from 'cors';
import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = join(__dirname, 'database.sqlite');

app.use(cors());
app.use(express.json());

let db;

// Helper to convert undefined to null
function toNull(val) {
  return val === undefined ? null : val;
}

// Initialize database
async function initDB() {
  try {
    const SQL = await initSqlJs();
    
    // Load existing database or create new one
    if (existsSync(DB_PATH)) {
      const fileBuffer = readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
      console.log('📂 Loaded existing database');
    } else {
      db = new SQL.Database();
      console.log('🆕 Created new database');
    }
    
    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zipCode TEXT,
        notes TEXT,
        createdAt TEXT,
        totalJobs INTEGER DEFAULT 0,
        totalSpent REAL DEFAULT 0
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS technicians (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        specialty TEXT,
        status TEXT DEFAULT 'available',
        rating REAL DEFAULT 5.0,
        jobsCompleted INTEGER DEFAULT 0,
        color TEXT
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        customerId TEXT,
        technicianId TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        scheduledDate TEXT,
        scheduledTime TEXT,
        estimatedDuration INTEGER,
        actualDuration INTEGER,
        address TEXT,
        notes TEXT,
        price REAL DEFAULT 0,
        createdAt TEXT,
        updatedAt TEXT
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        invoiceNumber TEXT,
        customerId TEXT,
        jobId TEXT,
        status TEXT DEFAULT 'draft',
        items TEXT,
        subtotal REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        total REAL DEFAULT 0,
        dueDate TEXT,
        paidDate TEXT,
        notes TEXT,
        createdAt TEXT,
        updatedAt TEXT
      )
    `);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS estimates (
        id TEXT PRIMARY KEY,
        estimateNumber TEXT,
        customerId TEXT,
        jobId TEXT,
        status TEXT DEFAULT 'draft',
        items TEXT,
        subtotal REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        total REAL DEFAULT 0,
        validUntil TEXT,
        notes TEXT,
        createdAt TEXT,
        updatedAt TEXT
      )
    `);
    
    // Seed data if empty
    const customerCount = db.exec("SELECT COUNT(*) FROM customers")[0]?.values[0][0] || 0;
    if (customerCount === 0) {
      seedData();
    }
    
    saveDB();
    console.log('✅ Database initialized');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

function seedData() {
  // Seed Customers
  const customers = [
    { id: 'cust-1', name: 'John Smith', email: 'john.smith@email.com', phone: '(555) 123-4567', address: '123 Oak Street', city: 'Springfield', state: 'IL', zipCode: '62701', notes: 'Prefers morning appointments', createdAt: '2024-01-15T10:00:00Z', totalJobs: 12, totalSpent: 3450.00 },
    { id: 'cust-2', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(555) 234-5678', address: '456 Maple Avenue', city: 'Springfield', state: 'IL', zipCode: '62702', notes: null, createdAt: '2024-02-20T14:30:00Z', totalJobs: 8, totalSpent: 2100.00 },
    { id: 'cust-3', name: 'Michael Brown', email: 'mbrown@email.com', phone: '(555) 345-6789', address: '789 Pine Road', city: 'Chicago', state: 'IL', zipCode: '60601', notes: 'Commercial property owner', createdAt: '2024-03-10T09:15:00Z', totalJobs: 25, totalSpent: 12500.00 },
    { id: 'cust-4', name: 'Emily Davis', email: 'emily.d@email.com', phone: '(555) 456-7890', address: '321 Elm Street', city: 'Springfield', state: 'IL', zipCode: '62703', notes: null, createdAt: '2024-04-05T11:45:00Z', totalJobs: 5, totalSpent: 890.00 },
    { id: 'cust-5', name: 'Robert Wilson', email: 'r.wilson@email.com', phone: '(555) 567-8901', address: '654 Cedar Lane', city: 'Naperville', state: 'IL', zipCode: '60540', notes: 'VIP customer - priority service', createdAt: '2024-05-12T16:00:00Z', totalJobs: 18, totalSpent: 7800.00 },
  ];
  
  customers.forEach(c => {
    db.run("INSERT INTO customers (id, name, email, phone, address, city, state, zipCode, notes, createdAt, totalJobs, totalSpent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [c.id, c.name, c.email, c.phone, c.address, c.city, c.state, c.zipCode, c.notes, c.createdAt, c.totalJobs, c.totalSpent]);
  });
  
  // Seed Technicians
  const technicians = [
    { id: 'tech-1', name: 'James Anderson', email: 'james.a@fieldsynchub.com', phone: '(555) 111-2222', specialty: 'HVAC & Electrical', status: 'available', rating: 4.8, jobsCompleted: 156, color: '#10B981' },
    { id: 'tech-2', name: 'Maria Garcia', email: 'maria.g@fieldsynchub.com', phone: '(555) 222-3333', specialty: 'Plumbing', status: 'busy', rating: 4.9, jobsCompleted: 203, color: '#3B82F6' },
    { id: 'tech-3', name: 'David Lee', email: 'david.l@fieldsynchub.com', phone: '(555) 333-4444', specialty: 'General Maintenance', status: 'available', rating: 4.6, jobsCompleted: 98, color: '#F59E0B' },
    { id: 'tech-4', name: 'Lisa Thompson', email: 'lisa.t@fieldsynchub.com', phone: '(555) 444-5555', specialty: 'Appliance Repair', status: 'offline', rating: 4.7, jobsCompleted: 134, color: '#8B5CF6' },
  ];
  
  technicians.forEach(t => {
    db.run("INSERT INTO technicians (id, name, email, phone, specialty, status, rating, jobsCompleted, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [t.id, t.name, t.email, t.phone, t.specialty, t.status, t.rating, t.jobsCompleted, t.color]);
  });
  
  // Seed Jobs
  const jobs = [
    { id: 'job-1', title: 'AC Unit Installation', description: 'Install new central AC unit in residential home', customerId: 'cust-1', technicianId: 'tech-1', status: 'scheduled', priority: 'high', scheduledDate: '2026-03-14', scheduledTime: '09:00', estimatedDuration: 240, actualDuration: null, address: '123 Oak Street, Springfield, IL 62701', notes: 'Customer will be home. Pre-install survey completed.', price: 2500.00, createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-10T14:30:00Z' },
    { id: 'job-2', title: 'Leak Repair', description: 'Fix leaking pipe under kitchen sink', customerId: 'cust-2', technicianId: 'tech-2', status: 'in_progress', priority: 'urgent', scheduledDate: '2026-03-14', scheduledTime: '14:00', estimatedDuration: 90, actualDuration: null, address: '456 Maple Avenue, Springfield, IL 62702', notes: null, price: 350.00, createdAt: '2024-03-05T09:00:00Z', updatedAt: '2024-03-14T08:30:00Z' },
    { id: 'job-3', title: 'Annual Furnace Maintenance', description: 'Yearly furnace inspection and maintenance', customerId: 'cust-3', technicianId: 'tech-1', status: 'pending', priority: 'medium', scheduledDate: '2026-03-15', scheduledTime: '10:00', estimatedDuration: 120, actualDuration: null, address: '789 Pine Road, Chicago, IL 60601', notes: null, price: 199.00, createdAt: '2024-03-08T11:00:00Z', updatedAt: '2024-03-08T11:00:00Z' },
    { id: 'job-4', title: 'Dishwasher Installation', description: 'Install new dishwasher and connect to plumbing', customerId: 'cust-4', technicianId: null, status: 'pending', priority: 'medium', scheduledDate: '2026-03-16', scheduledTime: '11:00', estimatedDuration: 180, actualDuration: null, address: '321 Elm Street, Springfield, IL 62703', notes: null, price: 450.00, createdAt: '2024-03-10T14:00:00Z', updatedAt: '2024-03-10T14:00:00Z' },
    { id: 'job-5', title: 'Water Heater Repair', description: 'Diagnose and repair water heater not heating properly', customerId: 'cust-5', technicianId: 'tech-3', status: 'completed', priority: 'high', scheduledDate: '2026-03-13', scheduledTime: '09:00', estimatedDuration: 150, actualDuration: 165, address: '654 Cedar Lane, Naperville, IL 60540', notes: 'Replaced heating element. Customer satisfied.', price: 425.00, createdAt: '2024-03-02T10:00:00Z', updatedAt: '2024-03-13T12:45:00Z' },
    { id: 'job-6', title: 'Electrical Outlet Replacement', description: 'Replace faulty outlets in living room and bedroom', customerId: 'cust-1', technicianId: 'tech-1', status: 'completed', priority: 'low', scheduledDate: '2026-03-12', scheduledTime: '15:00', estimatedDuration: 60, actualDuration: 45, address: '123 Oak Street, Springfield, IL 62701', notes: null, price: 150.00, createdAt: '2024-03-01T16:00:00Z', updatedAt: '2024-03-12T16:30:00Z' },
  ];
  
  jobs.forEach(j => {
    db.run("INSERT INTO jobs (id, title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, actualDuration, address, notes, price, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [j.id, j.title, j.description, j.customerId, j.technicianId, j.status, j.priority, j.scheduledDate, j.scheduledTime, j.estimatedDuration, j.actualDuration, j.address, j.notes, j.price, j.createdAt, j.updatedAt]);
  });
  
  console.log('🌱 Seeded initial data');
}

function saveDB() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    writeFileSync(DB_PATH, buffer);
  } catch (error) {
    console.error('Failed to save database:', error);
  }
}

// Helper to convert query results to objects
function queryToObjects(result) {
  if (!result || result.length === 0) return [];
  const columns = result[0].columns;
  const values = result[0].values;
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj;
  });
}

// API Routes

// Dashboard Stats
app.get('/api/stats', (req, res) => {
  try {
    const revenue = db.exec("SELECT COALESCE(SUM(total), 0) as total FROM invoices WHERE status = 'paid'")[0]?.values[0][0] || 0;
    const jobsCompleted = db.exec("SELECT COUNT(*) FROM jobs WHERE status = 'completed'")[0]?.values[0][0] || 0;
    const pendingJobs = db.exec("SELECT COUNT(*) FROM jobs WHERE status IN ('pending', 'scheduled', 'in_progress')")[0]?.values[0][0] || 0;
    const activeTechs = db.exec("SELECT COUNT(*) FROM technicians WHERE status != 'offline'")[0]?.values[0][0] || 0;
    const customersCount = db.exec("SELECT COUNT(*) FROM customers")[0]?.values[0][0] || 0;
    
    res.json({
      totalRevenue: revenue,
      revenueChange: 12.5,
      jobsCompleted: jobsCompleted,
      jobsChange: 8,
      pendingJobs: pendingJobs,
      activeTechnicians: activeTechs,
      customersCount: customersCount,
      averageRating: 4.75
    });
  } catch (error) {
    console.error('Error in /api/stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// Customers
app.get('/api/customers', (req, res) => {
  try {
    const result = db.exec("SELECT * FROM customers ORDER BY createdAt DESC");
    res.json(queryToObjects(result));
  } catch (error) {
    console.error('Error in /api/customers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/customers/:id', (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM customers WHERE id = ?");
    stmt.bind([req.params.id]);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(results[0] || null);
  } catch (error) {
    console.error('Error in /api/customers/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', (req, res) => {
  try {
    const { id, name, email, phone, address, city, state, zipCode, notes } = req.body;
    const createdAt = new Date().toISOString();
    db.run("INSERT INTO customers (id, name, email, phone, address, city, state, zipCode, notes, createdAt, totalJobs, totalSpent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)",
      [id, name, toNull(email), toNull(phone), toNull(address), toNull(city), toNull(state), toNull(zipCode), toNull(notes), createdAt]);
    saveDB();
    res.json({ id, name, email, phone, address, city, state, zipCode, notes, createdAt });
  } catch (error) {
    console.error('Error in POST /api/customers:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/customers/:id', (req, res) => {
  try {
    const { name, email, phone, address, city, state, zipCode, notes } = req.body;
    db.run("UPDATE customers SET name = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ?, notes = ? WHERE id = ?",
      [name, toNull(email), toNull(phone), toNull(address), toNull(city), toNull(state), toNull(zipCode), toNull(notes), req.params.id]);
    saveDB();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/customers/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  try {
    db.run("DELETE FROM customers WHERE id = ?", [req.params.id]);
    saveDB();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/customers/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Technicians
app.get('/api/technicians', (req, res) => {
  try {
    const result = db.exec("SELECT * FROM technicians ORDER BY name");
    res.json(queryToObjects(result));
  } catch (error) {
    console.error('Error in /api/technicians:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/technicians/:id', (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM technicians WHERE id = ?");
    stmt.bind([req.params.id]);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(results[0] || null);
  } catch (error) {
    console.error('Error in /api/technicians/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/technicians', (req, res) => {
  try {
    const { id, name, email, phone, specialty, status, color } = req.body;
    db.run("INSERT INTO technicians (id, name, email, phone, specialty, status, rating, jobsCompleted, color) VALUES (?, ?, ?, ?, ?, ?, 5.0, 0, ?)",
      [id, name, toNull(email), toNull(phone), toNull(specialty), toNull(status) || 'available', toNull(color)]);
    saveDB();
    res.json({ id, name, email, phone, specialty, status: status || 'available', color });
  } catch (error) {
    console.error('Error in POST /api/technicians:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/technicians/:id', (req, res) => {
  try {
    const { name, email, phone, specialty, status, color } = req.body;
    db.run("UPDATE technicians SET name = ?, email = ?, phone = ?, specialty = ?, status = ?, color = ? WHERE id = ?",
      [name, toNull(email), toNull(phone), toNull(specialty), toNull(status), toNull(color), req.params.id]);
    saveDB();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/technicians/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Jobs
app.get('/api/jobs', (req, res) => {
  try {
    const result = db.exec("SELECT * FROM jobs ORDER BY scheduledDate DESC, scheduledTime DESC");
    res.json(queryToObjects(result));
  } catch (error) {
    console.error('Error in /api/jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/jobs/:id', (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM jobs WHERE id = ?");
    stmt.bind([req.params.id]);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    res.json(results[0] || null);
  } catch (error) {
    console.error('Error in /api/jobs/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/jobs', (req, res) => {
  try {
    const { id, title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, address, notes, price } = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    db.run("INSERT INTO jobs (id, title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, address, notes, price, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, title, toNull(description), toNull(customerId), toNull(technicianId), toNull(status) || 'pending', toNull(priority) || 'medium', toNull(scheduledDate), toNull(scheduledTime), toNull(estimatedDuration), toNull(address), toNull(notes), toNull(price) || 0, createdAt, updatedAt]);
    saveDB();
    res.json({ id, title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, address, notes, price, createdAt, updatedAt });
  } catch (error) {
    console.error('Error in POST /api/jobs:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/jobs/:id', (req, res) => {
  try {
    const { title, description, customerId, technicianId, status, priority, scheduledDate, scheduledTime, estimatedDuration, actualDuration, address, notes, price } = req.body;
    const updatedAt = new Date().toISOString();
    db.run("UPDATE jobs SET title = ?, description = ?, customerId = ?, technicianId = ?, status = ?, priority = ?, scheduledDate = ?, scheduledTime = ?, estimatedDuration = ?, actualDuration = ?, address = ?, notes = ?, price = ?, updatedAt = ? WHERE id = ?",
      [title, toNull(description), toNull(customerId), toNull(technicianId), toNull(status), toNull(priority), toNull(scheduledDate), toNull(scheduledTime), toNull(estimatedDuration), toNull(actualDuration), toNull(address), toNull(notes), toNull(price), updatedAt, req.params.id]);
    saveDB();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/jobs/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Invoices
app.get('/api/invoices', (req, res) => {
  try {
    const result = db.exec("SELECT * FROM invoices ORDER BY createdAt DESC");
    const invoices = queryToObjects(result).map(inv => ({
      ...inv,
      items: inv.items ? JSON.parse(inv.items) : []
    }));
    res.json(invoices);
  } catch (error) {
    console.error('Error in /api/invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invoices', (req, res) => {
  try {
    const { id, invoiceNumber, customerId, jobId, status, items, subtotal, tax, total, dueDate, notes } = req.body;
    const createdAt = new Date().toISOString();
    db.run("INSERT INTO invoices (id, invoiceNumber, customerId, jobId, status, items, subtotal, tax, total, dueDate, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, invoiceNumber, toNull(customerId), toNull(jobId), toNull(status) || 'draft', JSON.stringify(items || []), toNull(subtotal) || 0, toNull(tax) || 0, toNull(total) || 0, toNull(dueDate), toNull(notes), createdAt, createdAt]);
    saveDB();
    res.json({ id, invoiceNumber, customerId, jobId, status, items, subtotal, tax, total, dueDate, notes, createdAt });
  } catch (error) {
    console.error('Error in POST /api/invoices:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/invoices/:id', (req, res) => {
  try {
    const { status, paidDate } = req.body;
    const updatedAt = new Date().toISOString();
    db.run("UPDATE invoices SET status = ?, paidDate = ?, updatedAt = ? WHERE id = ?",
      [toNull(status), toNull(paidDate), updatedAt, req.params.id]);
    saveDB();
    res.json({ success: true });
  } catch (error) {
    console.error('Error in PUT /api/invoices/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// Estimates
app.get('/api/estimates', (req, res) => {
  try {
    const result = db.exec("SELECT * FROM estimates ORDER BY createdAt DESC");
    const estimates = queryToObjects(result).map(est => ({
      ...est,
      items: est.items ? JSON.parse(est.items) : []
    }));
    res.json(estimates);
  } catch (error) {
    console.error('Error in /api/estimates:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/estimates', (req, res) => {
  try {
    const { id, estimateNumber, customerId, jobId, status, items, subtotal, tax, total, validUntil, notes } = req.body;
    const createdAt = new Date().toISOString();
    db.run("INSERT INTO estimates (id, estimateNumber, customerId, jobId, status, items, subtotal, tax, total, validUntil, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, estimateNumber, toNull(customerId), toNull(jobId), toNull(status) || 'draft', JSON.stringify(items || []), toNull(subtotal) || 0, toNull(tax) || 0, toNull(total) || 0, toNull(validUntil), toNull(notes), createdAt, createdAt]);
    saveDB();
    res.json({ id, estimateNumber, customerId, jobId, status, items, subtotal, tax, total, validUntil, notes, createdAt });
  } catch (error) {
    console.error('Error in POST /api/estimates:', error);
    res.status(500).json({ error: error.message });
  }
});

// Monthly revenue for charts
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

// Start server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});