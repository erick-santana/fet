// src/mobile/src/contexts/AuthContext.tsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../api/axiosConfig';
import { useError } from '../hooks/useError';
import { useLoading } from '../hooks/useLoading';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { UserData, LoginResponse, UpdateProfileData } from '../types/api.types';
import { useToast } from './ToastContext';
import axios from 'axios';

interface AuthState {
  user: UserData | null;
  token: string | null;
}

interface AuthContextData {
  auth: AuthState;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, address: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });
  const { error, setError, clearError } = useError();
  const { isLoading: loading, withLoading } = useLoading(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = await storage.get<UserData>(STORAGE_KEYS.USER_DATA);

      if (storedToken && storedUser) {
        setAuth({
          token: storedToken,
          user: storedUser,
        });
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
      await signOut();
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      clearError();
      const { data } = await api.post<LoginResponse>('/login', {
        email,
        password,
      });

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, data.token);
      await storage.set(STORAGE_KEYS.USER_DATA, data.user);

      setAuth({
        token: data.token,
        user: data.user,
      });

      showToast('Login realizado com sucesso', 'success');
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err);
      throw err;
    }
  };

  const signUp = async (name: string, email: string, password: string, address: string) => {
    try {
      clearError();
      console.log('Sending registration request with:', { name, email, address });
      
      const { data } = await api.post<LoginResponse>('/register', {
        name,
        email,
        password,
        address,
        role: 0 // Default role for regular users
      });

      if (!data.token || !data.user) {
        throw new Error('Invalid response from server');
      }

      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, data.token);
      await storage.set(STORAGE_KEYS.USER_DATA, data.user);

      setAuth({
        token: data.token,
        user: data.user,
      });

      showToast('Registro realizado com sucesso', 'success');
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER_DATA);
      
      setAuth({ user: null, token: null });
      
      showToast('Logout realizado com sucesso', 'info');
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      clearError();
      const response = await api.put('/profile', data);

      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      await storage.set(STORAGE_KEYS.USER_DATA, response.data);
      setAuth(prev => ({
        ...prev,
        user: response.data,
      }));

      showToast('Perfil atualizado com sucesso', 'success');
    } catch (err) {
      console.error('Update profile error:', err);
      if (axios.isAxiosError(err)) {
        console.log('Full error response:', err.response?.data);
        console.log('Request headers:', err.config?.headers);
      }
      setError(err);
      showToast('Erro ao atualizar perfil', 'error');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        error: error?.message || null,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};