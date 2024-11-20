import { useState, useCallback } from 'react';
import { errorHandler, AppError } from '../utils/errorHandler';

interface UseErrorReturn {
  error: AppError | null;
  setError: (error: unknown) => void;
  clearError: () => void;
  isError: boolean;
}

export const useError = (): UseErrorReturn => {
  const [error, setErrorState] = useState<AppError | null>(null);

  const setError = useCallback((err: unknown) => {
    const parsedError = errorHandler.parseError(err);
    setErrorState(parsedError);
    errorHandler.logError(err);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  return {
    error,
    setError,
    clearError,
    isError: error !== null,
  };
};

export default useError;