import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, MoreVertical } from 'lucide-react';
import { Customer } from '../../types';
import { Card, Badge } from '../ui';

interface CustomerCardProps {
  customer: Customer;
  onClick?: () => void;
}

export function CustomerCard({ customer, onClick }: CustomerCardProps) {
  return (
    <Card hoverable onClick={onClick} className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{customer.name}</h3>
            <p className="text-sm text-gray-500">Customer since {new Date(customer.createdAt).getFullYear()}</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="truncate">{customer.email}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4 text-gray-400" />
          <span>{customer.phone}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate">{customer.city}, {customer.state}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{customer.totalJobs}</p>
            <p className="text-xs text-gray-500">Jobs</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">${customer.totalSpent.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Total Spent</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Customer List Component
interface CustomerListProps {
  customers: Customer[];
  onCustomerClick?: (customer: Customer) => void;
}

export function CustomerList({ customers, onCustomerClick }: CustomerListProps) {
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No customers found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {customers.map(customer => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onClick={() => onCustomerClick?.(customer)}
        />
      ))}
    </div>
  );
}

// Customer Table Row for detailed views
export function CustomerTableRow({ customer, onClick }: { customer: Customer; onClick?: () => void }) {
  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-primary font-medium">
              {customer.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{customer.name}</p>
            <p className="text-sm text-gray-500">{customer.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
      <td className="px-4 py-3 text-gray-600">{customer.city}, {customer.state}</td>
      <td className="px-4 py-3 text-center">
        <span className="font-medium text-gray-900">{customer.totalJobs}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-medium text-gray-900">${customer.totalSpent.toLocaleString()}</span>
      </td>
    </tr>
  );
}