import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import theme from '../../styles/theme';

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background
  },
  text: {
    marginTop: 10,
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.medium
  }
});