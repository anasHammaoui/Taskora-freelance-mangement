import React from 'react';
import { cn } from '../../utils/cn';

export const Loader: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('flex items-center justify-center py-16', className)}>
    <div className="w-8 h-8 border-4 border-indigo-100 dark:border-slate-700 border-t-indigo-600 rounded-full animate-spin" />
  </div>
);

export const SkeletonRow: React.FC = () => (
  <div className="flex gap-4 animate-pulse py-3">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full flex-1" />
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-24" />
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
  </div>
);

export const SkeletonCard: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 flex flex-col gap-4">
    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full w-1/3" />
    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full w-1/2" />
    <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-full w-2/3" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);
