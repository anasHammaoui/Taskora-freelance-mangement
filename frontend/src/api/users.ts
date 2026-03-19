import api from './axiosClient';
import type { UserResponse, Page, UserStatus } from '../types';

export const usersApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    api.get<Page<UserResponse>>('/users', { params }).then((r) => r.data),

  getFreelancers: (params?: { status?: UserStatus; search?: string; page?: number; size?: number }) =>
    api.get<Page<UserResponse>>('/users/freelancers', { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<UserResponse>(`/users/${id}`).then((r) => r.data),

  ban: (id: number) =>
    api.patch<UserResponse>(`/users/${id}/ban`).then((r) => r.data),

  activate: (id: number) =>
    api.patch<UserResponse>(`/users/${id}/activate`).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/users/${id}`).then((r) => r.data),
};
