import { axiosInstance } from './axiosInstance';
import type {
  CreateStockMovementPayload,
  CreateStockTransferPayload,
  StockMovement,
  StockMovementFilter,
} from '../types';

export const stockMovementsApi = {
  getAll: async (filter: StockMovementFilter = {}) => {
    const { data } = await axiosInstance.get<StockMovement[]>('/stock-movements', { params: filter });
    return data;
  },
  create: async (payload: CreateStockMovementPayload) => {
    const { data } = await axiosInstance.post<StockMovement>('/stock-movements', payload);
    return data;
  },
  transfer: async (payload: CreateStockTransferPayload) => {
    const { data } = await axiosInstance.post<StockMovement[]>('/stock-movements/transfer', payload);
    return data;
  },
};
