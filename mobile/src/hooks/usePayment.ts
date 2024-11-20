import { useCallback } from 'react';
import { useError } from './useError';
import { useLoading } from './useLoading';
import api from '../api/axiosConfig';

interface UsePaymentReturn {
  error: string | null;
  isLoading: boolean;
  getClientToken: () => Promise<string | null>;
  processPayment: (nonce: string, cart: any[]) => Promise<any>;
}

export const usePayment = () => {
  const { error, setError, clearError } = useError();
  const { isLoading, withLoading } = useLoading();

  const getClientToken = useCallback(async () => {
    return await withLoading(async () => {
      try {
        clearError();
        const { data } = await api.get('/braintree/token');
        return data.clientToken;
      } catch (err) {
        setError(err);
        return null;
      }
    });
  }, []);

  const processPayment = useCallback(async (nonce: string, cart: any[]) => {
    return await withLoading(async () => {
      try {
        clearError();
        const { data } = await api.post('/braintree/payment', { nonce, cart });
        return data;
      } catch (err) {
        setError(err);
        return null;
      }
    });
  }, []);

  return {
    error: error?.message || null,
    isLoading,
    getClientToken,
    processPayment,
  };
};

export default usePayment;