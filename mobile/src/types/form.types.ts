export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string; // Added address field
}

export interface ProfileForm {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  address?: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  shipping: boolean;
  photo?: File;
}

export interface ValidationError {
  field: string;
  message: string;
}