import { axiosInstance } from './axiosInstance';
import type { CreatePurchaseOrderPayload, PurchaseOrder, UpdatePurchaseOrderPayload } from '../types';

export const purchaseOrdersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<PurchaseOrder[]>('/purchase-orders');
    return data;
  },
  create: async (payload: CreatePurchaseOrderPayload) => {
    const { data } = await axiosInstance.post<PurchaseOrder>('/purchase-orders', payload);
    return data;
  },
  update: async (id: string, payload: UpdatePurchaseOrderPayload) => {
    const { data } = await axiosInstance.put<PurchaseOrder>(`/purchase-orders/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<PurchaseOrder>(`/purchase-orders/${id}`);
    return data;
  },
  confirm: async (id: string) => {
    const { data } = await axiosInstance.post<PurchaseOrder>(`/purchase-orders/${id}/confirm`);
    return data;
  },
  receive: async (id: string) => {
    const { data } = await axiosInstance.post<PurchaseOrder>(`/purchase-orders/${id}/receive`);
    return data;
  },
  cancel: async (id: string) => {
    const { data } = await axiosInstance.post<PurchaseOrder>(`/purchase-orders/${id}/cancel`);
    return data;
  },
};
