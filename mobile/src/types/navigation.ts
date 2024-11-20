// src/mobile/src/types/navigation.ts

import { ProductData, CategoryData, OrderData, OrderStatus } from './api.types';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

export type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

// Root Stack Types
export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
  ShopNavigator: { screen: string; params?: any };
  CartNavigator: { screen: string; params?: any };
  ProfileNavigator: { screen: string; params?: any };
  ProductDetails: { productId: string; slug: string; product?: ProductData };
  Checkout: undefined;
};

// Auth Stack Types
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

// Main App Stack Types
export type AppTabParamList = {
  Home: undefined;
  Shop: undefined;
  Cart: undefined;
  Profile: undefined;
  Auth: undefined;
};

// Home Stack Types
export type HomeStackParamList = {
  HomeScreen: undefined;
  ProductDetails: { 
    productId: string;
    slug: string;
    product?: ProductData;  
  };
  CategoryProducts: { 
    categoryId: string;
    categoryName: string;
  };
};

// Shop Stack Types
export type ShopStackParamList = {
  ShopList: undefined;
  ProductDetails: { 
    productId: string;
    slug: string;
    product?: ProductData;    
  };
  CategoryProducts: { 
    categoryId: string;
    categoryName: string;
  };
  SearchResults: { query: string };
};

// Cart Stack Types
export type CartStackParamList = {
  CartList: undefined;
  Checkout: undefined;
  OrderConfirmation: { 
    orderId: string;
    status: OrderStatus;
  };
};

// User Stack Types
export type UserStackParamList = {
  UserDashboard: undefined;
  UserProfile: undefined;
  UserOrders: undefined;
  UserOrderDetails: { orderId: string };
  UserAddress: undefined;
  UserSettings: undefined;
  ShopNavigator: { screen: string; params?: any };
};

// Admin Stack Types
export type AdminStackParamList = {
  Dashboard: undefined;
  Products: undefined;
  ProductForm: { 
    product?: ProductData;
    mode: 'create' | 'edit';
  };
  Categories: undefined;
  CategoryForm: {
    category?: CategoryData;
    mode: 'create' | 'edit';
  };
  Orders: undefined;
  OrderDetails: { 
    orderId: string;
    canEdit?: boolean;
  };
};

// Adding menu item types
export interface MenuItemType<T> {
  title: string;
  icon: FeatherIconName;
  screen: keyof T;
  description: string;
}
// Navigation helper types
export type ScreenNavigationProp<T extends Record<string, any>, K extends keyof T> = 
  StackNavigationProp<T, K>;

export type ScreenRouteProp<T extends Record<string, any>, K extends keyof T> = 
  RouteProp<T, K>;

// Screen Navigation Types
export type AuthScreenNavigationProp = NavigationProp<AuthStackParamList>;
export type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList>;
export type CartScreenNavigationProp = StackNavigationProp<CartStackParamList>;
export type ShopScreenNavigationProp = StackNavigationProp<ShopStackParamList>;
export type UserScreenNavigationProp = StackNavigationProp<UserStackParamList>;
export type AdminScreenNavigationProp = StackNavigationProp<AdminStackParamList>;

// Re-export common types
export { ProductData as Product } from './api.types';
export { CategoryData as Category } from './api.types';
export { OrderData as Order } from './api.types';
export { OrderStatus } from './api.types';

// Navigation Declaration Merging
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Add type checking for screen props
export type AdminScreenProps<T extends keyof AdminStackParamList> = {
  navigation: StackNavigationProp<AdminStackParamList, T>;
  route: RouteProp<AdminStackParamList, T>;
};

// Auth Stack Navigation Props Types
export type AuthNavigationProps = {
  navigation: AuthScreenNavigationProp;
};

// Auth Stack Route Props Types
export type AuthRouteProps<T extends keyof AuthStackParamList> = {
  route: RouteProp<AuthStackParamList, T>;
};