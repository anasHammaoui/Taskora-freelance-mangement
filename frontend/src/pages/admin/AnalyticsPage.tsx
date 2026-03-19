import React from 'react';
import { dashboardApi } from '../../api/dashboard';
import { formatCurrency, formatMonth } from '../../utils/format';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { AdminDashboardResponse } from '../../types';

const COLORS = ['#22C55E', '#EF4444'];

const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = React.useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    dashboardApi.getAdmin()
      .then(setData)
      .catch(() => {/* handle */})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-64 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const revenueChartData = (data.monthlyPlatformRevenue || []).map((e) => ({
    name: formatMonth(e.month),
    Revenue: typeof e.revenue === 'string' ? parseFloat(e.revenue) : e.revenue,
  }));

  const pieData = [
    { name: 'Active', value: data.freelancerStatusBreakdown?.active || 0 },
    { name: 'Banned', value: data.freelancerStatusBreakdown?.banned || 0 },
  ];

  const projectsPieData = [
    { name: 'Active', value: data.activeProjects || 0 },
    { name: 'Completed', value: data.completedProjects || 0 },
  ];
  const PROJECT_COLORS = ['#4F46E5', '#22C55E'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Platform-wide statistics</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Freelancers', value: data.totalFreelancers, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' },
          { label: 'Active Freelancers', value: data.activeFreelancers, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
          { label: 'Total Projects', value: data.totalProjects, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
          { label: 'Platform Revenue', value: formatCurrency(data.totalPlatformRevenue), color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${kpi.color}`}>
              {kpi.label}
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Line Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">Monthly Platform Revenue</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueChartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
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

        {/* User status pie */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">Freelancer Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(( percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={10} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Projects pie */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">Project Status</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={projectsPieData} cx="50%" cy="45%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(( percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {projectsPieData.map((_, i) => <Cell key={i} fill={PROJECT_COLORS[i % PROJECT_COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={10} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">Platform Summary</h2>
          <div className="space-y-4">
            {[
              { label: 'Active Projects', value: data.activeProjects, total: data.totalProjects },
              { label: 'Completed Projects', value: data.completedProjects, total: data.totalProjects },
              { label: 'Active Users', value: data.activeFreelancers, total: data.totalFreelancers },
              { label: 'Banned Users', value: data.bannedFreelancers, total: data.totalFreelancers },
            ].map((stat) => {
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
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
