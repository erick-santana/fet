import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { useOrders } from '../../hooks/useOrders';
import theme from '../../styles/theme';

export const OrderConfirmationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };
  const { orders, isLoading, error } = useOrders();

  const order = orders.find(o => o._id === orderId);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !order) {
    return (
      <Container>
        <ErrorDisplay 
          message="Não foi possível carregar os detalhes do pedido"
        />
      </Container>
    );
  }

  return (
    <Container>
      <Section>
        <View style={styles.successContainer}>
          <Badge
            content="Pedido Confirmado"
            variant="success"
            size="large"
            containerStyle={styles.badge}
          />
          
          <Text style={styles.orderNumber}>
            Pedido #{order._id.slice(-6)}
          </Text>

          <Text style={styles.thanksMessage}>
            Obrigado pela sua compra!
          </Text>

          <Text style={styles.statusMessage}>
            Seu pedido está sendo processado.
          </Text>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            fullWidth
            variant="primary"
            onPress={() => navigation.navigate('UserOrders')}
            style={styles.trackButton}
          >
            Acompanhar Pedido
          </Button>

          <Button
            fullWidth
            variant="outline"
            onPress={() => navigation.navigate('Shop')}
            style={styles.continueButton}
          >
            Continuar Comprando
          </Button>
        </View>
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  successContainer: {
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  badge: {
    marginBottom: theme.spacing.large,
  },
  orderNumber: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.medium,
  },
  thanksMessage: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  statusMessage: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.large,
  },
  buttonsContainer: {
    padding: theme.spacing.medium,
  },
  trackButton: {
    marginBottom: theme.spacing.medium,
  },
  continueButton: {
    marginBottom: theme.spacing.small,
  },
});