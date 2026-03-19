import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  label: string;
  variant?: 'indigo' | 'green' | 'amber' | 'red' | 'slate' | 'blue';
}

const variantClass = {
  indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'slate' }) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variantClass[variant]
    )}
  >
    {label}
  </span>
);

// Status badge helpers
export const ProjectStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    EN_COURS: { label: 'In Progress', variant: 'indigo' },
    TERMINE: { label: 'Completed', variant: 'green' },
  };
  const config = map[status] ?? { label: status, variant: 'slate' };
  return <Badge label={config.label} variant={config.variant} />;
};

export const TaskStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    A_FAIRE: { label: 'To Do', variant: 'amber' },
    TERMINEE: { label: 'Done', variant: 'green' },
  };
  const config = map[status] ?? { label: status, variant: 'slate' };
  return <Badge label={config.label} variant={config.variant} />;
};

export const InvoiceStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    EN_ATTENTE: { label: 'Pending', variant: 'amber' },
    PAYEE: { label: 'Paid', variant: 'green' },
    ANNULEE: { label: 'Cancelled', variant: 'red' },
  };
  const config = map[status] ?? { label: status, variant: 'slate' };
  return <Badge label={config.label} variant={config.variant} />;
};

export const UserStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    ACTIVE: { label: 'Active', variant: 'green' },
    BANNED: { label: 'Banned', variant: 'red' },
  };
  const config = map[status] ?? { label: status, variant: 'slate' };
  return <Badge label={config.label} variant={config.variant} />;
};
