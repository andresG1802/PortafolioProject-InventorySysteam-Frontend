export type PurchaseOrderStatus = 'DRAFT' | 'CONFIRMED' | 'RECEIVED' | 'CANCELLED';

export interface PurchaseOrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  id: string;
  status: PurchaseOrderStatus;
  supplierId: string;
  warehouseId: string;
  items: PurchaseOrderItem[];
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseOrderItemInput {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseOrderPayload {
  supplierId: string;
  warehouseId: string;
  notes?: string;
  items: PurchaseOrderItemInput[];
}

export type UpdatePurchaseOrderPayload = Partial<CreatePurchaseOrderPayload>;
