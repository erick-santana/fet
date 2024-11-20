import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';

export interface InputProps extends Omit<TextInputProps, 'onChangeText'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  required?: boolean;
  onChangeText?: (text: string) => void;
  onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  required = false,
  onChangeText,
  onBlur,
  fullWidth = true,
  secureTextEntry,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderPasswordIcon = () => {
    if (secureTextEntry) {
      return (
        <Pressable 
          onPress={togglePasswordVisibility}
          style={styles.iconContainer}
        >
          <Feather
            name={isPasswordVisible ? 'eye-off' : 'eye'}
            size={20}
            color={theme.colors.text.secondary}
          />
        </Pressable>
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, fullWidth && styles.fullWidth, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View style={[
        styles.inputContainer,
        isFocused && styles.focused,
        error && styles.error,
      ]}>
        {leftIcon && (
          <View style={styles.iconContainer}>
            <Feather
              name={leftIcon}
              size={20}
              color={theme.colors.text.secondary}
            />
          </View>
        )}

        <TextInput
          {...props}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          placeholderTextColor={theme.colors.text.secondary}
        />

        {renderPasswordIcon()}

        {rightIcon && !secureTextEntry && (
          <Pressable 
            onPress={onRightIconPress}
            style={styles.iconContainer}
          >
            <Feather
              name={rightIcon}
              size={20}
              color={theme.colors.text.secondary}
            />
          </Pressable>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[
          styles.helperText,
          error && styles.errorText
        ]}>
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
  fullWidth: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: theme.spacing.tiny,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.primary,
    fontWeight: '500',
  },
  required: {
    color: theme.colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background,
    minHeight: 48,
  },
  focused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  error: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.medium,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
    minHeight: 48,
  },
  inputWithLeftIcon: {
    paddingLeft: theme.spacing.tiny,
  },
  inputWithRightIcon: {
    paddingRight: theme.spacing.tiny,
  },
  iconContainer: {
    padding: theme.spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    marginTop: theme.spacing.tiny,
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  errorText: {
    color: theme.colors.error,
  },
});

export default Input;