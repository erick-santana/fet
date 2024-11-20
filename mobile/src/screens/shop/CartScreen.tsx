import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CartItem } from '../../components/cards/CartItem';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatter';
import { RootStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';

type CartScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<CartScreenNavigationProp>();
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [updatingQuantity, setUpdatingQuantity] = React.useState(false);

  const handleQuantityUpdate = async (productId: string, quantity: number) => {
    try {
      setUpdatingQuantity(true);
      await updateQuantity(productId, quantity);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : 'Erro ao atualizar quantidade',
        'error'
      );
    } finally {
      setUpdatingQuantity(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart(productId);
      showToast('Produto removido do carrinho', 'success');
    } catch (error) {
      showToast('Erro ao remover produto do carrinho', 'error');
    }
  };

  const handleCheckout = () => {
    if (!auth.user?.address) {
      showToast(
        'Adicione um endereço de entrega antes de continuar',
        'warning'
      );
      return;
    }
    navigation.navigate('CartNavigator', { screen: 'Checkout' });
  };

  if (cart.length === 0) {
    return (
      <Container>
        <EmptyState
          icon="shopping-cart"
          title="Seu carrinho está vazio"
          message="Adicione produtos ao seu carrinho para continuar comprando"
          actionLabel="Ir às Compras"
          onAction={() => {
            // Navigate to the Shop tab
            navigation.getParent()?.navigate('Shop');
          }}
        />
      </Container>
    );
  }

  return (
    <Container style={{ marginHorizontal: 10 }}>
      <Section
        title="Itens no Carrinho"
        subtitle={`${cart.length} ${cart.length === 1 ? 'item' : 'itens'} no carrinho`}
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      >
        {cart.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onRemove={() => handleRemoveItem(item._id)}
            onUpdateQuantity={(quantity) => handleQuantityUpdate(item._id, quantity)}
            disabled={updatingQuantity}
          />
        ))}

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency.currency(getCartTotal())}
            </Text>
          </View>

          {!auth.user?.address ? (
            <Button
              variant="outline"
              onPress={() => navigation.navigate('ProfileNavigator', { 
                screen: 'UserAddress' 
              })}
              style={styles.addressButton}
            >
              Adicionar endereço de entrega
            </Button>
          ) : (
            <View style={styles.addressContainer}>
              <Text style={styles.addressTitle}>Endereço de entrega:</Text>
              <Text style={styles.addressText}>{auth.user.address}</Text>
              <Button
                variant="ghost"
                onPress={() => navigation.navigate('ProfileNavigator', { 
                  screen: 'UserAddress' 
                })}
                style={styles.editAddressButton}
              >
                Alterar endereço
              </Button>
            </View>
          )}

          <Button
            fullWidth
            variant="primary"
            onPress={handleCheckout}
            disabled={!auth.user?.address}
            style={styles.checkoutButton}
          >
            Finalizar Compra
          </Button>
        </View>
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingTop: theme.spacing.large,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  totalLabel: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  totalValue: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  addressContainer: {
    marginBottom: theme.spacing.medium,
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
  },
  addressTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  addressText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.small,
  },
  addressButton: {
    marginBottom: theme.spacing.medium,
  },
  editAddressButton: {
    alignSelf: 'flex-end',
  },
  checkoutButton: {
    marginTop: theme.spacing.medium,
  },
  title: {
    textAlign: 'center', 
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
  },
});

export default CartScreen;