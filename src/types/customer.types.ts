export interface Customer {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerPayload {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;
