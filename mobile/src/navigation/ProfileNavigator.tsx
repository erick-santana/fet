import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';
import { UserStackParamList, AdminStackParamList } from '../types/navigation';
import theme from '../styles/theme';

// User Screens
import { UserDashboardScreen } from '../screens/user/UserDashboardScreen';
import { UserProfileScreen } from '../screens/user/UserProfileScreen';
import { UserOrderScreen } from '../screens/user/UserOrderScreen';
import { UserAddressScreen } from '../screens/user/UserAddressScreen';

// Admin Screens
import { AdminDashboardScreen } from '../screens/admin/AdminDashboardScreen';
import { ProductManagementScreen } from '../screens/admin/ProductManagementScreen';
import { CategoryManagementScreen } from '../screens/admin/CategoryManagementScreen';
import { OrderManagementScreen } from '../screens/admin/OrderManagementScreen';
import { ProductFormScreen } from '../screens/admin/ProductFormScreen';
import { AdminOrderDetailsScreen } from '../screens/admin/AdminOrderDetailsScreen';

const UserStack = createNativeStackNavigator<UserStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();

const screenOptions = {
  headerShown: true,
  headerStyle: {
    backgroundColor: theme.colors.background,
  },
  headerTintColor: theme.colors.text.primary,
  headerTitleStyle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600' as const, // Fixed typing issue by adding 'as const'
  },
  headerShadowVisible: false,
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
};

export const ProfileNavigator = () => {
  const { auth } = useAuth();
  const isAdmin = auth.user?.role === 1;

  if (isAdmin) {
    return (
      <AdminStack.Navigator screenOptions={screenOptions}>
        <AdminStack.Screen 
          name="Dashboard" 
          component={AdminDashboardScreen}
          options={{ title: 'Painel de Gerenciamento',
            headerTitleAlign: 'center',
            
           }}
        />
        <AdminStack.Screen 
          name="Products" 
          component={ProductManagementScreen}
          options={{ title: 'Produtos',
            headerTitleAlign: 'center'
           }}
        />
        <AdminStack.Screen 
          name="ProductForm" 
          component={ProductFormScreen}
          options={({ route }) => ({
            title: route.params.mode === 'create' ? 'Novo Produto' : 'Editar Produto',
            headerTitleAlign: 'center'
          })}
        />
        <AdminStack.Screen 
          name="Categories" 
          component={CategoryManagementScreen}
          options={{ title: 'Categorias',
            headerTitleAlign: 'center'
           }}
        />
        <AdminStack.Screen 
          name="Orders" 
          component={OrderManagementScreen}
          options={{ title: 'Pedidos',
            headerTitleAlign: 'center'
           }}
        />
        <AdminStack.Screen 
          name="OrderDetails" 
          component={AdminOrderDetailsScreen}
          options={{ title: 'Detalhes do Pedido',
            headerTitleAlign: 'center'
           }}
        />
      </AdminStack.Navigator>
    );
  }

  return (
    <UserStack.Navigator screenOptions={screenOptions}>
      <UserStack.Screen 
        name="UserDashboard" 
        component={UserDashboardScreen}
        options={{ title: 'Minha Conta',
          headerTitleAlign: 'center'
         }}
      />
      <UserStack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{ title: 'Perfil do Usuário',
          headerTitleAlign: 'center',
          headerShown: false
        }}
      />
      <UserStack.Screen 
        name="UserOrders" 
        component={UserOrderScreen}
        options={{ title: 'Meus Pedidos',
          headerTitleAlign: 'center'
         }}
      />
      <UserStack.Screen 
        name="UserAddress" 
        component={UserAddressScreen}
        options={{ title: 'Endereço de Entrega',
          headerTitleAlign: 'center',
          headerShown: false
         }}
      />
    </UserStack.Navigator>
  );
};