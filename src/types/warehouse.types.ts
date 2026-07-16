export interface Warehouse {
  id: string;
  name: string;
  location?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateWarehousePayload {
  name: string;
  location?: string;
}

export type UpdateWarehousePayload = Partial<CreateWarehousePayload>;
