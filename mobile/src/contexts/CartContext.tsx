import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { useError } from '../hooks/useError';
import { Product } from '../types/navigation';

export interface CartProduct extends Product {
  quantity: number;
}

interface CartContextData {
  cart: CartProduct[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { error, setError, clearError } = useError();

  // Load cart from storage when app starts
  useEffect(() => {
    loadCart();
  }, []);

  const saveCart = async (newCart: CartProduct[]) => {
    try {
      await storage.set(STORAGE_KEYS.CART, newCart);
      setCart(newCart);
    } catch (err) {
      setError(err);
    }
  };

  const loadCart = async () => {
    try {
      setLoading(true);
      clearError();
      const savedCart = await storage.get<CartProduct[]>(STORAGE_KEYS.CART);
      if (savedCart) {
        setCart(savedCart);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product: Product) => {
    try {
      clearError();
      const existingProductIndex = cart.findIndex(
        item => item._id === product._id
      );

      if (existingProductIndex > -1) {
        const newCart = [...cart];
        const currentQuantity = newCart[existingProductIndex].quantity;
        
        if (currentQuantity < product.quantity) {
          newCart[existingProductIndex].quantity += 1;
          await saveCart(newCart);
        } else {
          throw new Error('Quantidade máxima disponível atingida');
        }
      } else {
        // Add new product with quantity 1
        const newCart = [...cart, { ...product, quantity: 1 }];
        await saveCart(newCart);
      }
    } catch (err) {
      setError(err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      clearError();
      const newCart = cart.filter(item => item._id !== productId);
      await saveCart(newCart);
    } catch (err) {
      setError(err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      clearError();
      const productIndex = cart.findIndex(item => item._id === productId);
      
      if (productIndex === -1) {
        throw new Error('Produto não encontrado no carrinho');
      }

      const product = cart[productIndex];
      if (quantity > product.quantity) {
        throw new Error('Quantidade solicitada não disponível');
      }

      if (quantity < 1) {
        throw new Error('Quantidade mínima é 1');
      }

      const newCart = [...cart];
      newCart[productIndex] = { ...product, quantity };
      await saveCart(newCart);
    } catch (err) {
      setError(err);
    }
  };

  const clearCart = async () => {
    try {
      clearError();
      await storage.remove(STORAGE_KEYS.CART);
      setCart([]);
    } catch (err) {
      setError(err);
    }
  };

  const getCartTotal = useCallback((): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error: error?.message || null,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};