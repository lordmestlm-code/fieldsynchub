import { useState, useEffect } from 'react';

function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch('/api/technicians', { headers });
    const data = await res.json();
    setTechnicians(data);
    setLoading(false);
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-value">{technicians.length}</div>
          <div className="stat-label">Total Team Members</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{technicians.filter(t => t.role === 'technician').length}</div>
          <div className="stat-label">Technicians</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{technicians.filter(t => t.role === 'admin').length}</div>
          <div className="stat-label">Admins</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Team Members</h3>
        </div>
        <div className="card-body">
          {technicians.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👷</div>
              <p className="empty-title">No team members</p>
              <p className="empty-desc">Add technicians to your team</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {technicians.map(tech => (
                <div key={tech.id} style={{ background: 'var(--gray-50)', borderRadius: '12px', padding: '20px' }}>
                  <div className="flex items-center gap-4">
                    <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.25rem' }}>
                      {tech.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold" style={{ fontSize: '1.125rem' }}>{tech.name}</div>
                      <div className="text-muted">{tech.email}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '16px', display: 'grid', gap: '8px', fontSize: '0.875rem' }}>
                    <div className="flex justify-between">
                      <span className="text-muted">Phone:</span>
                      <span>{tech.phone || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Role:</span>
                      <span className="badge" style={{ textTransform: 'capitalize' }}>{tech.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Demo Credentials</h3>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span className="badge">Admin</span></td>
                  <td>admin@fieldsynchub.com</td>
                  <td>admin123</td>
                </tr>
                <tr>
                  <td><span className="badge">Technician</span></td>
                  <td>tech@fieldsynchub.com</td>
                  <td>tech123</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Technicians;