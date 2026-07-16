import { axiosInstance } from './axiosInstance';
import type { Customer, CreateCustomerPayload, UpdateCustomerPayload } from '../types';

export const customersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<Customer[]>('/customers');
    return data;
  },
  create: async (payload: CreateCustomerPayload) => {
    const { data } = await axiosInstance.post<Customer>('/customers', payload);
    return data;
  },
  update: async (id: string, payload: UpdateCustomerPayload) => {
    const { data } = await axiosInstance.put<Customer>(`/customers/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<Customer>(`/customers/${id}`);
    return data;
  },
};
