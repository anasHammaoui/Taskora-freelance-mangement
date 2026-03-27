import React from 'react';

interface KpiItem {
  label: string;
  value: string | number;
  color: string;
}

interface KpiRowProps {
  items: KpiItem[];
}

const KpiRow: React.FC<KpiRowProps> = ({ items }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {items.map((kpi) => (
      <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${kpi.color}`}>
          {kpi.label}
        </div>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{kpi.value}</p>
      </div>
    ))}
  </div>
);

export default KpiRow;
