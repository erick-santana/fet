import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface SearchBarProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChangeText,
  onSearch,
  placeholder = "Buscar produtos...",
  loading = false
}) => {
  const [searchText, setSearchText] = React.useState(value);

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onChangeText?.(text);
  };

  const handleSubmit = () => {
    onSearch(searchText);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Feather 
          name="search" 
          size={20} 
          color="#666"
          style={styles.searchIcon}
        />
        
        <TextInput
          style={styles.input}
          value={searchText}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          returnKeyType="search"
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {searchText.length > 0 && (
          <TouchableOpacity
            onPress={() => handleChangeText('')}
            style={styles.clearButton}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#666" />
            ) : (
              <Feather name="x" size={20} color="#666" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 8,
  }
});