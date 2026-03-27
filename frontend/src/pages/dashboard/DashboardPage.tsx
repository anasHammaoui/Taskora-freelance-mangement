import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { dashboardApi } from '../../api/dashboard';
import DashboardSkeleton from '../../components/dashboard/DashboardSkeleton';
import FreelancerDashboard from '../../components/dashboard/FreelancerDashboard';
import AdminDashboard from '../../components/dashboard/AdminDashboard';

const DashboardPage: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user);
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const [freelancerData, setFreelancerData] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    if (isAdmin) {
      dashboardApi.getAdmin()
        .then((d) => { if (!cancelled) { setAdminData(d); setLoading(false); } })
        .catch(() => setLoading(false));
    } else if (user?.userId) {
      dashboardApi.getFreelancer(user.userId)
        .then((d) => { if (!cancelled) { setFreelancerData(d); setLoading(false); } })
        .catch(() => setLoading(false));
    }
    return () => { cancelled = true; };
  }, [isAdmin, user?.userId]);

  if (loading) return <DashboardSkeleton />;
  if (isAdmin && adminData) return <AdminDashboard data={adminData} />;
  if (!isAdmin && freelancerData) return <FreelancerDashboard data={freelancerData} userName={user?.fullName || ''} />;
  return null;
};

export default DashboardPage;
