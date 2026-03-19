import api from './axiosClient';
import type { InvoiceResponse, CreateInvoiceRequest, Page, InvoiceStatus } from '../types';

export const invoicesApi = {
  getAll: (params?: { page?: number; size?: number }) =>
    api.get<Page<InvoiceResponse>>('/invoices', { params }).then((r) => r.data),

  getByUser: (userId: number, params?: { status?: InvoiceStatus; page?: number; size?: number }) =>
    api.get<Page<InvoiceResponse>>(`/invoices/user/${userId}`, { params }).then((r) => r.data),

  getByProject: (projectId: number, params?: { page?: number; size?: number }) =>
    api.get<Page<InvoiceResponse>>(`/invoices/project/${projectId}`, { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<InvoiceResponse>(`/invoices/${id}`).then((r) => r.data),

  create: (data: CreateInvoiceRequest) =>
    api.post<InvoiceResponse>('/invoices', data).then((r) => r.data),

  markPaid: (id: number) =>
    api.patch<InvoiceResponse>(`/invoices/${id}/pay`).then((r) => r.data),

  cancel: (id: number) =>
    api.patch<InvoiceResponse>(`/invoices/${id}/cancel`).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/invoices/${id}`).then((r) => r.data),
};
