import api from './axiosClient';
import type { TaskResponse, CreateTaskRequest, Page, TaskStatus } from '../types';

export const tasksApi = {
  getByProject: (projectId: number, params?: { status?: TaskStatus; page?: number; size?: number }) =>
    api.get<Page<TaskResponse>>(`/tasks/project/${projectId}`, { params }).then((r) => r.data),

  getByUser: (userId: number, params?: { page?: number; size?: number }) =>
    api.get<Page<TaskResponse>>(`/tasks/user/${userId}`, { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<TaskResponse>(`/tasks/${id}`).then((r) => r.data),

  create: (data: CreateTaskRequest) =>
    api.post<TaskResponse>('/tasks', data).then((r) => r.data),

  update: (id: number, data: CreateTaskRequest) =>
    api.put<TaskResponse>(`/tasks/${id}`, data).then((r) => r.data),

  markDone: (id: number) =>
    api.patch<TaskResponse>(`/tasks/${id}/done`).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`).then((r) => r.data),
};
