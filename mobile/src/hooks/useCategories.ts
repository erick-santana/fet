// src/mobile/src/hooks/useCategories.ts

import { useState, useEffect, useCallback } from 'react';
import { Category } from '../types/navigation';
import { useError } from './useError';
import { useLoading } from './useLoading';
import api from '../api/axiosConfig';

export const useCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { error, setError, clearError } = useError();
  const { isLoading, withLoading } = useLoading(true);

  const loadCategories = useCallback(async () => {
    try {
      clearError();
      const { data } = await api.get('/categories');
      setCategories(data);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    withLoading(async () => {
      await loadCategories();
    });
  }, [loadCategories]);

  const searchCategories = useCallback(async (query: string) => {
    return withLoading(async () => {
      try {
        clearError();
        if (!query.trim()) {
          await loadCategories();
          return;
        }
        const filtered = categories.filter(category => 
          category.name.toLowerCase().includes(query.toLowerCase())
        );
        setCategories(filtered);
      } catch (err) {
        setError(err);
      }
    });
  }, [categories, loadCategories]);

  const refreshCategories = useCallback(() => {
    return withLoading(async () => {
      await loadCategories();
    });
  }, [loadCategories]);

  return {
    categories,
    error: error?.message || null,
    isLoading,
    refreshCategories,
    searchCategories,
  };
};

export default useCategory;