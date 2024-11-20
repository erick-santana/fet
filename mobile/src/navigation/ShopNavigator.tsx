import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ShopStackParamList } from '../types/navigation';
import { ShopScreen } from '../screens/shop/ShopScreen';
import { ProductDetailsScreen } from '../screens/shop/ProductDetailsScreen';
import { CategoryProductsScreen } from '../screens/shop/CategoryProductsScreen';
import { SearchResultsScreen } from '../screens/shop/SearchResultsScreen';
import  theme  from '../styles/theme';

const Stack = createNativeStackNavigator<ShopStackParamList>();

const screenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: theme.colors.background,
  },
  headerTintColor: theme.colors.text.primary,
  headerTitleStyle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: "600" as "600",
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
};

export const ShopNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen 
        name="ShopList" 
        component={ShopScreen}
        options={{ title: 'Shop',
          headerTitleAlign: 'center'
         }}
      />
      <Stack.Screen 
        name="ProductDetails" 
        component={ProductDetailsScreen}
        options={{ title: 'Product',
          headerTitleAlign: 'center'
         }}
      />
      <Stack.Screen 
        name="CategoryProducts" 
        component={CategoryProductsScreen}
        options={({ route }) => ({ title: route.params.categoryName })}
      />
      <Stack.Screen 
        name="SearchResults" 
        component={SearchResultsScreen}
        options={{ title: 'Search Results',
          headerTitleAlign: 'center'
         }}
      />
    </Stack.Navigator>
  );
};