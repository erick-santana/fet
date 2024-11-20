import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';
import components from '../../styles/components';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  fullWidth?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  style,
  textStyle,
  disabled,
  ...props
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    loading && styles.loading,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const iconSize = {
    small: 16,
    medium: 18,
    large: 20,
  }[size];

  const iconColor = {
    primary: theme.colors.text.inverse,
    secondary: theme.colors.text.inverse,
    outline: theme.colors.primary,
    ghost: theme.colors.primary,
  }[variant];

  return (
    <TouchableOpacity
      {...props}
      style={buttonStyles}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' 
            ? theme.colors.primary 
            : theme.colors.text.inverse}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <React.Fragment>
          {leftIcon && (
            <Feather
              name={leftIcon}
              size={iconSize}
              color={iconColor}
              style={styles.leftIcon}
            />
          )}
          <Text style={textStyles}>{children}</Text>
          {rightIcon && (
            <Feather
              name={rightIcon}
              size={iconSize}
              color={iconColor}
              style={styles.rightIcon}
            />
          )}
        </React.Fragment>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.medium,
  },

  // Variants
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },

  // Sizes
  small: {
    paddingVertical: theme.spacing.tiny,
    paddingHorizontal: theme.spacing.small,
    minHeight: 32,
  },
  medium: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.medium,
    minHeight: 40,
  },
  large: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    minHeight: 48,
  },

  // States
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },

  // Text Styles
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
  primaryText: {
    color: theme.colors.text.inverse,
  },
  secondaryText: {
    color: theme.colors.text.inverse,
  },
  outlineText: {
    color: theme.colors.primary,
  },
  ghostText: {
    color: theme.colors.primary,
  },

  // Text Sizes
  smallText: {
    fontSize: theme.typography.fontSize.small,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.medium,
  },
  largeText: {
    fontSize: theme.typography.fontSize.large,
  },

  // Icon Styles
  leftIcon: {
    marginRight: theme.spacing.small,
  },
  rightIcon: {
    marginLeft: theme.spacing.small,
  },
  
  disabledText: {
    color: theme.colors.text.disabled,
  },
});

export default Button;