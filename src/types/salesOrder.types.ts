export type SalesOrderStatus = 'DRAFT' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';

export interface SalesOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface SalesOrder {
  id: string;
  status: SalesOrderStatus;
  customerId: string;
  warehouseId: string;
  items: SalesOrderItem[];
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateSalesOrderPayload {
  customerId: string;
  warehouseId: string;
  notes?: string;
  items: SalesOrderItemInput[];
}

export type UpdateSalesOrderPayload = Partial<CreateSalesOrderPayload>;
