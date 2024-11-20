// src/mobile/src/screens/auth/ForgotPasswordScreen.tsx

import React from 'react';
import {
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { useForm } from '../../hooks/useForm';
import { useError } from '../../hooks/useError';
import { useToast } from '../../contexts/ToastContext';
import { schemas } from '../../utils/validation';
import api from '../../api/axiosConfig';
import type { AuthScreenNavigationProp } from '../../types/navigation';

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { error, setError, clearError } = useError();
  const { showToast } = useToast();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useForm<ForgotPasswordForm>({
    initialValues: {
      email: '',
    },
    validationSchema: schemas.user.forgotPassword,
    onSubmit: async (formValues) => {
      try {
        clearError();
        console.log('Sending password recovery request for:', formValues.email);
        
        const { data } = await api.post(`/user/recovery`, {
          email: formValues.email
        });
        
        if (data?.error) {
          throw new Error(data.error);
        }
        
        Alert.alert(
          'Sucesso',
          'Instruções de recuperação foram enviadas para seu email.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } catch (err) {
        console.error('Password recovery error:', err);
        showToast('Erro ao recuperar senha', 'error');
        setError(err);
      }
    }
  });

  return (
    <Container scroll>
      <Section
        title="Recuperar Senha"
        subtitle="Digite seu email para receber instruções"
        style={styles.section}
        centerHeader={true}
        contentStyle={styles.content}
      >
        <Input
          label="Email"
          placeholder="Digite seu email"
          value={values.email}
          onChangeText={handleChange('email')}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail"
        />

        {error && (
          <ErrorDisplay message={error?.message || 'Erro ao processar solicitação'} />
        )}

        <Button
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
          style={styles.submitButton}
        >
          Enviar Instruções
        </Button>

        <Button
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          fullWidth
          style={styles.backButton}
        >
          Voltar para Login
        </Button>
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 50,
  },
  submitButton: {
    marginTop: 20,
  },
  backButton: {
    marginTop: 10,
  },
});