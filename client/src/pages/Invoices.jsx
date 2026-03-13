import { useState, useEffect } from 'react';

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customer_id: '', job_id: '', amount: 0, tax: 0, due_date: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    const [invRes, custRes, jobsRes] = await Promise.all([
      fetch('/api/invoices', { headers }),
      fetch('/api/customers', { headers }),
      fetch('/api/jobs', { headers })
    ]);
    setInvoices(await invRes.json());
    setCustomers(await custRes.json());
    setJobs(await jobsRes.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = { 'Content-Type': 'application/json', ...(token !== 'demo' && { Authorization: `Bearer ${token}` }) };
    await fetch('/api/invoices', { method: 'POST', headers, body: JSON.stringify(form) });
    setShowModal(false);
    setForm({ customer_id: '', job_id: '', amount: 0, tax: 0, due_date: '' });
    loadData();
  };

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = { 'Content-Type': 'application/json', ...(token !== 'demo' && { Authorization: `Bearer ${token}` }) };
    await fetch(`/api/invoices/${id}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status }) });
    loadData();
  };

  const getTotal = () => form.amount + (form.tax || 0);

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value">{invoices.length}</div>
          <div className="stat-label">Total Invoices</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-warning">
            ${invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
          </div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-success">
            ${invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0).toFixed(2)}
          </div>
          <div className="stat-label">Paid</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Invoices</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ New Invoice</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {invoices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <p className="empty-title">No invoices yet</p>
              <p className="empty-desc">Create your first invoice</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Job</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id}>
                      <td className="font-bold">{inv.invoice_number}</td>
                      <td>{inv.customer_name || '—'}</td>
                      <td>{inv.job_title || '—'}</td>
                      <td>${inv.total?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={`badge badge-${inv.status}`}>{inv.status}</span>
                      </td>
                      <td>{inv.due_date || '—'}</td>
                      <td>
                        {inv.status === 'pending' && (
                          <button className="btn btn-primary btn-sm" onClick={() => handleStatusChange(inv.id, 'paid')}>
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">New Invoice</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Customer</label>
                  <select className="form-select" value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})}>
                    <option value="">Select customer</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Job (optional)</label>
                  <select className="form-select" value={form.job_id} onChange={e => setForm({...form, job_id: e.target.value})}>
                    <option value="">Select job</option>
                    {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Subtotal ($)</label>
                    <input className="form-input" type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tax ($)</label>
                    <input className="form-input" type="number" step="0.01" value={form.tax} onChange={e => setForm({...form, tax: parseFloat(e.target.value) || 0})} />
                  </div>
                </div>
                <div className="form-group" style={{ background: 'var(--gray-50)', padding: '12px', borderRadius: '8px' }}>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold" style={{ fontSize: '1.25rem' }}>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-input" type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Invoices;