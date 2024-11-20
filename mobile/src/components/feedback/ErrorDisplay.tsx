// Renamed from ErrorMessage
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message,
  onRetry,
  style
}) => {
  return (
    <View style={[styles.container, style]}>
      <Feather name="alert-circle" size={48} color={theme.colors.error} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Feather name="refresh-cw" size={16} color="#fff" />
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: theme.spacing.small,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
  },
  retryText: {
    marginLeft: theme.spacing.small,
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
  },
});

export default ErrorDisplay;