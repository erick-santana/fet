// src/mobile/src/components/ui/Card.tsx

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  showDivider?: boolean;
}

interface CardFooterProps {
  children: React.ReactNode;
  showDivider?: boolean;
}

interface CardProps {
  children: React.ReactNode;
  header?: CardHeaderProps;
  footer?: CardFooterProps;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  elevation?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  header,
  footer,
  style,
  onPress,
  disabled = false,
  loading = false,
  elevation = true,
}) => {
  const renderHeader = () => {
    if (!header) return null;

    const { title, subtitle, rightElement, showDivider = true } = header;

    return (
      <>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          {rightElement && (
            <View style={styles.headerRight}>
              {rightElement}
            </View>
          )}
        </View>
        {showDivider && <View style={styles.divider} />}
      </>
    );
  };

  const renderFooter = () => {
    if (!footer) return null;

    const { children: footerChildren, showDivider = true } = footer;

    return (
      <>
        {showDivider && <View style={styles.divider} />}
        <View style={styles.footer}>
          {footerChildren}
        </View>
      </>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Feather name="loader" size={24} color={theme.colors.primary} />
        </View>
      );
    }

    return children;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[
          styles.container,
          elevation && styles.elevation,
          disabled && styles.disabled,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.7}
      >
        {renderHeader()}
        <View style={styles.content}>
          {renderContent()}
        </View>
        {renderFooter()}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.container,
        elevation && styles.elevation,
        disabled && styles.disabled,
        style,
      ]}
    >
      {renderHeader()}
      <View style={styles.content}>
        {renderContent()}
      </View>
      {renderFooter()}
    </View>
  );
};

// Additional Card Components
export const CardHeader: React.FC<CardHeaderProps> = (props) => null;
export const CardFooter: React.FC<CardFooterProps> = (props) => null;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
  },
  elevation: {
    ...theme.shadows.light,
  },
  disabled: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
  },
  headerContent: {
    flex: 1,
  },
  headerRight: {
    marginLeft: theme.spacing.medium,
  },
  title: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.tiny,
  },
  content: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
  },
  footer: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.medium,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
  loadingContainer: {
    padding: theme.spacing.large,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Card;