import { StyleSheet } from 'react-native';
import theme from './theme';

export const components = StyleSheet.create({
  // Header Component
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },

  // Product Card Component
  productCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.light,
  },
  productImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
  },
  productInfo: {
    padding: theme.spacing.medium,
  },
  productName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
  },
  productPrice: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },

  // Cart Item Component
  cartItem: {
    flexDirection: 'row',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.small,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: theme.spacing.medium,
  },

  // Form Components
  formInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
  },
  formLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.tiny,
  },
  formError: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.small,
    marginTop: theme.spacing.tiny,
  },

  // Button Components
  primaryButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
  },

  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.medium,
  },
});

export default components;