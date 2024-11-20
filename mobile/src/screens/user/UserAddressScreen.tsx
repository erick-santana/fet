import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { schemas } from '../../utils/validation';
import theme from '../../styles/theme';

interface AddressForm {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export const UserAddressScreen = () => {
  const navigation = useNavigation();
  const { auth, updateProfile } = useAuth();
  const { showToast } = useToast();

  const parseExistingAddress = () => {
    if (!auth.user?.address) {
      return {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      };
    }

    const parts = auth.user.address.split(',').map(part => part.trim());
    return {
      street: parts[0] || '',
      number: parts[1] || '',
      complement: parts[2] || '',
      neighborhood: parts[3] || '',
      city: parts[4] || '',
      state: parts[5] || '',
      zipCode: parts[6] || '',
    };
  };

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useForm<AddressForm>({
    initialValues: parseExistingAddress(),
    validationSchema: schemas.user.address,
    onSubmit: async (formValues) => {
      try {
        const formattedAddress = [
          formValues.street,
          formValues.number,
          formValues.complement,
          formValues.neighborhood,
          formValues.city,
          formValues.state,
          formValues.zipCode
        ].filter(Boolean).join(', ');

        await updateProfile({ address: formattedAddress });
        showToast('Endereço atualizado com sucesso', 'success');
        navigation.goBack();
      } catch (error) {
        showToast('Erro ao atualizar endereço', 'error');
      }
    },
  });

  return (
    <Container style={{ marginHorizontal: 10 }} scroll>
      <Section
        title={auth.user?.address ? 'Atualizar Endereço' : 'Adicionar Endereço'}
        subtitle="Preencha seu endereço de entrega"
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
      >
        <View style={styles.form}>
          <Input
            label="CEP"
            value={values.zipCode}
            onChangeText={handleChange('zipCode')}
            error={errors.zipCode}
            placeholder="00000-000"
            keyboardType="numeric"
            maxLength={9}
            leftIcon="map-pin"
          />

          <View style={styles.row}>
            <View style={styles.streetInput}>
              <Input
                label="Rua"
                value={values.street}
                onChangeText={handleChange('street')}
                error={errors.street}
                placeholder="Nome da rua"
                leftIcon="map"
              />
            </View>

            <View style={styles.numberInput}>
              <Input
                label="Número"
                value={values.number}
                onChangeText={handleChange('number')}
                error={errors.number}
                placeholder="Nº"
                keyboardType="numeric"
                leftIcon="hash"
              />
            </View>
          </View>

          <Input
            label="Complemento"
            value={values.complement}
            onChangeText={handleChange('complement')}
            error={errors.complement}
            placeholder="Apto, Bloco, etc."
            leftIcon="plus"
          />

          <Input
            label="Bairro"
            value={values.neighborhood}
            onChangeText={handleChange('neighborhood')}
            error={errors.neighborhood}
            placeholder="Nome do bairro"
            leftIcon="map"
          />

          <View style={styles.row}>
            <View style={styles.cityInput}>
              <Input
                label="Cidade"
                value={values.city}
                onChangeText={handleChange('city')}
                error={errors.city}
                placeholder="Nome da cidade"
                leftIcon="home"
              />
            </View>

            <View style={styles.stateInput}>
              <Input
                label="Estado"
                value={values.state}
                onChangeText={handleChange('state')}
                error={errors.state}
                placeholder="UF"
                maxLength={2}
                autoCapitalize="characters"
                leftIcon="globe"
              />
            </View>
          </View>

          <Button
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
            variant="primary"
            style={styles.submitButton}
          >
            {auth.user?.address ? 'Atualizar Endereço' : 'Salvar Endereço'}
          </Button>

          <Button
            onPress={() => navigation.goBack()}
            variant="outline"
            fullWidth
            style={styles.cancelButton}
          >
            Cancelar
          </Button>
        </View>
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.medium,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  streetInput: {
    flex: 3,
  },
  numberInput: {
    flex: 1,
  },
  cityInput: {
    flex: 3,
  },
  stateInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: theme.spacing.medium,
  },
  cancelButton: {
    marginTop: theme.spacing.small,
  },
  title: {
    textAlign: 'center', 
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
    paddingBottom: theme.spacing.xxlarge,
  },
});