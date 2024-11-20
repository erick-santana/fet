// src/navigation/AppNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { AppTabParamList } from '../types/navigation';
import { HomeNavigator } from './HomeNavigator';
import { ShopNavigator } from './ShopNavigator';
import { CartNavigator } from './CartNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import { AuthNavigator } from './AuthNavigator';
import { Feather } from '@expo/vector-icons';
import { Badge } from '../components/ui/Badge';
import { View } from 'react-native';
import theme from '../styles/theme';

const Tab = createBottomTabNavigator<AppTabParamList>();

const getTabBarIcon = (routeName: keyof AppTabParamList) => {
  const icons: Record<keyof AppTabParamList, keyof typeof Feather.glyphMap> = {
    Home: 'home',
    Shop: 'shopping-bag',
    Cart: 'shopping-cart',
    Profile: 'user',
    Auth: 'log-in'
  };
  return icons[routeName];
};

export const AppNavigator = () => {
  const { auth } = useAuth();
  const { cart } = useCart();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = getTabBarIcon(route.name);
          return (
            <View>
              <Feather name={iconName} size={size} color={color} />
              {route.name === 'Cart' && cart.length > 0 && (
                <Badge
                  content={cart.length}
                  variant="primary"
                  size="small"
                  containerStyle={{
                    position: 'absolute',
                    top: -8,
                    right: -12,
                  }}
                />
              )}
            </View>
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border.light,
          paddingBottom: theme.spacing.small,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.small,
          marginTop: -5,
          marginBottom: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeNavigator}
        options={{ title: 'Home',
          headerShown: false,
         }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopNavigator}
        options={{ title: 'Shop',
          headerShown: false,
         }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartNavigator}
        options={{ title: 'Cart',
          headerShown: false,
         }}
      />
      {auth.token ? (
        <Tab.Screen 
          name="Profile" 
          component={ProfileNavigator}
          options={{ 
            title: auth.user?.role === 1 ? 'Admin' : 'Perfil',
            headerShown: false,
          }}
        />
      ) : (
        <Tab.Screen 
          name="Auth" 
          component={AuthNavigator}
          options={{ 
            title: 'Login',
            headerShown: false,
          }}
        />
      )}
    </Tab.Navigator>
  );
};