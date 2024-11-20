import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  code?: string;
  field?: string;
}

export const errorHandler = {
  // Parse error from API response
  parseError(error: unknown): AppError {
    if (error instanceof AxiosError) {
      // Handle Axios errors
      if (error.response?.data?.error) {
        return {
          message: error.response.data.error,
          code: error.response.data.code,
          field: error.response.data.field,
        };
      }
      
      // Network errors
      if (!error.response) {
        return {
          message: 'Erro de conexão. Verifique sua internet.',
          code: 'NETWORK_ERROR',
        };
      }

      // Default API error
      return {
        message: 'Ocorreu um erro no servidor. Tente novamente.',
        code: 'API_ERROR',
      };
    }

    // Handle validation errors
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'VALIDATION_ERROR',
      };
    }

    // Unknown errors
    return {
      message: 'Ocorreu um erro inesperado. Tente novamente.',
      code: 'UNKNOWN_ERROR',
    };
  },

  // Check if error is a network error
  isNetworkError(error: unknown): boolean {
    return error instanceof AxiosError && !error.response;
  },

  // Check if error is an authentication error
  isAuthError(error: unknown): boolean {
    return (
      error instanceof AxiosError && 
      (error.response?.status === 401 || error.response?.status === 403)
    );
  },

  // Format validation errors
  formatValidationErrors(errors: Record<string, string>): AppError[] {
    return Object.entries(errors).map(([field, message]) => ({
      message,
      code: 'VALIDATION_ERROR',
      field,
    }));
  },

  // Log error to console in development
  logError(error: unknown): void {
    if (__DEV__) {
      console.error('Application Error:', error);
    }
  },
};

export default errorHandler;