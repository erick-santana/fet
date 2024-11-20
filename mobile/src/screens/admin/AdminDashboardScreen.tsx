// src/screens/admin/AdminDashboardScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useOrders } from '../../hooks/useOrders';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { Button } from '../../components/ui/Button';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';
import { StackNavigationProp } from '@react-navigation/stack';
import { AdminStackParamList } from '../../types/navigation';

type AdminNavigationProp = StackNavigationProp<AdminStackParamList, 'Dashboard'>;


interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  recentOrders: number;
}

export const AdminDashboardScreen = () => {
  const navigation = useNavigation<AdminNavigationProp>();
  const { auth, signOut } = useAuth();
  const { orders } = useOrders(true); // true flag for admin mode
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardStats = async () => {
    try {
      const [products, categories] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);

      // Calculate recent orders (last 24h)
      const recentOrders = orders.filter(order => 
        new Date(order.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length;

      setStats({
        totalProducts: products.data.length,
        totalOrders: orders.length,
        totalCategories: categories.data.length,
        recentOrders
      });
      setError(null);
    } catch (err) {
      setError('Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, [orders]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardStats();
  };

  const handleLogout = async () => {
    try {
      await signOut(); 
    } catch (error) {
      console.error('Erro ao sair da conta:', error);
    }
  };


  const adminMenuItems = [
    {
      title: 'Produtos',
      icon: 'package',
      screen: 'Products',
      description: 'Gerenciar produtos',
      count: stats?.totalProducts
    },
    {
      title: 'Categorias',
      icon: 'grid',
      screen: 'Categories',
      description: 'Gerenciar categorias',
      count: stats?.totalCategories
    },
    {
      title: 'Pedidos',
      icon: 'shopping-bag',
      screen: 'Orders',
      description: 'Gerenciar pedidos',
      count: stats?.totalOrders
    }
    
  ];

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>
            Olá, {auth.user?.name}
          </Text>
          <Text style={styles.subtitle}>
          Bem-vindo ao Painel Administrativo
          </Text>
        </View>

        {error && (
          <ErrorDisplay 
            message={error}
            onRetry={loadDashboardStats}
          />
        )}

        {stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalProducts}</Text>
                <Text style={styles.statLabel}>Produtos</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalOrders}</Text>
                <Text style={styles.statLabel}>Pedidos</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.recentOrders}</Text>
                <Text style={styles.statLabel}>Pedidos 24h</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalCategories}</Text>
                <Text style={styles.statLabel}>Categorias</Text>
              </View>
            </View>
          </View>
        )}

        <Section title="Menu Administrativo" titleStyle={styles.title}>
          {adminMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuIconContainer}>
                <Feather name={item.icon} size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              {item.count !== undefined && (
                <Badge
                  content={item.count.toString()}
                  variant="primary"
                  size="small"
                />
              )}
              <Feather 
                name="chevron-right" 
                size={24} 
                color={theme.colors.text.secondary} 
              />
            </TouchableOpacity>
          ))}
        </Section>
        <Button
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
        >
          Sair da Conta
        </Button>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  statsContainer: {
    padding: theme.spacing.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: theme.spacing.tiny,
    alignItems: 'center',
    ...theme.shadows.light,
  },
  statNumber: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.tiny,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.light,
    marginHorizontal: 10,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${theme.colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.medium,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
  },
  menuDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  title: {
    textAlign: 'center', 
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
  },
  logoutButton: {
    margin: theme.spacing.medium,
  },
});