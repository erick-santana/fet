import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import theme from '../../styles/theme';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface FormSelectProps {
  options: SelectOption[];
  value?: string | number;
  onChangeText: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  style?: ViewStyle;
  modalTitle?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  options,
  value,
  onChangeText,
  placeholder = 'Select an option',
  label,
  error,
  disabled = false,
  required = false,
  style,
  modalTitle = 'Select an option',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    onChangeText(option.value);
    setModalVisible(false);
  };

  const renderOption = ({ item }: { item: SelectOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.disabled && styles.optionDisabled,
        item.value === value && styles.optionSelected,
      ]}
      onPress={() => handleSelect(item)}
      disabled={item.disabled}
    >
      <Text
        style={[
          styles.optionText,
          item.disabled && styles.optionTextDisabled,
          item.value === value && styles.optionTextSelected,
        ]}
      >
        {item.label}
      </Text>
      {item.value === value && (
        <Feather name="check" size={20} color={theme.colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.selectButton,
          error && styles.selectButtonError,
          disabled && styles.selectButtonDisabled,
        ]}
        onPress={() => setModalVisible(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.selectButtonText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Feather
          name="chevron-down"
          size={20}
          color={theme.colors.text.secondary}
        />
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Feather name="x" size={24} color={theme.colors.text.primary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.medium,
  },
  labelContainer: {
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
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border.medium,
    borderRadius: theme.borderRadius.medium,
    backgroundColor: theme.colors.background,
  },
  selectButtonError: {
    borderColor: theme.colors.error,
  },
  selectButtonDisabled: {
    backgroundColor: theme.colors.surface,
    opacity: 0.7,
  },
  selectButtonText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
  },
  placeholderText: {
    color: theme.colors.text.secondary,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.small,
    marginTop: theme.spacing.tiny,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.large,
    borderTopRightRadius: theme.borderRadius.large,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.small,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.medium,
  },
  optionDisabled: {
    opacity: 0.5,
  },
  optionSelected: {
    backgroundColor: theme.colors.primary + '10',
  },
  optionText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.primary,
  },
  optionTextDisabled: {
    color: theme.colors.text.disabled,
  },
  optionTextSelected: {
    color: theme.colors.primary,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: theme.colors.border.light,
  },
});

export default FormSelect;