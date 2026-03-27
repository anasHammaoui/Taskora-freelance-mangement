import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format';

interface DataPoint {
  name: string;
  Revenue: number;
}

interface RevenueLineChartProps {
  data: DataPoint[];
  title: string;
  height?: number;
}

const RevenueLineChart: React.FC<RevenueLineChartProps> = ({ data, title, height = 260 }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">{title}</h2>
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `€${v}`} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }}
          {...{ formatter: (v: number) => [formatCurrency(v), 'Revenue'] } as any}
        />
        <Line type="monotone" dataKey="Revenue" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4, fill: '#4F46E5' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueLineChart;
