export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;
