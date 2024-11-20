// src/mobile/src/hooks/useOrders.ts

import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types/navigation';
import { useError } from './useError';
import { useLoading } from './useLoading';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axiosConfig';

export const useOrders = (isAdmin: boolean = false) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { error, setError, clearError } = useError();
  const { isLoading, withLoading } = useLoading(true);
  const { auth } = useAuth();

  const loadOrders = useCallback(async () => {
    if (!auth?.token) return;
    
    try {
      clearError();
      const endpoint = isAdmin ? '/all-orders' : '/orders';
      const { data } = await api.get(endpoint);
      setOrders(data);
    } catch (err) {
      setError(err);
    }
  }, [isAdmin, auth?.token]);

  useEffect(() => {
    // Wrap loadOrders in a function for withLoading
    withLoading(async () => {
      await loadOrders();
    });
  }, [auth?.token, isAdmin, loadOrders]);

  const refreshOrders = useCallback(() => {
    // Return the wrapped function
    return withLoading(async () => {
      await loadOrders();
    });
  }, [loadOrders]);

  return {
    orders,
    error: error?.message || null,
    isLoading,
    refreshOrders,
  };
};