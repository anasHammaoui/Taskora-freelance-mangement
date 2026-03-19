import api from './axiosClient';
import type { ProjectResponse, CreateProjectRequest, Page, ProjectStatus } from '../types';

export const projectsApi = {
  getAll: (params?: { status?: ProjectStatus; page?: number; size?: number }) =>
    api.get<Page<ProjectResponse>>('/projects', { params }).then((r) => r.data),

  getByUser: (userId: number, params?: { status?: ProjectStatus; page?: number; size?: number }) =>
    api.get<Page<ProjectResponse>>(`/projects/user/${userId}`, { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<ProjectResponse>(`/projects/${id}`).then((r) => r.data),

  create: (data: CreateProjectRequest) =>
    api.post<ProjectResponse>('/projects', data).then((r) => r.data),

  update: (id: number, data: CreateProjectRequest) =>
    api.put<ProjectResponse>(`/projects/${id}`, data).then((r) => r.data),

  markComplete: (id: number) =>
    api.patch<ProjectResponse>(`/projects/${id}/complete`).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/projects/${id}`).then((r) => r.data),
};
