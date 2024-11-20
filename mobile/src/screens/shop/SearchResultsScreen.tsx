import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { ProductCard } from '../../components/cards/ProductCard';
import { SearchBar } from '../../components/forms/SearchBar';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useProducts } from '../../hooks/useProducts';
import { ShopStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';

type SearchResultsRouteProp = RouteProp<ShopStackParamList, 'SearchResults'>;
type SearchResultsNavigationProp = NativeStackNavigationProp<ShopStackParamList>;

export const SearchResultsScreen: React.FC = () => {
  const route = useRoute<SearchResultsRouteProp>();
  const navigation = useNavigation<SearchResultsNavigationProp>();
  const { query } = route.params;
  const { products, isLoading, error, searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = React.useState(query);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query]);

  const performSearch = async () => {
    try {
      await searchProducts(searchQuery);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  const handleSearch = async (newQuery: string) => {
    setSearchQuery(newQuery);
    await searchProducts(newQuery);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await performSearch();
    setRefreshing(false);
  };

  return (
    <Container>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        placeholder="Buscar produtos..."
      />

      {isLoading ? (
        <LoadingSpinner fullScreen />
      ) : error ? (
        <ErrorDisplay 
          message="Erro ao realizar a busca"
          onRetry={performSearch}
        />
      ) : !products.length ? (
        <EmptyState
          icon="search"
          title="Nenhum produto encontrado"
          message={`Não encontramos resultados para "${searchQuery}"`}
        />
      ) : (
        <Section
          title="Resultados da Busca"
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
      )}
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

export default SearchResultsScreen;