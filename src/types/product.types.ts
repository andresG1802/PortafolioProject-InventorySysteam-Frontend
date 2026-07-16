export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  categoryId?: string | null;
  supplierId?: string | null;
  category?: { id: string; name: string } | null;
  supplier?: { id: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  supplierId?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export interface ProductStock {
  productId: string;
  total: number;
  byWarehouse: { warehouseId: string; quantity: number }[];
}
