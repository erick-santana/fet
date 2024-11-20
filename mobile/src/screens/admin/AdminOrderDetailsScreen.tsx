// src/screens/admin/AdminOrderDetailsScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { useOrders } from '../../hooks/useOrders';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatter';
import { Order, OrderStatus } from '../../types/navigation';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';

const STATUS_PROGRESSION: Record<OrderStatus, OrderStatus | null> = {
  'Não processado': 'Processando',
  'Processando': 'Enviado',
  'Enviado': 'Entregue',
  'Entregue': null,
  'Cancelado': null,
};

type RouteParams = {
  orderId: string;
};

export const AdminOrderDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params as RouteParams;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { updateOrderStatus } = useOrders(true);
  const { showToast } = useToast();

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  const loadOrderDetails = async () => {
    try {
      const { data } = await api.get(`/order/${orderId}`);
      setOrder(data);
    } catch (error) {
      showToast('Não foi possível carregar os detalhes do pedido', 'error');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    if (!order) return;

    Alert.alert(
      'Confirmar Alteração',
      `Deseja alterar o status para "${newStatus}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setUpdating(true);
            try {
              await updateOrderStatus(order._id, newStatus);
              await loadOrderDetails();
              showToast('Status atualizado com sucesso', 'success');
            } catch (error) {
              showToast('Não foi possível atualizar o status', 'error');
            } finally {
              setUpdating(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!order) {
    return (
      <ErrorDisplay 
        message="Pedido não encontrado"
        onRetry={loadOrderDetails}
      />
    );
  }

  const nextStatus = order.status !== 'Cancelado' ? STATUS_PROGRESSION[order.status] : null;

  return (
    <Container>
      <ScrollView>
        <Section title={`Pedido #${order._id.slice(-6)}`}>
          <View style={styles.statusContainer}>
            <StatusBadge status={order.status} size="large" />
            {nextStatus && (
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleStatusUpdate(nextStatus)}
                disabled={updating}
              >
                <Text style={styles.updateButtonText}>
                  Avançar para {nextStatus}
                </Text>
                <Feather name="arrow-right" size={16} color="#fff" />
              </TouchableOpacity>
            )}
            {order.status !== 'Cancelado' && order.status !== 'Entregue' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleStatusUpdate('Cancelado')}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>Cancelar Pedido</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Data do Pedido:</Text>
            <Text style={styles.dateText}>
              {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </Section>

        <Section title="Cliente">
          <View style={styles.customerCard}>
            <Text style={styles.customerName}>{order.buyer.name}</Text>
            <Text style={styles.customerEmail}>{order.buyer.email}</Text>
            {order.buyer.address && (
              <View style={styles.addressContainer}>
                <Feather name="map-pin" size={16} color="#666" />
                <Text style={styles.addressText}>{order.buyer.address}</Text>
              </View>
            )}
          </View>
        </Section>

        <Section title="Produtos">
          {order.products.map((product) => (
            <View key={product._id} style={styles.productCard}>
              <Image
                source={{ uri: `${api.defaults.baseURL}/product/photo/${product._id}` }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.productPrice}>
                  {formatCurrency.currency(product.price)}
                </Text>
              </View>
            </View>
          ))}
        </Section>

        <Section title="Resumo do Pedido">
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency.currency(
                  order.products.reduce((sum, item) => sum + item.price, 0)
                )}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Frete</Text>
              <Text style={styles.summaryValue}>{formatCurrency.currency(0)}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                {formatCurrency.currency(
                  order.products.reduce((sum, item) => sum + item.price, 0)
                )}
              </Text>
            </View>
          </View>
        </Section>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  statusContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.medium,
  },
  updateButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
    marginRight: theme.spacing.small,
  },
  cancelButton: {
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.medium,
  },
  cancelButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.medium,
  },
  dateLabel: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    marginRight: theme.spacing.small,
  },
  dateText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  customerCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
  },
  customerName: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
  },
  customerEmail: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.medium,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.small,
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  productName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  productPrice: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.small,
  },
  summaryLabel: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
  },
  summaryValue: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    marginTop: theme.spacing.small,
    paddingTop: theme.spacing.small,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});