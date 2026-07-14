import { axiosInstance } from './axiosInstance';
import type { UpdateUserPayload, User } from '../types';

export const usersApi = {
  getAll: async () => {
    const { data } = await axiosInstance.get<User[]>('/users');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<User>(`/users/${id}`);
    return data;
  },
  update: async (id: string, payload: UpdateUserPayload) => {
    const { data } = await axiosInstance.put<User>(`/users/${id}`, payload);
    return data;
  },
  remove: async (id: string) => {
    const { data } = await axiosInstance.delete<User>(`/users/${id}`);
    return data;
  },
};
