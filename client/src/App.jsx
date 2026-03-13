import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Jobs from './pages/Jobs';
import Kanban from './pages/Kanban';
import Calendar from './pages/Calendar';
import Estimates from './pages/Estimates';
import Invoices from './pages/Invoices';
import Technicians from './pages/Technicians';
import Reports from './pages/Reports';
import Layout from './components/Layout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('fieldsynchub_user');
    const token = localStorage.getItem('fieldsynchub_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('fieldsynchub_user', JSON.stringify(userData));
    localStorage.setItem('fieldsynchub_token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('fieldsynchub_user');
    localStorage.removeItem('fieldsynchub_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/kanban" element={<Kanban />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/estimates" element={<Estimates />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/technicians" element={<Technicians />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;