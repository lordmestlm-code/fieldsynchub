import { useState, useEffect } from 'react';

function Reports() {
  const [revenue, setRevenue] = useState([]);
  const [jobsByStatus, setJobsByStatus] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    
    const [revRes, statusRes, custRes] = await Promise.all([
      fetch(`/api/reports/revenue?period=${period}`, { headers }),
      fetch('/api/reports/jobs-by-status', { headers }),
      fetch('/api/reports/top-customers', { headers })
    ]);
    
    setRevenue(await revRes.json());
    setJobsByStatus(await statusRes.json());
    setTopCustomers(await custRes.json());
    setLoading(false);
  };

  const totalRevenue = revenue.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const totalJobs = jobsByStatus.reduce((sum, s) => sum + (s.count || 0), 0);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">💰</div>
          <div className="stat-value">${totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue ({period})</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon accent">📋</div>
          <div className="stat-value">{totalJobs}</div>
          <div className="stat-label">Total Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon success">✓</div>
          <div className="stat-value">{jobsByStatus.find(s => s.status === 'completed')?.count || 0}</div>
          <div className="stat-label">Completed Jobs</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon warning">⏳</div>
          <div className="stat-value">{jobsByStatus.find(s => s.status === 'pending')?.count || 0}</div>
          <div className="stat-label">Pending Jobs</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Revenue Over Time</h3>
            <select className="form-select" style={{ width: 'auto' }} value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="week">Weekly</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>
          <div className="card-body">
            {revenue.length === 0 ? (
              <div className="text-center text-muted">No revenue data</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {revenue.map((r, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-muted">{r.period}</span>
                    <div style={{ flex: 1, margin: '0 16px', height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(r.revenue / Math.max(...revenue.map(x => x.revenue || 0), 1)) * 100}%`, 
                        height: '100%', 
                        background: 'var(--accent)',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                    <span className="font-bold">${(r.revenue || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Jobs by Status</h3>
          </div>
          <div className="card-body">
            {jobsByStatus.length === 0 ? (
              <div className="text-center text-muted">No job data</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {jobsByStatus.map(s => (
                  <div key={s.status} className="flex items-center justify-between">
                    <span style={{ textTransform: 'capitalize' }}>{s.status.replace('_', ' ')}</span>
                    <div style={{ flex: 1, margin: '0 16px', height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(s.count / Math.max(...jobsByStatus.map(x => x.count || 0), 1)) * 100}%`, 
                        height: '100%', 
                        background: s.status === 'completed' ? 'var(--success)' : s.status === 'pending' ? 'var(--warning)' : s.status === 'scheduled' ? 'var(--info)' : 'var(--accent)',
                        borderRadius: '4px'
                      }}></div>
                    </div>
                    <span className="font-bold">{s.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Top Customers</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {topCustomers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <p className="empty-title">No customer data</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Jobs</th>
                    <th>Total Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map(c => (
                    <tr key={c.id}>
                      <td className="font-bold">{c.name}</td>
                      <td>{c.job_count}</td>
                      <td>${(c.total_spent || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;