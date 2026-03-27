import React from 'react';

interface StatItem {
  label: string;
  value: number;
  total: number;
}

interface PlatformSummaryStatsProps {
  stats: StatItem[];
}

const PlatformSummaryStats: React.FC<PlatformSummaryStatsProps> = ({ stats }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">Platform Summary</h2>
    <div className="space-y-4">
      {stats.map((stat) => {
        const pct = stat.total > 0 ? (stat.value / stat.total) * 100 : 0;
        return (
          <div key={stat.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-600 dark:text-slate-400">{stat.label}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{stat.value} / {stat.total}</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default PlatformSummaryStats;
