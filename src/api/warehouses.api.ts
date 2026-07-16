import { axiosInstance } from './axiosInstance';
import type { Warehouse, CreateWarehousePayload, UpdateWarehousePayload } from '../types';

export const warehousesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<Warehouse[]>('/warehouses');
    return data;
  },
  create: async (payload: CreateWarehousePayload) => {
    const { data } = await axiosInstance.post<Warehouse>('/warehouses', payload);
    return data;
  },
  update: async (id: string, payload: UpdateWarehousePayload) => {
    const { data } = await axiosInstance.put<Warehouse>(`/warehouses/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<Warehouse>(`/warehouses/${id}`);
    return data;
  },
};
