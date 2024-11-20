import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeProps {
  content?: string | number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: keyof typeof Feather.glyphMap;
  dot?: boolean;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  outlined?: boolean;
  children?: React.ReactNode;
}

const VARIANT_COLORS: Record<BadgeVariant, {
  background: string;
  text: string;
  border: string;
}> = {
  primary: {
    background: theme.colors.primary + '20',
    text: theme.colors.primary,
    border: theme.colors.primary,
  },
  success: {
    background: theme.colors.success + '20',
    text: theme.colors.success,
    border: theme.colors.success,
  },
  warning: {
    background: theme.colors.warning + '20',
    text: theme.colors.warning,
    border: theme.colors.warning,
  },
  error: {
    background: theme.colors.error + '20',
    text: theme.colors.error,
    border: theme.colors.error,
  },
  info: {
    background: theme.colors.info + '20',
    text: theme.colors.info,
    border: theme.colors.info,
  },
};

export const Badge: React.FC<BadgeProps> = ({
  content,
  variant = 'primary',
  size = 'medium',
  icon,
  dot = false,
  containerStyle,
  textStyle,
  outlined = false,
  children,
}) => {
  const variantColors = VARIANT_COLORS[variant];

  const containerStyles = [
    styles.container,
    styles[size],
    {
      backgroundColor: outlined ? 'transparent' : variantColors.background,
      borderColor: variantColors.border,
      borderWidth: outlined ? 1 : 0,
    },
    containerStyle,
  ];

  const textStyles = [
    styles.text,
    styles[`${size}Text`],
    { color: variantColors.text },
    textStyle,
  ];

  const iconSize = {
    small: 12,
    medium: 14,
    large: 16,
  }[size];

  const renderContent = () => {
    if (dot) {
      return (
        <View
          style={[
            styles.dot,
            { backgroundColor: variantColors.border }
          ]}
        />
      );
    }

    if (children) {
      return children;
    }

    return (
      <>
        {icon && (
          <Feather
            name={icon}
            size={iconSize}
            color={variantColors.text}
            style={styles.icon}
          />
        )}
        {content && <Text style={textStyles}>{content}</Text>}
      </>
    );
  };

  return (
    <View style={containerStyles}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.borderRadius.round,
  },
  // Sizes
  small: {
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.tiny,
    minHeight: 20,
  },
  medium: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    minHeight: 24,
  },
  large: {
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
    minHeight: 32,
  },
  // Text sizes
  text: {
    fontWeight: '500',
  },
  smallText: {
    fontSize: theme.typography.fontSize.tiny,
  },
  mediumText: {
    fontSize: theme.typography.fontSize.small,
  },
  largeText: {
    fontSize: theme.typography.fontSize.medium,
  },
  // Icon
  icon: {
    marginRight: theme.spacing.tiny,
  },
  // Dot
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default Badge;