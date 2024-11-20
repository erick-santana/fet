// src/screens/admin/ProductFormScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { FormSelect } from '../../components/forms/FormSelect';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { useCategory } from '../../hooks/useCategories';
import { useToast } from '../../contexts/ToastContext';
import { Product, AdminStackParamList } from '../../types/navigation';
import theme from '../../styles/theme';
import api from '../../api/axiosConfig';

type ProductFormNavigationProp = StackNavigationProp<AdminStackParamList, 'ProductForm'>;
type ProductFormRouteProp = RouteProp<AdminStackParamList, 'ProductForm'>;

interface RouteParams {
  product?: Product;
  mode: 'create' | 'edit';
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string | number; // Update to accept both string and number
  quantity: string;
  shipping: boolean;
  photo?: File;
}

export const ProductFormScreen: React.FC = () => {
  const navigation = useNavigation<ProductFormNavigationProp>();
  const route = useRoute<ProductFormRouteProp>();
  const { product, mode } = route.params as RouteParams;
  const { categories, isLoading: loadingCategories } = useCategory();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category?._id || '',
    quantity: product?.quantity?.toString() || '',
    shipping: product?.shipping || false,
  });

  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    requestMediaLibraryPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à sua galeria para selecionar imagens.');
      }
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      showToast('Erro ao selecionar imagem', 'error');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = 'Preço inválido';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    if (!formData.quantity || isNaN(Number(formData.quantity))) {
      newErrors.quantity = 'Quantidade inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createFormData = () => {
    const form = new FormData();

    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('price', formData.price);
    form.append('category', formData.category);
    form.append('quantity', formData.quantity);
    form.append('shipping', formData.shipping ? '1' : '0');

    if (photo) {
      const filename = photo.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      form.append('photo', {
        uri: photo,
        name: filename,
        type,
      } as any);
    }

    return form;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('Por favor, preencha todos os campos obrigatórios', 'error');
      return;
    }

    setLoading(true);
    try {
      const productData = createFormData();

      if (mode === 'edit' && product) {
        await api.put(`/product/${product._id}`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Produto atualizado com sucesso', 'success');
      } else {
        await api.post('/product', productData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Produto criado com sucesso', 'success');
      }

      navigation.goBack();
    } catch (error) {
      showToast('Erro ao salvar produto', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Container style={{ marginHorizontal: 10 }}>
      <ScrollView>
        <Section title={mode === 'edit' ? 'Editar Produto' : 'Novo Produto'}>
          <TouchableOpacity 
            style={styles.imageContainer}
            onPress={handleImagePick}
          >
            {photo ? (
              <Image source={{ uri: photo }} style={styles.image} />
            ) : product ? (
              <Image 
                source={{ uri: `${api.defaults.baseURL}/product/photo/${product._id}` }}
                style={styles.image}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={40} color={theme.colors.text.secondary} />
                <Text style={styles.imagePlaceholderText}>
                  Adicionar Foto
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Input
            label="Nome do Produto"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={errors.name}
            placeholder="Digite o nome do produto"
          />

          <Input
            label="Descrição"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            error={errors.description}
            placeholder="Digite a descrição do produto"
            multiline
            numberOfLines={4}
          />

          <Input
            label="Preço"
            value={formData.price}
            onChangeText={(text) => setFormData({ ...formData, price: text })}
            error={errors.price}
            placeholder="0.00"
            keyboardType="decimal-pad"
          />

<FormSelect
  label="Categoria"
  value={formData.category}  // No need for toString() now
  onChangeText={(value) => setFormData({ ...formData, category: value })}
  error={errors.category}
  options={categories.map(cat => ({
    label: cat.name,
    value: cat._id  // Can remain as is since we handle both types
  }))}
/>

          <Input
            label="Quantidade"
            value={formData.quantity}
            onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            error={errors.quantity}
            placeholder="0"
            keyboardType="number-pad"
          />

<FormSelect
  label="Frete Disponível"
  value={formData.shipping.toString()}  // This one still needs toString() as it's boolean
  onChangeText={(value) => setFormData({ ...formData, shipping: value === 'true' })}
  options={[
    { label: 'Sim', value: 'true' },
    { label: 'Não', value: 'false' }
  ]}
/>

          <Button
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          >
            {mode === 'edit' ? 'Atualizar Produto' : 'Criar Produto'}
          </Button>

          <Button
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
        </Section>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginBottom: theme.spacing.medium,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  imagePlaceholderText: {
    marginTop: theme.spacing.small,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
  },
  submitButton: {
    marginTop: theme.spacing.large,
  },
  cancelButton: {
    marginTop: theme.spacing.medium,
  }
});