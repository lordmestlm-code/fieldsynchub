import { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    
    Promise.all([
      fetch('/api/dashboard/stats', { headers }).then(r => r.json()),
      fetch('/api/dashboard/recent-jobs', { headers }).then(r => r.json())
    ]).then(([statsData, jobsData]) => {
      setStats(statsData);
      setRecentJobs(jobsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon primary">📋</div>
          </div>
          <div className="stat-value">{stats?.totalJobs || 0}</div>
          <div className="stat-label">Total Jobs</div>
          <div className="stat-change positive">{stats?.completionRate || 0}% completion rate</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon warning">⏳</div>
          </div>
          <div className="stat-value">{stats?.pendingJobs || 0}</div>
          <div className="stat-label">Pending Jobs</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon accent">📅</div>
          </div>
          <div className="stat-value">{stats?.scheduledToday || 0}</div>
          <div className="stat-label">Scheduled Today</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon success">💰</div>
          </div>
          <div className="stat-value">${(stats?.totalRevenue || 0).toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Jobs</h3>
            <a href="/jobs" className="btn btn-ghost btn-sm">View All</a>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {recentJobs.length === 0 ? (
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
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.slice(0, 5).map(job => (
                      <tr key={job.id}>
                        <td>
                          <div className="font-bold">{job.title}</div>
                          <div className="text-muted" style={{ fontSize: '0.8125rem' }}>{job.scheduled_date}</div>
                        </td>
                        <td>{job.customer_name || '—'}</td>
                        <td>
                          <span className={`badge badge-${job.status}`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>${job.total_amount?.toFixed(2) || '0.00'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '12px' }}>
              <a href="/jobs?new=true" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                ➕ New Job
              </a>
              <a href="/customers?new=true" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                👤 Add Customer
              </a>
              <a href="/estimates?new=true" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                📝 Create Estimate
              </a>
              <a href="/calendar" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                📅 View Calendar
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;