import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, padding = true }) => (
  <div
    className={cn(
      'bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm',
      padding && 'p-6',
      className
    )}
  >
    {children}
  </div>
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp, color = 'indigo' }) => {
  const colorMap: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  };

  return (
    <Card className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate">{title}</p>
        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 truncate">{value}</p>
        {trend && (
          <p className={cn('text-xs font-medium', trendUp ? 'text-green-500' : 'text-slate-400')}>
            {trend}
          </p>
        )}
      </div>
      <div className={cn('p-3 rounded-xl flex-shrink-0', colorMap[color] ?? colorMap.indigo)}>
        {icon}
      </div>
    </Card>
  );
};
