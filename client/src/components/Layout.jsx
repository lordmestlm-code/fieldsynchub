import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { section: 'Main', items: [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
  ]},
  { section: 'Operations', items: [
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/jobs', label: 'Jobs', icon: '📋' },
    { path: '/kanban', label: 'Kanban', icon: '✅' },
  ]},
  { section: 'Finance', items: [
    { path: '/estimates', label: 'Estimates', icon: '📝' },
    { path: '/invoices', label: 'Invoices', icon: '💰' },
  ]},
  { section: 'Team', items: [
    { path: '/technicians', label: 'Technicians', icon: '👷' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ]},
];

function Layout({ user, children, onLogout }) {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    for (const section of navItems) {
      const item = section.items.find(i => i.path === path);
      if (item) return item.label;
    }
    return 'Dashboard';
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">F</div>
            FieldSyncHub
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div className="nav-section" key={section.section}>
              <div className="nav-section-title">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role}</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onLogout} title="Logout">
              🚪
            </button>
          </div>
        </div>
      </aside>
      
      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
        </header>
        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
}

export default Layout;