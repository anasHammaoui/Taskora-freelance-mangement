import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface StatusPieChartProps {
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({ title, data, colors }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
    <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">{title}</h2>
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          outerRadius={90}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Legend iconType="circle" iconSize={10} />
        <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default StatusPieChart;
