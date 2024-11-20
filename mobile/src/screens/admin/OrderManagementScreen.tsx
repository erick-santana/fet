// src/screens/admin/OrderManagementScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useOrders } from '../../hooks/useOrders';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatter';
import { Order, OrderStatus } from '../../types/navigation';
import theme from '../../styles/theme';

const STATUS_PROGRESSION: Record<OrderStatus, OrderStatus | null> = {
  'Não processado': 'Processando',
  'Processando': 'Enviado',
  'Enviado': 'Entregue',
  'Entregue': null,
  'Cancelado': null,
};

export const OrderManagementScreen = () => {
  const navigation = useNavigation();
  const { orders, isLoading, error, updateOrderStatus, refreshOrders } = useOrders(true);
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshOrders();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (order: Order, newStatus: OrderStatus) => {
    Alert.alert(
      'Confirmar Alteração',
      `Deseja alterar o status para "${newStatus}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await updateOrderStatus(order._id, newStatus);
              showToast('Status atualizado com sucesso', 'success');
            } catch (error) {
              showToast('Erro ao atualizar status', 'error');
            }
          }
        }
      ]
    );
  };

  const getFilteredOrders = () => {
    switch (selectedFilter) {
      case 'pending':
        return orders.filter(order => 
          ['Não processado', 'Processando', 'Enviado'].includes(order.status)
        );
      case 'completed':
        return orders.filter(order => 
          ['Entregue', 'Cancelado'].includes(order.status)
        );
      default:
        return orders;
    }
  };

  const renderOrder = ({ item: order }: { item: Order }) => {
    const nextStatus = STATUS_PROGRESSION[order.status];

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate('OrderDetails', { 
          orderId: order._id,
          canEdit: true
        })}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderNumber}>
              Pedido #{order._id.slice(-6)}
            </Text>
            <Text style={styles.orderDate}>
              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <StatusBadge status={order.status} size="small" />
        </View>

        <View style={styles.customerInfo}>
          <Feather name="user" size={16} color={theme.colors.text.secondary} />
          <Text style={styles.customerName}>{order.buyer.name}</Text>
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.itemCount}>
            {order.products.length} {order.products.length === 1 ? 'item' : 'itens'}
          </Text>
          <Text style={styles.totalAmount}>
            Total: {formatCurrency.currency(
              order.products.reduce((sum, item) => sum + item.price, 0)
            )}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {nextStatus && (
            <TouchableOpacity
              style={styles.updateButton}
              onPress={() => handleStatusUpdate(order, nextStatus)}
            >
              <Text style={styles.updateButtonText}>
                Avançar para {nextStatus}
              </Text>
              <Feather name="arrow-right" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          )}

          {order.status !== 'Cancelado' && order.status !== 'Entregue' && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleStatusUpdate(order, 'Cancelado')}
            >
              <Feather name="x" size={16} color={theme.colors.error} />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Pedidos</Text>
        <View style={styles.filterButtons}>
          {[
            { key: 'all', label: 'Todos' },
            { key: 'pending', label: 'Pendentes' },
            { key: 'completed', label: 'Concluídos' }
          ].map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterButton,
                selectedFilter === filter.key && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.key as typeof selectedFilter)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter.key && styles.filterButtonTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {error ? (
        <ErrorDisplay
          message={error}
          onRetry={refreshOrders}
        />
      ) : getFilteredOrders().length === 0 ? (
        <EmptyState
          icon="shopping-bag"
          title="Nenhum pedido encontrado"
          message={selectedFilter === 'pending' 
            ? 'Não há pedidos pendentes'
            : selectedFilter === 'completed'
            ? 'Não há pedidos concluídos'
            : 'Não há pedidos cadastrados'}
        />
      ) : (
        <FlatList
          data={getFilteredOrders()}
          renderItem={renderOrder}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.medium,
  },
  filterButtons: {
    flexDirection: 'row',
    marginBottom: theme.spacing.small,
  },
  filterButton: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    marginRight: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.small,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: theme.colors.text.inverse,
  },
  listContainer: {
    padding: theme.spacing.medium,
  },
  orderCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.light,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  orderNumber: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  orderDate: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.tiny,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  customerName: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.small,
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
    paddingBottom: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  itemCount: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  totalAmount: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: `${theme.colors.primary}10`,
  },
  updateButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.small,
    fontWeight: '500',
    marginRight: theme.spacing.small,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: `${theme.colors.error}10`,
  },
  cancelButtonText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.small,
    fontWeight: '500',
    marginLeft: theme.spacing.small,
  },
});