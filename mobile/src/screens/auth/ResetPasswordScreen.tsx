// src/mobile/src/screens/auth/ResetPasswordScreen.tsx

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
import type { AuthStackParamList, AuthScreenNavigationProp } from '../../types/navigation';

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

type ResetPasswordRouteProp = RouteProp<AuthStackParamList, 'ResetPassword'>;

export const ResetPasswordScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { token } = route.params;
  const { error, setError, clearError } = useError();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useForm<ResetPasswordForm>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: schemas.user.resetPassword,
    onSubmit: async (formValues) => {
      try {
        clearError();
        console.log('Attempting to reset password');

        const { data } = await api.post('/reset-password', {
          token,
          newPassword: formValues.password
        });

        if (data?.error) {
          throw new Error(data.error);
        }

        showToast('Senha alterada com sucesso', 'success');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (err) {
        console.error('Password reset error:', err);
        showToast('Não foi possível alterar sua senha', 'error');
        setError(err);
      }
    }
  });

  return (
    <Container scroll>
      <Section 
        title="Nova Senha"
        subtitle="Digite sua nova senha"
        style={styles.section}
        centerHeader={true}
        contentStyle={styles.content}
      >
        <Input
          label="Nova Senha"
          value={values.password}
          onChangeText={handleChange('password')}
          placeholder="Digite sua nova senha"
          secureTextEntry={!showPassword}
          error={errors.password}
          leftIcon="lock"
          rightIcon={showPassword ? "eye-off" : "eye"}
          onRightIconPress={() => setShowPassword(!showPassword)}
        />

        <Input
          label="Confirmar Nova Senha"
          value={values.confirmPassword}
          onChangeText={handleChange('confirmPassword')}
          placeholder="Confirme sua nova senha"
          secureTextEntry={!showPassword}
          error={errors.confirmPassword}
          leftIcon="lock"
        />

        {error && (
          <ErrorDisplay message={error instanceof Error ? error.message : 'Erro ao processar solicitação'} />
        )}

        <Button
          onPress={handleSubmit}
          loading={isSubmitting}
          fullWidth
          style={styles.resetButton}
          variant="primary"
        >
          Alterar Senha
        </Button>

        <Button
          variant="outline"
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })}
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
    paddingHorizontal: 20,
  },
  resetButton: {
    marginTop: 20,
  },
  backButton: {
    marginTop: 10,
  },
});