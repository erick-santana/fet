// src/screens/admin/ProductManagementScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp, AdminStackParamList } from '../../types/navigation';
import { Feather } from '@expo/vector-icons';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../utils/formatter';
import { Product } from '../../types/navigation';
import { useProducts } from '../../hooks/useProducts';
import { useToast } from '../../contexts/ToastContext';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';

type NavigationProp = ScreenNavigationProp<AdminStackParamList, 'Products'>;

export const ProductManagementScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { products, isLoading, error, refreshProducts } = useProducts();
  const { showToast } = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshProducts();
    setRefreshing(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/product/${productId}`);
              showToast('Produto excluído com sucesso', 'success');
              refreshProducts();
            } catch (error) {
              showToast('Erro ao excluir produto', 'error');
            }
          }
        }
      ]
    );
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <Image
        source={{ uri: `${api.defaults.baseURL}/product/photo/${item._id}` }}
        style={styles.productImage}
        defaultSource={require('../../../assets/placeholder.png')}
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.productPrice}>
          {formatCurrency.currency(item.price)}
        </Text>
        
        <View style={styles.stockInfo}>
          <Text style={[
            styles.stockText,
            item.quantity === 0 && styles.outOfStock
          ]}>
            {item.quantity === 0 
              ? 'Fora de estoque' 
              : `Em estoque: ${item.quantity}`}
          </Text>
          {item.sold > 0 && (
            <Text style={styles.soldText}>
              Vendidos: {item.sold}
            </Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('ProductForm', { 
              product: item,
              mode: 'edit'
            })}
          >
            <Feather name="edit" size={18} color={theme.colors.primary} />
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProduct(item._id)}
          >
            <Feather name="trash-2" size={18} color={theme.colors.error} />
            <Text style={styles.deleteButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Produtos</Text>
        <Button
          variant="primary"
          leftIcon="plus"
          onPress={() => navigation.navigate('ProductForm', { mode: 'create' })}
        >
          Novo Produto
        </Button>
      </View>

      {error ? (
        <ErrorDisplay 
          message={error}
          onRetry={refreshProducts}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon="package"
          title="Nenhum produto cadastrado"
          message="Comece adicionando seu primeiro produto"
          actionLabel="Criar Produto"
          onAction={() => navigation.navigate('ProductForm', { mode: 'create' })}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item._id}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  listContainer: {
    padding: theme.spacing.medium,
  },
  productCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    overflow: 'hidden',
    ...theme.shadows.light,
  },
  productImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: theme.spacing.medium,
  },
  productName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  productPrice: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.small,
  },
  stockInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
  },
  stockText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  outOfStock: {
    color: theme.colors.error,
  },
  soldText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    paddingTop: theme.spacing.medium,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.large,
  },
  editButtonText: {
    marginLeft: theme.spacing.small,
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.medium,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    marginLeft: theme.spacing.small,
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.medium,
  },
});