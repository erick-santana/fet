import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  showClose?: boolean;
}

const { width } = Dimensions.get('window');

const TOAST_CONFIG = {
  success: {
    backgroundColor: theme.colors.success + '15',
    borderColor: theme.colors.success,
    icon: 'check-circle',
    iconColor: theme.colors.success,
  },
  error: {
    backgroundColor: theme.colors.error + '15',
    borderColor: theme.colors.error,
    icon: 'alert-circle',
    iconColor: theme.colors.error,
  },
  warning: {
    backgroundColor: theme.colors.warning + '15',
    borderColor: theme.colors.warning,
    icon: 'alert-triangle',
    iconColor: theme.colors.warning,
  },
  info: {
    backgroundColor: theme.colors.info + '15',
    borderColor: theme.colors.info,
    icon: 'info',
    iconColor: theme.colors.info,
  },
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
  showClose = true,
}) => {
  const translateY = new Animated.Value(-100);
  const opacity = new Animated.Value(0);

  const config = TOAST_CONFIG[type];

  useEffect(() => {
    if (visible) {
      show();
    } else {
      hide();
    }
  }, [visible]);

  const show = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    if (duration > 0) {
      setTimeout(() => {
        onClose?.();
      }, duration);
    }
  };

  const hide = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
        },
      ]}
    >
      <View style={styles.content}>
        <Feather
          name={config.icon}
          size={24}
          color={config.iconColor}
          style={styles.icon}
        />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        {showClose && (
          <TouchableOpacity
            onPress={onClose}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Feather
              name="x"
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    margin: theme.spacing.medium,
    marginTop: theme.spacing.large + 20, // Account for status bar
    borderRadius: theme.borderRadius.medium,
    borderWidth: 1,
    ...theme.shadows.medium,
    width: width - (theme.spacing.medium * 2),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
  },
  icon: {
    marginRight: theme.spacing.small,
  },
  message: {
    flex: 1,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.small,
  },
});

export default Toast;