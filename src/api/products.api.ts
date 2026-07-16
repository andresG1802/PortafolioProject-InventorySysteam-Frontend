import { axiosInstance } from './axiosInstance';
import type { CreateProductPayload, Product, ProductStock, UpdateProductPayload } from '../types';

export const productsApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<Product[]>('/products');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<Product>(`/products/${id}`);
    return data;
  },
  getStock: async (id: string) => {
    const { data } = await axiosInstance.get<ProductStock>(`/products/${id}/stock`);
    return data;
  },
  create: async (payload: CreateProductPayload) => {
    const { data } = await axiosInstance.post<Product>('/products', payload);
    return data;
  },
  update: async (id: string, payload: UpdateProductPayload) => {
    const { data } = await axiosInstance.put<Product>(`/products/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<Product>(`/products/${id}`);
    return data;
  },
};
