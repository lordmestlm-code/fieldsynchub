import { useState, useEffect } from 'react';

function Estimates() {
  const [estimates, setEstimates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customer_id: '', title: '', description: '', amount: 0, status: 'draft', expires_at: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    const [estRes, custRes] = await Promise.all([
      fetch('/api/estimates', { headers }),
      fetch('/api/customers', { headers })
    ]);
    setEstimates(await estRes.json());
    setCustomers(await custRes.json());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = { 'Content-Type': 'application/json', ...(token !== 'demo' && { Authorization: `Bearer ${token}` }) };
    await fetch('/api/estimates', { method: 'POST', headers, body: JSON.stringify(form) });
    setShowModal(false);
    setForm({ customer_id: '', title: '', description: '', amount: 0, status: 'draft', expires_at: '' });
    loadData();
  };

  const convertToJob = async (id) => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    await fetch(`/api/estimates/${id}/convert`, { method: 'POST', headers });
    loadData();
    alert('Estimate converted to job!');
  };

  const statusOptions = ['draft', 'sent', 'accepted', 'rejected', 'converted'];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Estimates ({estimates.length})</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>➕ New Estimate</button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {estimates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p className="empty-title">No estimates yet</p>
              <p className="empty-desc">Create your first estimate</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {estimates.map(est => (
                    <tr key={est.id}>
                      <td className="font-bold">{est.title}</td>
                      <td>{est.customer_name || '—'}</td>
                      <td>${est.amount?.toFixed(2) || '0.00'}</td>
                      <td><span className={`badge badge-${est.status}`}>{est.status}</span></td>
                      <td>{est.created_at?.split('T')[0] || '—'}</td>
                      <td>
                        {est.status !== 'converted' && (
                          <button className="btn btn-primary btn-sm" onClick={() => convertToJob(est.id)}>Convert to Job</button>
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
              <h3 className="modal-title">New Estimate</h3>
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
                  <label className="form-label">Title *</label>
                  <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Amount ($)</label>
                    <input className="form-input" type="number" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: parseFloat(e.target.value) || 0})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expires At</label>
                  <input className="form-input" type="date" value={form.expires_at} onChange={e => setForm({...form, expires_at: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Estimate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Estimates;