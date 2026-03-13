import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('fieldsynchub.db');

// Initialize database tables
db.exec(`
  -- Users table (technicians, admins)
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'technician',
    phone TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Customers/CRM table
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Jobs/Work orders table
  CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    technician_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'normal',
    scheduled_date DATE,
    scheduled_time TIME,
    completed_at DATETIME,
    total_amount REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (technician_id) REFERENCES users(id)
  );

  -- Estimates table
  CREATE TABLE IF NOT EXISTS estimates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    job_id INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    amount REAL DEFAULT 0,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATE,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id)
  );

  -- Invoices table
  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    job_id INTEGER,
    estimate_id INTEGER,
    invoice_number TEXT UNIQUE NOT NULL,
    amount REAL DEFAULT 0,
    tax REAL DEFAULT 0,
    total REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    due_date DATE,
    paid_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (job_id) REFERENCES jobs(id),
    FOREIGN KEY (estimate_id) REFERENCES estimates(id)
  );

  -- Settings table
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed default admin user if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@fieldsynchub.com');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (email, password, name, role, phone)
    VALUES (?, ?, ?, ?, ?)
  `).run('admin@fieldsynchub.com', hashedPassword, 'Admin User', 'admin', '555-0100');
  
  // Seed demo technician
  const techPassword = bcrypt.hashSync('tech123', 10);
  db.prepare(`
    INSERT INTO users (email, password, name, role, phone)
    VALUES (?, ?, ?, ?, ?)
  `).run('tech@fieldsynchub.com', techPassword, 'John Smith', 'technician', '555-0101');
  
  // Seed demo customer
  db.prepare(`
    INSERT INTO customers (name, email, phone, address, city, state, zip)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('Acme Corporation', 'contact@acme.com', '555-1000', '123 Main St', 'Springfield', 'IL', '62701');
  
  // Seed demo jobs
  db.prepare(`
    INSERT INTO jobs (customer_id, technician_id, title, description, status, priority, scheduled_date, scheduled_time, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, 2, 'HVAC Maintenance', 'Annual HVAC system maintenance and filter replacement', 'scheduled', 'normal', '2026-03-15', '09:00', 250.00);
  
  db.prepare(`
    INSERT INTO jobs (customer_id, technician_id, title, description, status, priority, scheduled_date, scheduled_time, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(1, 2, 'Plumbing Repair', 'Fix leaking faucet in kitchen', 'in_progress', 'high', '2026-03-13', '14:00', 175.00);
  
  console.log('Database initialized with seed data');
}

export default db;