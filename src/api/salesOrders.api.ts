import { axiosInstance } from './axiosInstance';
import type { CreateSalesOrderPayload, SalesOrder, UpdateSalesOrderPayload } from '../types';

export const salesOrdersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<SalesOrder[]>('/sales-orders');
    return data;
  },
  create: async (payload: CreateSalesOrderPayload) => {
    const { data } = await axiosInstance.post<SalesOrder>('/sales-orders', payload);
    return data;
  },
  update: async (id: string, payload: UpdateSalesOrderPayload) => {
    const { data } = await axiosInstance.put<SalesOrder>(`/sales-orders/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<SalesOrder>(`/sales-orders/${id}`);
    return data;
  },
  confirm: async (id: string) => {
    const { data } = await axiosInstance.post<SalesOrder>(`/sales-orders/${id}/confirm`);
    return data;
  },
  deliver: async (id: string) => {
    const { data } = await axiosInstance.post<SalesOrder>(`/sales-orders/${id}/deliver`);
    return data;
  },
  cancel: async (id: string) => {
    const { data } = await axiosInstance.post<SalesOrder>(`/sales-orders/${id}/cancel`);
    return data;
  },
};
