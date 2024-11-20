import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ProductCard } from '../components/cards/ProductCard';
import {  
  Header 
} from '../components/shared/Header';
import { EmptyState } from '../components/feedback/EmptyState';
import { LoadingSpinner } from '../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../components/feedback/ErrorDisplay';
import { Product, ScreenNavigationProp, HomeStackParamList } from '../types/navigation';
import api from '../api/axiosConfig';

// Add proper navigation typing
type NavigationProp = ScreenNavigationProp<HomeStackParamList, 'HomeScreen'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      const { data } = await api.get('/products');
      // Sort by createdAt for new products
      const newest = [...data].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 6);
      
      // Sort by sold count for popular products
      const popular = [...data].sort((a, b) => b.sold - a.sold).slice(0, 6);
      
      setNewProducts(newest);
      setPopularProducts(popular);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <ErrorDisplay
        message={error}
        onRetry={loadProducts}
      />
    );
  }

  if (!newProducts.length && !popularProducts.length) {
    return (
      <EmptyState
        icon="package"
        title="Nenhum produto disponível"
        message="No momento não há produtos cadastrados"
      />
    );
  }

  const handleProductPress = (product: Product) => {
    console.log('Product pressed:', product._id); // Add this to debug
    navigation.navigate('ProductDetails', {
      productId: product._id,
      slug: product.slug,
      product: product
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Fraga esse Tempero"
        showBack={false}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.welcome}>Bem-vindo ao Fraga esse Tempero!</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Novidades</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {newProducts.map((product) => (
            <View key={product._id} style={styles.productContainer}>
              <ProductCard 
                product={product} 
                onPress={() => handleProductPress(product)}
              />
            </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mais Vendidos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularProducts.map((product) => (
            <View key={product._id} style={styles.productContainer}>
              <ProductCard 
                product={product}
                onPress={() => handleProductPress(product)}
              />
            </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  productContainer: {
    width: 200,
    marginRight: 15,
  },
});
