import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme from '../../styles/theme';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  helperText?: string;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required = false,
  children,
  helperText,
  containerStyle,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      {children}

      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            error ? styles.errorText : styles.helperTextColor,
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.tiny,
  },
  label: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  required: {
    color: theme.colors.error,
  },
  helperText: {
    marginTop: theme.spacing.tiny,
    fontSize: theme.typography.fontSize.small,
  },
  helperTextColor: {
    color: theme.colors.text.secondary,
  },
  errorText: {
    color: theme.colors.error,
  },
});

export default FormField;