import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { CartProvider } from './src/contexts/CartContext';
import { ToastProvider } from './src/contexts/ToastContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import theme from './src/styles/theme';

export default function App() {
  return (
    <NavigationContainer
      theme={{
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text.primary,
          border: theme.colors.border.light,
          notification: theme.colors.error,
        },
        dark: false,
      }}
      onStateChange={(state) => {
        console.log('Navigation State Changed:', state);
      }}
    >
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </NavigationContainer>
  );
}