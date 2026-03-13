import { useState, useEffect } from 'react';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ 
    customer_id: '', technician_id: '', title: '', description: '', 
    status: 'pending', priority: 'normal', scheduled_date: '', scheduled_time: '', total_amount: 0 
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    
    const [jobsRes, custRes, techRes] = await Promise.all([
      fetch('/api/jobs', { headers }),
      fetch('/api/customers', { headers }),
      fetch('/api/technicians', { headers })
    ]);
    
    setJobs(await jobsRes.json());
    setCustomers(await custRes.json());
    setTechnicians(await techRes.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = { 'Content-Type': 'application/json', ...(token !== 'demo' && { Authorization: `Bearer ${token}` }) };
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/jobs/${editingId}` : '/api/jobs';
    
    await fetch(url, { method, headers, body: JSON.stringify(form) });
    setShowModal(false);
    resetForm();
    loadData();
  };

  const handleEdit = (job) => {
    setForm({
      customer_id: job.customer_id || '',
      technician_id: job.technician_id || '',
      title: job.title || '',
      description: job.description || '',
      status: job.status || 'pending',
      priority: job.priority || 'normal',
      scheduled_date: job.scheduled_date || '',
      scheduled_time: job.scheduled_time || '',
      total_amount: job.total_amount || 0
    });
    setEditingId(job.id);
    setShowModal(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = { 'Content-Type': 'application/json', ...(token !== 'demo' && { Authorization: `Bearer ${token}` }) };
    await fetch(`/api/jobs/${id}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status: newStatus }) });
    loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    await fetch(`/api/jobs/${id}`, { method: 'DELETE', headers });
    loadData();
  };

  const resetForm = () => {
    setForm({ customer_id: '', technician_id: '', title: '', description: '', status: 'pending', priority: 'normal', scheduled_date: '', scheduled_time: '', total_amount: 0 });
    setEditingId(null);
  };

  const statusOptions = ['pending', 'scheduled', 'in_progress', 'completed'];
  const priorityOptions = ['low', 'normal', 'high'];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Jobs ({jobs.length})</h3>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            ➕ New Job
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {jobs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p className="empty-title">No jobs yet</p>
              <p className="empty-desc">Create your first job to get started</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Customer</th>
                    <th>Technician</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td>
                        <div className="font-bold">{job.title}</div>
                        <div className={`priority priority-${job.priority}`}>{job.priority}</div>
                      </td>
                      <td>{job.customer_name || '—'}</td>
                      <td>{job.technician_name || '—'}</td>
                      <td>{job.scheduled_date || '—'}</td>
                      <td>
                        <select 
                          className="form-select" 
                          style={{ width: 'auto', padding: '4px 8px', fontSize: '0.75rem' }}
                          value={job.status}
                          onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td>${job.total_amount?.toFixed(2) || '0.00'}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(job)}>✏️</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(job.id)}>🗑️</button>
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
              <h3 className="modal-title">{editingId ? 'Edit Job' : 'New Job'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Customer</label>
                    <select className="form-select" value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})}>
                      <option value="">Select customer</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Technician</label>
                    <select className="form-select" value={form.technician_id} onChange={e => setForm({...form, technician_id: e.target.value})}>
                      <option value="">Select technician</option>
                      {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      {statusOptions.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                      {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Scheduled Date</label>
                    <input className="form-input" type="date" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input className="form-input" type="time" value={form.scheduled_time} onChange={e => setForm({...form, scheduled_time: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount ($)</label>
                  <input className="form-input" type="number" step="0.01" value={form.total_amount} onChange={e => setForm({...form, total_amount: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Job'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;