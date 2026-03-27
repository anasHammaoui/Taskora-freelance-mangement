import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../../api/dashboard';
import { formatCurrency, formatMonth } from '../../utils/format';
import type { AdminDashboardResponse } from '../../types';
import KpiRow from '../../components/analytics/KpiRow';
import RevenueLineChart from '../../components/analytics/RevenueLineChart';
import StatusPieChart from '../../components/analytics/StatusPieChart';
import PlatformSummaryStats from '../../components/analytics/PlatformSummaryStats';

const FREELANCER_COLORS = ['#22C55E', '#EF4444'];
const PROJECT_COLORS = ['#4F46E5', '#22C55E'];

const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const freelancerPieData = [
    { name: 'Active', value: data.freelancerStatusBreakdown?.active || 0 },
    { name: 'Banned', value: data.freelancerStatusBreakdown?.banned || 0 },
  ];

  const projectPieData = [
    { name: 'Active', value: data.activeProjects || 0 },
    { name: 'Completed', value: data.completedProjects || 0 },
  ];

  const kpiItems = [
    { label: 'Total Freelancers', value: data.totalFreelancers, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' },
    { label: 'Active Freelancers', value: data.activeFreelancers, color: 'text-green-600 bg-green-50 dark:bg-green-900/30' },
    { label: 'Total Projects', value: data.totalProjects, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Platform Revenue', value: formatCurrency(data.totalPlatformRevenue), color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/30' },
  ];

  const summaryStats = [
    { label: 'Active Projects', value: data.activeProjects, total: data.totalProjects },
    { label: 'Completed Projects', value: data.completedProjects, total: data.totalProjects },
    { label: 'Active Users', value: data.activeFreelancers, total: data.totalFreelancers },
    { label: 'Banned Users', value: data.bannedFreelancers, total: data.totalFreelancers },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Platform-wide statistics</p>
      </div>

      <KpiRow items={kpiItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueLineChart data={revenueChartData} title="Monthly Platform Revenue" />
        <StatusPieChart title="Freelancer Status" data={freelancerPieData} colors={FREELANCER_COLORS} />
        <StatusPieChart title="Project Status" data={projectPieData} colors={PROJECT_COLORS} />
        <PlatformSummaryStats stats={summaryStats} />
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
