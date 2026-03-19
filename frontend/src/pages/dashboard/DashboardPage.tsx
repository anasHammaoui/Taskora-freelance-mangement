import React, { useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';
import { dashboardApi } from '../../api/dashboard';
import { formatCurrency, formatMonth } from '../../utils/format';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

/* ─── Stat Card ─────────────────────────────────────────────────────────────── */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{value}</p>
    </div>
  </div>
);

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-100 dark:bg-slate-800 rounded-xl ${className}`} />
);

/* ─── Dashboard Page ─────────────────────────────────────────────────────────── */
const DashboardPage: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [freelancerData, setFreelancerData] = React.useState<any>(null);
  const [adminData, setAdminData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (isAdmin) {
      dashboardApi.getAdmin().then((d) => { if (!cancelled) { setAdminData(d); setLoading(false); } }).catch(() => setLoading(false));
    } else if (user?.userId) {
      dashboardApi.getFreelancer(user.userId).then((d) => { if (!cancelled) { setFreelancerData(d); setLoading(false); } }).catch(() => setLoading(false));
    }
    return () => { cancelled = true; };
  }, [isAdmin, user?.userId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (isAdmin && adminData) return <AdminDashboard data={adminData} />;
  if (!isAdmin && freelancerData) return <FreelancerDashboard data={freelancerData} userName={user?.fullName || ''} />;
  return null;
};

/* ─── Freelancer Dashboard ───────────────────────────────────────────────────── */
const FreelancerDashboard: React.FC<{ data: any; userName: string }> = ({ data, userName }) => {
  const chartData = (data.last6MonthsRevenue || []).map((e: any) => ({
    name: formatMonth(e.month),
    Revenue: parseFloat(e.revenue) || 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
          Good day, {userName.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Here's your overview for this month</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={data.totalClients}
          color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
        />
        <StatCard
          title="Active Projects"
          value={data.activeProjects}
          color="bg-green-50 dark:bg-green-900/30 text-green-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <StatCard
          title="Pending Invoices"
          value={data.pendingInvoices}
          color="bg-amber-50 dark:bg-amber-900/30 text-amber-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(data.currentMonthRevenue)}
          color="bg-purple-50 dark:bg-purple-900/30 text-purple-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">Revenue — Last 6 months</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }}
              {...{ formatter: (v: number) => [formatCurrency(v), 'Revenue'] } as any}
            />
            <Line type="monotone" dataKey="Revenue" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4, fill: '#4F46E5' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/* ─── Admin Dashboard ────────────────────────────────────────────────────────── */
const COLORS = ['#22C55E', '#EF4444'];

const AdminDashboard: React.FC<{ data: any }> = ({ data }) => {
  const chartData = (data.monthlyPlatformRevenue || []).map((e: any) => ({
    name: formatMonth(e.month),
    Revenue: parseFloat(e.revenue) || 0,
  }));

  const pieData = [
    { name: 'Active', value: data.freelancerStatusBreakdown?.active || 0 },
    { name: 'Banned', value: data.freelancerStatusBreakdown?.banned || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Admin Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Platform metrics at a glance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Freelancers"
          value={data.totalFreelancers}
          color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
        />
        <StatCard
          title="Active Freelancers"
          value={data.activeFreelancers}
          color="bg-green-50 dark:bg-green-900/30 text-green-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Total Projects"
          value={data.totalProjects}
          color="bg-amber-50 dark:bg-amber-900/30 text-amber-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        />
        <StatCard
          title="Platform Revenue"
          value={formatCurrency(data.totalPlatformRevenue)}
          color="bg-purple-50 dark:bg-purple-900/30 text-purple-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">Platform Revenue (monthly)</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v}`} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }} { ...{ formatter: (v: number) => [formatCurrency(v), 'Revenue'] } as any} />
              <Line type="monotone" dataKey="Revenue" stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 4, fill: '#4F46E5' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-6">User Status</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" outerRadius={80} dataKey="value" labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend iconType="circle" iconSize={10} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
