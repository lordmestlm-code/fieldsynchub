import React, { useState } from 'react';
import { Bell, Search, Plus, Menu } from 'lucide-react';
import { Button } from '../ui';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  actions?: React.ReactNode;
}

export function Header({ title, onMenuClick, actions }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 bg-surface border-b border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Mobile Search Toggle */}
        <button 
          onClick={() => setSearchOpen(!searchOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* Actions */}
        {actions}

        {/* Quick Add Button */}
        <Button size="sm" className="hidden sm:flex">
          <Plus className="w-4 h-4 mr-1" />
          New Job
        </Button>
      </div>
    </header>
  );
}