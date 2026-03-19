import api from './axiosClient';
import type { FreelancerDashboardResponse, AdminDashboardResponse } from '../types';

export const dashboardApi = {
  getFreelancer: (userId: number) =>
    api.get<FreelancerDashboardResponse>(`/dashboard/freelancer/${userId}`).then((r) => r.data),

  getAdmin: () =>
    api.get<AdminDashboardResponse>('/dashboard/admin').then((r) => r.data),
};
