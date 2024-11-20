import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useOrders } from '../../hooks/useOrders';
import { formatCurrency } from '../../utils/formatter';
import { Order, ScreenNavigationProp, UserStackParamList } from '../../types/navigation';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';

// Definindo o tipo de navegação
type NavigationProp = ScreenNavigationProp<UserStackParamList, 'UserOrders'>;

export const UserOrderScreen = () => {
  const { auth, signOut } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const { orders, isLoading, error } = useOrders();

  // Adição do LoadingSpinner para indicar carregamento
  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // Exibição de erros, se houver
  if (error) {
    return (
      <Container>
        <ErrorDisplay 
          message="Não foi possível carregar seus pedidos"
        />
      </Container>
    );
  }

  // Estado de EmptyState caso não haja pedidos
  if (!orders.length) {
    return (
      <Container>
        <EmptyState
          icon="shopping-bag"
          title="Nenhum pedido encontrado"
          message="Você ainda não realizou nenhuma compra"
          actionLabel="Ir às Compras"
          onAction={() => {
            // Navigate to the Shop tab
            navigation.getParent()?.navigate('Shop');
          }}
        />
      </Container>
    );
  }

  // Função de renderização dos itens do pedido com melhorias de acessibilidade e status
  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('UserOrderDetails', { orderId: item._id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Pedido #{item._id.slice(-6)}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        <Badge
          content={item.status}
          variant={getOrderStatusVariant(item.status)}
          size="small"
        />
      </View>

      <View style={styles.productsContainer}>
        {item.products.map((product) => (
          <Text key={product._id} style={styles.productItem} numberOfLines={1}>
            {product.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalItems}>
          {item.products.length} {item.products.length === 1 ? 'item' : 'itens'}
        </Text>
        <Text style={styles.orderTotal}>
          Total: {formatCurrency.currency(
            item.products.reduce((sum, product) => sum + product.price, 0)
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Container scroll> {/* Implementação do ScrollView para permitir rolagem */}
      <Section title="Meus Pedidos">
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      </Section>
    </Container>
  );
};

// Função de status dos pedidos para mapeamento de variantes do Badge
const getOrderStatusVariant = (status: string) => {
  switch (status) {
    case 'Não processado':
      return 'warning';
    case 'Processando':
      return 'info';
    case 'Enviado':
      return 'primary';
    case 'Entregue':
      return 'success';
    case 'Cancelado':
      return 'error';
    default:
      return 'info';
  }
};

const styles = StyleSheet.create({
  listContainer: {
    padding: theme.spacing.small,
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
  productsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.medium,
  },
  productItem: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.medium,
    paddingTop: theme.spacing.medium,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  totalItems: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  orderTotal: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});