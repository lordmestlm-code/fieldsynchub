import { useState, useEffect } from 'react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', notes: '' });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch('/api/customers', { headers });
    const data = await res.json();
    setCustomers(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = { 'Content-Type': 'application/json', ...(token !== 'demo' && { Authorization: `Bearer ${token}` }) };
    
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `/api/customers/${editingId}` : '/api/customers';
    
    await fetch(url, { method, headers, body: JSON.stringify(form) });
    setShowModal(false);
    setForm({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', notes: '' });
    setEditingId(null);
    loadCustomers();
  };

  const handleEdit = (customer) => {
    setForm(customer);
    setEditingId(customer.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    await fetch(`/api/customers/${id}`, { method: 'DELETE', headers });
    loadCustomers();
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Customers ({customers.length})</h3>
          <button className="btn btn-primary" onClick={() => { setEditingId(null); setForm({ name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', notes: '' }); setShowModal(true); }}>
            ➕ Add Customer
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {customers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p className="empty-title">No customers yet</p>
              <p className="empty-desc">Add your first customer to get started</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td className="font-bold">{c.name}</td>
                      <td>{c.email || '—'}</td>
                      <td>{c.phone || '—'}</td>
                      <td>{c.city || '—'}</td>
                      <td>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleEdit(c)}>✏️</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => handleDelete(c.id)}>🗑️</button>
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
              <h3 className="modal-title">{editingId ? 'Edit Customer' : 'New Customer'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input className="form-input" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input className="form-input" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input className="form-input" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Zip</label>
                  <input className="form-input" value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea className="form-textarea" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Add Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;