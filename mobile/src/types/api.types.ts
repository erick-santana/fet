// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Auth Related
export interface LoginResponse {
  user: UserData;
  token: string;
}

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: number;
  address?: string;
}

export interface UpdateProfileData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
  address?: string;
}

// Product Related
export interface ProductData {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryData;
  quantity: number;
  sold: number;
  photo?: string;
  shipping: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

// Category Related
export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
}

// Order Related
export interface OrderData {
  _id: string;
  products: ProductData[];
  payment: PaymentData;
  buyer: UserData;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentData {
  id: string;
  status: string;
  amount: number;
  method: string;
}

export type OrderStatus = 'Não processado' | 'Processando' | 'Enviado' | 'Entregue' | 'Cancelado';