export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}
