import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { CartItem } from '../../components/cards/CartItem';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { usePayment } from '../../hooks/usePayment';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatter';
import theme from '../../styles/theme';

export const CheckoutScreen = () => {
  const navigation = useNavigation();
  const { cart, getCartTotal, clearCart } = useCart();
  const { auth } = useAuth();
  const { getClientToken, processPayment, error, isLoading } = usePayment();
  const { showToast } = useToast();
  const [clientToken, setClientToken] = useState<string | null>(null);

  useEffect(() => {
    initializePayment();
  }, []);

  const initializePayment = async () => {
    const token = await getClientToken();
    if (token) {
      setClientToken(token);
    }
  };

  const handlePayment = async () => {
    try {
      const result = await processPayment(clientToken!, cart);
      if (result.ok) {
        clearCart();
        navigation.navigate('OrderConfirmation', {
          orderId: result.orderId,
          status: 'Processando'
        });
        showToast('Pedido realizado com sucesso!', 'success');
      }
    } catch (err) {
      showToast('Erro ao processar pagamento', 'error');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <Container>
        <ErrorDisplay 
          message="Erro ao inicializar pagamento"
          onRetry={initializePayment}
        />
      </Container>
    );
  }

  return (
    <Container scroll>
      <Section title="Resumo do Pedido">
        <View style={styles.orderSummary}>
          {cart.map(item => (
            <CartItem 
              key={item._id}
              item={item}
              onRemove={() => {}}
              onUpdateQuantity={() => {}}
              disabled
            />
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total do Pedido:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency.currency(getCartTotal())}
            </Text>
          </View>
        </View>
      </Section>

      <Section title="Endereço de Entrega">
        <View style={styles.addressContainer}>
          <Text style={styles.addressName}>{auth.user?.name}</Text>
          <Text style={styles.addressText}>{auth.user?.address}</Text>
        </View>
      </Section>

      <Section title="Pagamento">
        {clientToken ? (
          <View style={styles.paymentContainer}>
            {/* Here you would integrate your payment UI component */}
            <Button
              fullWidth
              variant="primary"
              onPress={handlePayment}
              loading={isLoading}
            >
              Finalizar Compra
            </Button>
          </View>
        ) : (
          <ErrorDisplay 
            message="Erro ao carregar opções de pagamento"
            onRetry={initializePayment}
          />
        )}
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  orderSummary: {
    marginBottom: theme.spacing.medium,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.medium,
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
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
  },
  addressName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  addressText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
  },
  paymentContainer: {
    marginTop: theme.spacing.medium,
  },
});