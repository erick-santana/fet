import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';

interface FormErrorProps {
  error?: string | string[];
  visible?: boolean;
  style?: ViewStyle;
  showIcon?: boolean;
}

export const FormError: React.FC<FormErrorProps> = ({
  error,
  visible = true,
  style,
  showIcon = true,
}) => {
  if (!error || !visible) return null;

  const errors = Array.isArray(error) ? error : [error];

  return (
    <View style={[styles.container, style]}>
      {errors.map((errorMessage, index) => (
        <View key={index} style={styles.errorRow}>
          {showIcon && (
            <Feather
              name="alert-circle"
              size={14}
              color={theme.colors.error}
              style={styles.icon}
            />
          )}
          <Text style={styles.text}>{errorMessage}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.tiny,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.tiny,
  },
  icon: {
    marginRight: theme.spacing.tiny,
  },
  text: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.small,
    flex: 1,
  },
});

export default FormError;