import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wrench, 
  Calendar, 
  Users, 
  FileText, 
  ClipboardList,
  BarChart3,
  Settings,
  HardHat,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/jobs', icon: Wrench, label: 'Jobs' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/invoices', icon: FileText, label: 'Invoices' },
  { path: '/estimates', icon: ClipboardList, label: 'Estimates' },
  { path: '/technicians', icon: HardHat, label: 'Technicians' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { state } = useApp();
  const { currentUser } = state;

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-full bg-surface border-r border-gray-200 
        transition-all duration-300 z-40 flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">FieldSyncHub</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <HardHat className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                  }
                  ${collapsed ? 'justify-center' : ''}
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-100 p-4">
        {!collapsed && currentUser && (
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-medium text-sm">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            </div>
          </div>
        )}
        
        <div className={`flex ${collapsed ? 'flex-col' : ''} gap-2`}>
          <button
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 
              hover:bg-gray-100 transition-colors flex-1
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 
              hover:bg-gray-100 transition-colors flex-1
              ${collapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          absolute -right-3 top-20 w-6 h-6 bg-surface border border-gray-200 
          rounded-full flex items-center justify-center shadow-sm
          hover:bg-gray-50 transition-colors
          ${collapsed ? 'left-1/2 -translate-x-1/2' : ''}
        `}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        )}
      </button>
    </aside>
  );
}