import React from 'react';
import { StyleSheet, Image, View, Text } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../hooks/useProducts';
import { useToast } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/formatter';
import { Product, ShopStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';

type ProductDetailsRouteProp = RouteProp<ShopStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen: React.FC = () => {
  const route = useRoute<ProductDetailsRouteProp>();
  const navigation = useNavigation();
  const { productId } = route.params;
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { getProductById } = useProducts();
  
  const [loading, setLoading] = React.useState(true);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [product, setProduct] = React.useState<Product | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const productData = await getProductById(productId);
      setProduct(productData);
    } catch (err) {
      console.error('Erro ao carregar detalhes do produto:', err);
      setError('Não foi possível carregar os detalhes do produto');
      showToast('Erro ao carregar detalhes do produto', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    try {
      addToCart(product);
      showToast('Produto adicionado ao carrinho', 'success');
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      showToast('Erro ao adicionar produto ao carrinho', 'error');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !product) {
    return (
      <Container>
        <ErrorDisplay 
          message={error || 'Produto não encontrado'}
          onRetry={loadProductDetails}
        />
      </Container>
    );
  }

  return (
    <Container scroll>
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.imageLoadingContainer}>
            <LoadingSpinner size="large" />
          </View>
        )}
        <Image
          source={{ uri: `${api.defaults.baseURL}/product/photo/${product._id}` }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          resizeMode="cover"
        />
        {product.quantity < 1 && (
          <Badge
            content="Esgotado"
            variant="error"
            size="large"
            containerStyle={styles.outOfStockBadge}
          />
        )}
      </View>

      <Section style={styles.contentSection}>
        <View style={styles.header}>
          <Text style={styles.title}>{product.name}</Text>
          <Badge
            content={product.category.name}
            variant="primary"
            size="small"
            containerStyle={styles.categoryBadge}
          />
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatCurrency.currency(product.price)}
          </Text>
          {product.sold > 0 && (
            <Text style={styles.soldCount}>
              {product.sold} vendido{product.sold > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Descrição</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {product.shipping && (
          <View style={styles.shippingInfo}>
            <Badge
              content="Frete disponível"
              variant="success"
              size="medium"
            />
          </View>
        )}

        <View style={styles.stockInfo}>
          <Badge
            content={product.quantity > 0 
              ? `${product.quantity} unidade${product.quantity > 1 ? 's' : ''} em estoque`
              : 'Produto esgotado'}
            variant={product.quantity > 0 ? 'info' : 'error'}
            size="medium"
          />
        </View>
      </Section>

      <Section style={styles.footer}>
        <Button
          fullWidth
          variant={product.quantity > 0 ? 'primary' : 'outline'}
          onPress={handleAddToCart}
          disabled={product.quantity < 1}
          leftIcon="shopping-cart"
        >
          {product.quantity > 0 ? 'Adicionar ao Carrinho' : 'Produto Indisponível'}
        </Button>
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: theme.spacing.medium,
    right: theme.spacing.medium,
  },
  contentSection: {
    padding: theme.spacing.medium,
  },
  header: {
    marginBottom: theme.spacing.medium,
  },
  title: {
    fontSize: theme.typography.fontSize.xlarge,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
  },
  price: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginRight: theme.spacing.medium,
  },
  soldCount: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.large,
  },
  descriptionTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  description: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    lineHeight: 24,
  },
  shippingInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.medium,
  },
  stockInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.medium,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
    backgroundColor: theme.colors.background,
    marginHorizontal: 10
  },
});

export default ProductDetailsScreen;