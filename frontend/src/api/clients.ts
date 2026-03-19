import api from './axiosClient';
import type { ClientResponse, CreateClientRequest, Page } from '../types';

export const clientsApi = {
  getAll: (params?: { search?: string; page?: number; size?: number }) =>
    api.get<Page<ClientResponse>>('/clients', { params }).then((r) => r.data),

  getByUser: (userId: number, params?: { page?: number; size?: number }) =>
    api.get<Page<ClientResponse>>(`/clients/user/${userId}`, { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<ClientResponse>(`/clients/${id}`).then((r) => r.data),

  create: (data: CreateClientRequest) =>
    api.post<ClientResponse>('/clients', data).then((r) => r.data),

  update: (id: number, data: CreateClientRequest) =>
    api.put<ClientResponse>(`/clients/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/clients/${id}`).then((r) => r.data),
};
