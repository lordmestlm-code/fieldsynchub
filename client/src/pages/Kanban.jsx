import { useState, useEffect } from 'react';

function Kanban() {
  const [columns, setColumns] = useState({ pending: [], scheduled: [], in_progress: [], completed: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKanban();
  }, []);

  const loadKanban = async () => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = token !== 'demo' ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch('/api/jobs/kanban', { headers });
    const data = await res.json();
    setColumns(data);
    setLoading(false);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    const token = localStorage.getItem('fieldsynchub_token');
    const headers = { 'Content-Type': 'application/json', ...(token !== 'demo' && { Authorization: `Bearer ${token}` }) };
    await fetch(`/api/jobs/${jobId}/status`, { method: 'PATCH', headers, body: JSON.stringify({ status: newStatus }) });
    loadKanban();
  };

  if (loading) return <div className="text-center">Loading...</div>;

  const columnConfig = [
    { key: 'pending', title: 'Pending', color: '#ffc107' },
    { key: 'scheduled', title: 'Scheduled', color: '#17a2b8' },
    { key: 'in_progress', title: 'In Progress', color: '#90e028' },
    { key: 'completed', title: 'Completed', color: '#28a745' }
  ];

  return (
    <div className="kanban-board">
      {columnConfig.map(col => (
        <div className="kanban-column" key={col.key}>
          <div className="kanban-column-header">
            <div className="kanban-column-title" style={{ color: col.color }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: col.color, display: 'inline-block' }}></span>
              {col.title}
            </div>
            <span className="kanban-count">{columns[col.key]?.length || 0}</span>
          </div>
          <div className="kanban-tasks">
            {columns[col.key]?.map(job => (
              <div className="kanban-card" key={job.id} draggable onDragEnd={(e) => {
                const rect = e.target.getBoundingClientRect();
                const x = e.clientX;
                const y = e.clientY;
                // Simple drag detection - would use proper drag-drop in production
              }}>
                <div className="kanban-card-title">{job.title}</div>
                <div className="kanban-card-customer">{job.customer_name || 'No customer'}</div>
                <div className="kanban-card-meta">
                  <div className="kanban-card-tech">
                    👷 {job.technician_name || 'Unassigned'}
                  </div>
                  {job.scheduled_date && <span>📅 {job.scheduled_date}</span>}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', gap: '4px' }}>
                  {col.key !== 'completed' && (
                    <select 
                      className="form-select" 
                      style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                      value={job.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(job.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
            {columns[col.key]?.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-400)', fontSize: '0.875rem' }}>
                No jobs
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Kanban;