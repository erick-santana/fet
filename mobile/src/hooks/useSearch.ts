// src/mobile/src/hooks/useSearch.ts
import { useState } from 'react';
import { Product } from '../types/navigation';
import api from '../api/axiosConfig';

export const useSearch = () => {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/products/search/${query}`);
      setResults(data);
      setError(null);
    } catch (err) {
      setError('Erro ao buscar produtos');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, searchProducts };
};