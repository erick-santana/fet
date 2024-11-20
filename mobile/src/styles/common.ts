import { StyleSheet } from 'react-native';
import theme from './theme';

export const common = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },

  // Typography
  heading: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.medium,
  },
  subheading: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  bodyText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  smallText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },

  // Cards
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.light,
  },

  // Forms
  formGroup: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.tiny,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.medium,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
  },

  // Buttons
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.text.disabled,
  },

  // Lists
  listItem: {
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },

  // Images
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.small,
  },

  // Utility
  shadow: theme.shadows.light,
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
    marginVertical: theme.spacing.medium,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.small,
    marginTop: theme.spacing.tiny,
  },
});

export default common;