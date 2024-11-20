import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { schemas } from '../../utils/validation';
import type { RegisterForm } from '../../types/form.types';
import type { AuthScreenNavigationProp } from '../../types/navigation';

export const RegisterScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { signUp, loading, error } = useAuth();
  const { showToast } = useToast();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useForm<RegisterForm>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: ''
    },
    validationSchema: schemas.user.register,
    onSubmit: async (formValues) => {
      try {
        await signUp(
          formValues.name,
          formValues.email,
          formValues.password,
          formValues.address
        );
        showToast('Registro realizado com sucesso', 'success');
        navigation.navigate('Login');
      } catch (err) {
        showToast('Erro ao realizar registro', 'error');
        console.error('Registration error:', err);
      }
    },
  });

  return (
    <Container scroll>
      <Section
        title="Criar Conta"
        subtitle="Preencha os dados para se cadastrar"
        style={styles.section}
        centerHeader={true}
        contentStyle={styles.content}
      >
        <Input
          label="Nome Completo"
          placeholder="Digite seu nome completo"
          value={values.name}
          onChangeText={handleChange('name')}
          error={errors.name}
          autoCapitalize="words"
          leftIcon="user"
        />

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

        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={values.password}
          onChangeText={handleChange('password')}
          error={errors.password}
          secureTextEntry
          leftIcon="lock"
        />

        <Input
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          value={values.confirmPassword}
          onChangeText={handleChange('confirmPassword')}
          error={errors.confirmPassword}
          secureTextEntry
          leftIcon="lock"
        />

        <Input
          label="Endereço"
          placeholder="Digite seu endereço completo"
          value={values.address}
          onChangeText={handleChange('address')}
          error={errors.address}
          autoCapitalize="sentences"
          leftIcon="map-pin"
        />

        {error && (
          <ErrorDisplay message={error} />
        )}

        <Button
          onPress={handleSubmit}
          loading={loading || isSubmitting}
          fullWidth
          style={styles.registerButton}
        >
          Cadastrar
        </Button>

        <Button
          variant="outline"
          onPress={() => navigation.navigate('Login')}
          fullWidth
          style={styles.loginButton}
        >
          Já tenho uma conta
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
  registerButton: {
    marginTop: 20,
  },
  loginButton: {
    marginTop: 10,
  },
});