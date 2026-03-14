import React from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'pending';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  pending: 'bg-orange-100 text-orange-700',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Helper function to get badge variant from status
export function getStatusBadgeVariant(status: string): BadgeVariant {
  const statusMap: Record<string, BadgeVariant> = {
    // Job statuses
    completed: 'success',
    in_progress: 'info',
    scheduled: 'pending',
    pending: 'warning',
    cancelled: 'error',
    // Invoice statuses
    paid: 'success',
    sent: 'info',
    draft: 'default',
    overdue: 'error',
    // Estimate statuses
    accepted: 'success',
    rejected: 'error',
    expired: 'default',
    // Technician statuses
    available: 'success',
    busy: 'warning',
    offline: 'default',
  };
  return statusMap[status] || 'default';
}

// Helper function to format status for display
export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}