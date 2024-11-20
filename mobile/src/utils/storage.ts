// src/mobile/src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { UserData } from '../types/api.types';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',    
  USER_DATA: 'user_data',      
  CART: 'cart_data',          
  THEME: 'theme_mode'         
} as const;

export const storage = {
  async set(key: string, value: any): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (key === STORAGE_KEYS.AUTH_TOKEN) {
        // Ensure token has Bearer prefix before storing
        const token = value.startsWith('Bearer ') ? value : `Bearer ${value}`;
        await SecureStore.setItemAsync(key, token);
      } else {
        await AsyncStorage.setItem(key, serializedValue);
      }
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      let value: string | null;
      if (key === STORAGE_KEYS.AUTH_TOKEN) {
        value = await SecureStore.getItemAsync(key);
        console.log('Token recuperado do SecureStore:', value);
      } else {
        value = await AsyncStorage.getItem(key);
        if (key === STORAGE_KEYS.USER_DATA) {
          console.log('Usuário recuperado:', value);
        }
      }

      if (!value) {
        console.log(`Não foi encontrado valor para a chave: ${key}`);
        return null;
      }

      try {
        return key === STORAGE_KEYS.AUTH_TOKEN ? value : JSON.parse(value);
      } catch (parseError) {
        console.error('Error parsing stored value:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Error reading from storage:', error);
      throw error;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      if (key === STORAGE_KEYS.AUTH_TOKEN) {
        await SecureStore.deleteItemAsync(key);
        console.log('Token removido do SecureStore');
      } else {
        await AsyncStorage.removeItem(key);
        console.log(`Removido valor da chave: ${key}`);
      }
    } catch (error) {
      console.error('Error removing from storage:', error);
      throw error;
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      console.log('Storage limpo completamente');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) {
      console.log('Nenhum token encontrado');
      return null;
    }
    
    // Ensure token has Bearer prefix
    const cleanToken = token.replace('Bearer ', '');
    return `Bearer ${cleanToken}`;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};