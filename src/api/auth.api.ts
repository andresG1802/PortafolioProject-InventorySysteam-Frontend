import { axiosInstance } from './axiosInstance';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types';

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  register: async (payload: RegisterPayload) => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/register', payload);
    return data;
  },
};
