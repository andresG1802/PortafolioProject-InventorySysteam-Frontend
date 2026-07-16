export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER_IN' | 'TRANSFER_OUT';

export interface StockMovement {
  id: string;
  type: StockMovementType;
  quantity: number;
  productId: string;
  warehouseId: string;
  reason?: string | null;
  reference?: string | null;
  createdAt?: string;
}

export interface CreateStockMovementPayload {
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  productId: string;
  warehouseId: string;
  reason?: string;
}

export interface CreateStockTransferPayload {
  productId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  reason?: string;
}

export interface StockMovementFilter {
  productId?: string;
  warehouseId?: string;
}
