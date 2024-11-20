import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartStackParamList } from '../types/navigation';
import { CartScreen } from '../screens/shop/CartScreen';
import { CheckoutScreen } from '../screens/shop/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/shop/OrderConfirmationScreen';
import theme from '../styles/theme';

const Stack = createNativeStackNavigator<CartStackParamList>();

const screenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: theme.colors.background,
  },
  headerTintColor: theme.colors.text.primary,
  headerTitleStyle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600' as const,  // Fixed typing issue
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
};

export const CartNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen 
        name="CartList" 
        component={CartScreen}
        options={{ title: 'Seu Carrinho de Compras',
          headerTitleAlign: 'center',
          
         }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen 
        name="OrderConfirmation" 
        component={OrderConfirmationScreen}
        options={{ title: 'Order Confirmation' }}
      />
    </Stack.Navigator>
  );
};