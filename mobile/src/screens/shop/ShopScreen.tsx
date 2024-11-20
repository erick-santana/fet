import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { ProductCard } from '../../components/cards/ProductCard';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { EmptyState } from '../../components/feedback/EmptyState';
import { SearchBar } from '../../components/forms/SearchBar';
import { CategoryFilter } from '../../components/forms/CategoryFilter';
import { useProducts } from '../../hooks/useProducts';
import { useCategory } from '../../hooks/useCategories';
import { useToast } from '../../contexts/ToastContext';
import { Product, ShopScreenNavigationProp } from '../../types/navigation';
import theme from '../../styles/theme';

export const ShopScreen: React.FC = () => {
  const navigation = useNavigation<ShopScreenNavigationProp>();
  const { products, isLoading, error, filterProducts, refreshProducts } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategory();
  const { showToast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategorySelect = async (categoryId: string | null, categorySlug?: string) => {
    try {
      setSelectedCategory(categoryId);
      if (categoryId === null) {
        // If no category selected (clicking "Todos"), load all products
        await refreshProducts();
      } else {
        await filterProducts(categorySlug || null);
      }
    } catch (error) {
      showToast(
        'Erro ao filtrar produtos por categoria. Tente novamente.',
        'error'
      );
      // Reset category selection on error
      setSelectedCategory(null);
      console.error('Error filtering by category:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshProducts();
    } catch (err) {
      console.error('Erro ao atualizar produtos:', err);
      showToast('Erro ao atualizar produtos', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      navigation.navigate('SearchResults', { query });
    }
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetails', {
      productId: product._id,
      slug: product.slug,    
    });
  };

  if (isLoading && !products.length) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <Container>
        <ErrorDisplay 
          message="Não foi possível carregar os produtos"
          onRetry={() => filterProducts(selectedCategory)}
        />
      </Container>
    );
  }

  return (
    <Container>
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Buscar produtos..."
      />
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        loading={categoriesLoading}
      />

      {!products.length ? (
        <EmptyState
          icon="package"
          title="Nenhum produto disponível"
          message={selectedCategory 
            ? "Nenhum produto encontrado nesta categoria" 
            : "No momento não há produtos cadastrados"}
        />
      ) : (
        <Section>
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <View style={styles.productItem}>
                <ProductCard 
                  product={item}
                  onPress={() => handleProductPress(item)}
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
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={5}
          />
        </Section>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: theme.spacing.small,
    paddingBottom: theme.spacing.large,
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

export default ShopScreen;