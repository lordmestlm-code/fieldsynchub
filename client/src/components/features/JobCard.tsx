import React from 'react';
import { MapPin, Clock, User, AlertTriangle, MoreVertical } from 'lucide-react';
import { Job } from '../../types';
import { Card, Badge, getStatusBadgeVariant, formatStatus } from '../ui';

interface JobCardProps {
  job: Job;
  customerName?: string;
  technicianName?: string;
  onClick?: () => void;
}

export function JobCard({ job, customerName, technicianName, onClick }: JobCardProps) {
  const priorityColors = {
    low: 'text-gray-500',
    medium: 'text-warning',
    high: 'text-orange-500',
    urgent: 'text-error',
  };

  const priorityIcons = {
    low: null,
    medium: null,
    high: <AlertTriangle className="w-3 h-3" />,
    urgent: <AlertTriangle className="w-3 h-3" />,
  };

  return (
    <Card hoverable onClick={onClick} className="relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        {customerName && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4 text-gray-400" />
            <span>{customerName}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate">{job.address}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>
            {job.scheduledDate} at {job.scheduledTime} • {job.estimatedDuration} min
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Badge variant={getStatusBadgeVariant(job.status)}>
            {formatStatus(job.status)}
          </Badge>
          
          <span className={`flex items-center gap-1 text-xs font-medium ${priorityColors[job.priority]}`}>
            {priorityIcons[job.priority]}
            {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
          </span>
        </div>

        {technicianName && (
          <span className="text-sm text-gray-500">{technicianName}</span>
        )}

        {job.price && (
          <span className="font-semibold text-primary">${job.price.toFixed(2)}</span>
        )}
      </div>
    </Card>
  );
}

// Job List Component
interface JobListProps {
  jobs: Job[];
  getCustomerName: (id: string) => string | undefined;
  getTechnicianName: (id: string) => string | undefined;
  onJobClick?: (job: Job) => void;
}

export function JobList({ jobs, getCustomerName, getTechnicianName, onJobClick }: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No jobs found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          customerName={getCustomerName(job.customerId)}
          technicianName={job.technicianId ? getTechnicianName(job.technicianId) : undefined}
          onClick={() => onJobClick?.(job)}
        />
      ))}
    </div>
  );
}