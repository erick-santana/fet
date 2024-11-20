import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Product } from '../../types/navigation';
import { formatCurrency } from '../../utils/formatter';
import { LoadingSpinner } from '../feedback/LoadingSpinner';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';

interface CartItemProps {
  item: Product & { quantity: number };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
  disabled?: boolean;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onRemove,
  onUpdateQuantity,
  disabled = false
}) => {
  const [imageLoading, setImageLoading] = React.useState(true);

  const handleIncrement = () => {
    if (item.quantity < item.quantity && !disabled) {
      onUpdateQuantity(item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1 && !disabled) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageLoading && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="small" color={theme.colors.primary} />
          </View>
        )}
        <Image
          source={{ uri: `${api.defaults.baseURL}/product/photo/${item._id}` }}
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
        />
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        
        <Text style={styles.price}>
          {formatCurrency.currency(item.price)}
        </Text>

        <View style={styles.actionsContainer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={[
                styles.quantityButton,
                (item.quantity <= 1 || disabled) && styles.quantityButtonDisabled
              ]}
              onPress={handleDecrement}
              disabled={item.quantity <= 1 || disabled}
            >
              <Feather 
                name="minus" 
                size={16} 
                color={item.quantity <= 1 || disabled 
                  ? theme.colors.text.disabled 
                  : theme.colors.primary
                } 
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>
              {item.quantity}
            </Text>

            <TouchableOpacity 
              style={[
                styles.quantityButton,
                (item.quantity >= item.quantity || disabled) && styles.quantityButtonDisabled
              ]}
              onPress={handleIncrement}
              disabled={item.quantity >= item.quantity || disabled}
            >
              <Feather 
                name="plus" 
                size={16} 
                color={item.quantity >= item.quantity || disabled 
                  ? theme.colors.text.disabled 
                  : theme.colors.primary
                } 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.removeButton}
            onPress={onRemove}
            disabled={disabled}
          >
            <Feather 
              name="trash-2" 
              size={18} 
              color={disabled ? theme.colors.text.disabled : theme.colors.error} 
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtotal}>
          Subtotal: {formatCurrency.currency(item.price * item.quantity)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    padding: theme.spacing.medium,
    ...theme.shadows.light,
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.small,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: theme.spacing.medium,
  },
  name: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
  },
  price: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.small,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.small,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.tiny,
  },
  quantityButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.small,
  },
  quantityButtonDisabled: {
    backgroundColor: theme.colors.surface,
  },
  quantityText: {
    marginHorizontal: theme.spacing.medium,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
    color: theme.colors.text.primary,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: theme.spacing.small,
  },
  subtotal: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
});

export default CartItem;