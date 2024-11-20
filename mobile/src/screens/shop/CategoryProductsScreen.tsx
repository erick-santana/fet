import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { ProductCard } from '../../components/cards/ProductCard';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useProducts } from '../../hooks/useProducts';
import { ShopStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';

type CategoryProductsRouteProp = RouteProp<ShopStackParamList, 'CategoryProducts'>;
type CategoryProductsNavigationProp = NativeStackNavigationProp<ShopStackParamList>;

export const CategoryProductsScreen: React.FC = () => {
  const route = useRoute<CategoryProductsRouteProp>();
  const navigation = useNavigation<CategoryProductsNavigationProp>();
  const { categoryId, categoryName } = route.params;
  const { products, isLoading, error, filterProducts } = useProducts();
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    loadCategoryProducts();
  }, [categoryId]);

  const loadCategoryProducts = async () => {
    try {
      await filterProducts(categoryId);
    } catch (err) {
      console.error('Erro ao carregar produtos da categoria:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCategoryProducts();
    setRefreshing(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <Container>
        <ErrorDisplay 
          message="Não foi possível carregar os produtos desta categoria"
          onRetry={loadCategoryProducts}
        />
      </Container>
    );
  }

  if (!products.length) {
    return (
      <Container>
        <EmptyState
          icon="package"
          title="Nenhum produto encontrado"
          message={`Não há produtos disponíveis na categoria ${categoryName}`}
        />
      </Container>
    );
  }

  return (
    <Container>
      <Section 
        title={categoryName}
        subtitle={`${products.length} produto${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
      >
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard 
                product={item}
                onPress={() => navigation.navigate('ProductDetails', { 
                  productId: item._id,
                  product: item
                })}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
              title="Atualizando..."
              titleColor={theme.colors.text.secondary}
            />
          }
        />
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: theme.spacing.small,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginHorizontal: theme.spacing.small,
  },
  productItem: {
    width: '48%',
    marginBottom: theme.spacing.medium,
  },
});

export default CategoryProductsScreen;