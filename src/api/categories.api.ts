import { axiosInstance } from './axiosInstance';
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types';

export const categoriesApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<Category[]>('/categories');
    return data;
  },
  create: async (payload: CreateCategoryPayload) => {
    const { data } = await axiosInstance.post<Category>('/categories', payload);
    return data;
  },
  update: async (id: string, payload: UpdateCategoryPayload) => {
    const { data } = await axiosInstance.put<Category>(`/categories/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<Category>(`/categories/${id}`);
    return data;
  },
};
