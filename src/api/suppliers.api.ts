import { axiosInstance } from './axiosInstance';
import type { Supplier, CreateSupplierPayload, UpdateSupplierPayload } from '../types';

export const suppliersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<Supplier[]>('/suppliers');
    return data;
  },
  create: async (payload: CreateSupplierPayload) => {
    const { data } = await axiosInstance.post<Supplier>('/suppliers', payload);
    return data;
  },
  update: async (id: string, payload: UpdateSupplierPayload) => {
    const { data } = await axiosInstance.put<Supplier>(`/suppliers/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<Supplier>(`/suppliers/${id}`);
    return data;
  },
};
