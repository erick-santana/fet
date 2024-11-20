// Generic Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// Function Types
export type AsyncVoidFunction = () => Promise<void>;
export type ErrorCallback = (error: Error) => void;

// Storage Types
export interface StorageItem<T> {
  key: string;
  value: T;
  timestamp: number;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  field?: string;
}