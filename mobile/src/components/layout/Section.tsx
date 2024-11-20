import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../styles/theme';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  contentStyle?: ViewStyle;
  centerHeader?: boolean; // Centralização opcional do header
}

export const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  centerHeader = false, // Valor padrão
}) => {
  const insets = useSafeAreaInsets(); // Adiciona suporte a SafeAreaInsets

  return (
    <View style={[styles.container, { paddingTop: insets.top }, style]}>
      {(title || subtitle) && (
        <View
          style={[
            styles.header,
            centerHeader && styles.centerHeader, // Centraliza o header condicionalmente
          ]}
        >
          {title && (
            <Text style={[styles.title, titleStyle]}>
              {title}
            </Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]}>
              {subtitle}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.large,
  },
  header: {
    marginBottom: theme.spacing.medium,
  },
  centerHeader: {
    alignItems: 'center', // Centraliza o header horizontalmente
  },
  title: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  content: {
    minHeight: theme.spacing.medium,
  },
});

export default Section;
