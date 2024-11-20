// src/mobile/src/hooks/useProducts.ts

import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types/navigation';
import { useError } from './useError';
import { useLoading } from './useLoading';
import api from '../api/axiosConfig';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { error, setError, clearError } = useError();
  const { isLoading, withLoading } = useLoading(true);

  const loadProducts = useCallback(async () => {
    try {
      clearError();
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    withLoading(async () => {
      await loadProducts();
    });
  }, [loadProducts]);

  const filterProducts = useCallback(async (categoryId?: string) => {
    return withLoading(async () => {
      try {
        clearError();
        if (!categoryId) {
          // If no category, load all products
          const { data } = await api.get('/products');
          setProducts(data);
        } else {
          const { data } = await api.get(`/products-by-category/${categoryId}`);
          // Extract products from the response structure
          setProducts(data.products || []);
        }
      } catch (err) {
        setError(err);
      }
    });
  }, []);

  const searchProducts = useCallback(async (query: string) => {
    return withLoading(async () => {
      try {
        clearError();
        if (!query.trim()) {
          await loadProducts();
          return;
        }
        const { data } = await api.get(`/products/search/${query}`);
        setProducts(data);
      } catch (err) {
        setError(err);
      }
    });
  }, [loadProducts]);

// src/mobile/src/hooks/useProducts.ts

const getProductById = useCallback(async (productId: string): Promise<Product> => {
  try {
    clearError();
    // First get the product's slug
    const { data: allProducts } = await api.get('/products');
    const product = allProducts.find((p: Product) => p._id === productId);
    
    if (!product?.slug) {
      throw new Error('Produto não encontrado');
    }

    // Then use the slug to fetch detailed product data
    const { data } = await api.get(`/product/${product.slug}`);
    
    if (!data) {
      throw new Error('Produto não encontrado');
    }

    return data;
  } catch (err) {
    setError(err);
    throw new Error('Não foi possível carregar o produto');
  }
}, []);

  const refreshProducts = useCallback(() => {
    return withLoading(async () => {
      await loadProducts();
    });
  }, [loadProducts]);

  return {
    products,
    error: error?.message || null,
    isLoading,
    refreshProducts,
    filterProducts,
    searchProducts,
    getProductById
  };
};

export default useProducts;