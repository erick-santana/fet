import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { OrderStatus } from '../../types/navigation';

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
}

const STATUS_CONFIG = {
  'Não processado': { color: '#dc3545', icon: 'clock' },
  'Processando': { color: '#ffc107', icon: 'refresh-cw' },
  'Enviado': { color: '#17a2b8', icon: 'truck' },
  'Entregue': { color: '#28a745', icon: 'check-circle' },
  'Cancelado': { color: '#6c757d', icon: 'x-circle' }
} as const;

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  style
}) => {
  const config = STATUS_CONFIG[status];
  const sizeConfig = {
    small: { padding: 4, fontSize: 12, iconSize: 12 },
    medium: { padding: 8, fontSize: 14, iconSize: 16 },
    large: { padding: 12, fontSize: 16, iconSize: 20 },
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${config.color}20`,
          padding: sizeConfig[size].padding,
        },
        style
      ]}
    >
      <Feather
        name={config.icon}
        size={sizeConfig[size].iconSize}
        color={config.color}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          { color: config.color, fontSize: sizeConfig[size].fontSize }
        ]}
      >
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '500',
  },
});