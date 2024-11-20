// src/screens/admin/CategoryManagementScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { CategoryForm } from '../../components/forms/CategoryForm';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { EmptyState } from '../../components/feedback/EmptyState';
import { useCategory } from '../../hooks/useCategories';
import { useToast } from '../../contexts/ToastContext';
import { Category } from '../../types/navigation';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';

export const CategoryManagementScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    categories, 
    isLoading, 
    error, 
    refreshCategories 
  } = useCategory();
  
  const { showToast } = useToast();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshCategories();
    setRefreshing(false);
  };

  const handleCreateCategory = async (name: string) => {
    try {
      await api.post('/category', { name });
      showToast('Categoria criada com sucesso', 'success');
      setShowForm(false);
      refreshCategories();
    } catch (error) {
      showToast('Erro ao criar categoria', 'error');
    }
  };

  const handleUpdateCategory = async (name: string) => {
    if (!selectedCategory) return;

    try {
      await api.put(`/category/${selectedCategory._id}`, { name });
      showToast('Categoria atualizada com sucesso', 'success');
      setSelectedCategory(null);
      refreshCategories();
    } catch (error) {
      showToast('Erro ao atualizar categoria', 'error');
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a categoria "${category.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/category/${category._id}`);
              showToast('Categoria excluída com sucesso', 'success');
              refreshCategories();
            } catch (error) {
              showToast('Erro ao excluir categoria', 'error');
            }
          }
        }
      ]
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categorySlug}>{item.slug}</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setSelectedCategory(item)}
        >
          <Feather name="edit" size={20} color={theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCategory(item)}
        >
          <Feather name="trash-2" size={20} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gerenciar Categorias</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Feather name="plus" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Nova Categoria</Text>
        </TouchableOpacity>
      </View>

      {(showForm || selectedCategory) && (
        <CategoryForm
          initialValue={selectedCategory?.name}
          onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}
          onCancel={() => {
            setShowForm(false);
            setSelectedCategory(null);
          }}
        />
      )}

      {error ? (
        <ErrorDisplay
          message={error}
          onRetry={refreshCategories}
        />
      ) : categories.length === 0 ? (
        <EmptyState
          icon="grid"
          title="Nenhuma categoria cadastrada"
          message="Comece adicionando sua primeira categoria"
          actionLabel="Criar Categoria"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.medium,
  },
  addButtonText: {
    color: theme.colors.text.inverse,
    marginLeft: theme.spacing.small,
    fontWeight: '500',
  },
  listContainer: {
    padding: theme.spacing.medium,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.light,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
  },
  categorySlug: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    padding: theme.spacing.small,
    marginRight: theme.spacing.small,
  },
  deleteButton: {
    padding: theme.spacing.small,
  },
});