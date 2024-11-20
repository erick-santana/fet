import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { Product } from '../../types/navigation';
import { formatCurrency } from '../../utils/formatter';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../feedback/LoadingSpinner';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';

export interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  horizontal?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPress,
  horizontal = false 
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [imageLoading, setImageLoading] = React.useState(true);

  const handleAddToCart = (e: GestureResponderEvent) => {
    e.stopPropagation();
    addToCart(product);
    showToast('Produto adicionado ao carrinho', 'success');
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        horizontal ? styles.horizontalContainer : styles.verticalContainer
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="small" color={theme.colors.primary} />
          </View>
        )}
        <Image
          source={{ uri: `${api.defaults.baseURL}/product/photo/${product._id}` }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
        {product.quantity < 1 && (
          <Badge
            content="Esgotado"
            variant="error"
            size="small"
            containerStyle={styles.outOfStockBadge}
          />
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Badge
          content={product.category.name}
          variant="primary"
          size="small"
          containerStyle={styles.categoryBadge}
        />

        <Text style={styles.price}>
          {formatCurrency.currency(product.price)}
        </Text>

        {product.quantity > 0 && (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Feather name="shopping-cart" size={16} color={theme.colors.text.inverse} />
            <Text style={styles.addToCartText}>Adicionar</Text>
          </TouchableOpacity>
        )}

        {product.sold > 0 && (
          <Text style={styles.soldCount}>
            {product.sold} vendido{product.sold > 1 ? 's' : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.light,
  },
  verticalContainer: {
    width: '100%',
  },
  horizontalContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  imageContainer: {
    aspectRatio: 1,
    borderTopLeftRadius: theme.borderRadius.medium,
    borderTopRightRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  loadingContainer: {
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
    resizeMode: 'cover',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: theme.spacing.small,
    right: theme.spacing.small,
  },
  infoContainer: {
    padding: theme.spacing.medium,
  },
  name: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
    height: 40,
  },
  categoryBadge: {
    marginBottom: theme.spacing.small,
  },
  price: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.small,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.small,
    borderRadius: theme.borderRadius.small,
    marginBottom: theme.spacing.tiny,
  },
  addToCartText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
    marginLeft: theme.spacing.tiny,
  },
  soldCount: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
});