import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { schemas } from '../../utils/validation';
import type { LoginForm } from '../../types/form.types';
import type { AuthScreenNavigationProp } from '../../types/navigation';

export const LoginScreen = () => {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { signIn, loading, error } = useAuth();
  const { showToast } = useToast();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: schemas.user.login,
    onSubmit: async (formValues) => {
      try {
        console.log('Attempting login with:', formValues.email);
        await signIn(formValues.email, formValues.password);
        showToast('Login realizado com sucesso', 'success');
      } catch (err) {
        console.error('Login error:', err);
        showToast('Falha no login. Verifique suas credenciais.', 'error');
      }
    },
  });

  return (
    <Container>
      <Section
        title="Entrar"
        subtitle="Faça login para continuar"
        style={styles.section}
        centerHeader={true}
        contentStyle={styles.content}
      >
        {/* Logo */}
        <Image
          source={require('../../../assets/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Inputs */}
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

        {/* Botões */}
        <Button
          onPress={handleSubmit}
          loading={loading || isSubmitting}
          fullWidth
          style={styles.loginButton}
        >
          Entrar
        </Button>

        <Button
          variant="ghost"
          onPress={() => navigation.navigate('ForgotPassword')}
          style={styles.forgotButton}
        >
          Esqueci minha senha
        </Button>

        <Button
          variant="outline"
          onPress={() => navigation.navigate('Register')}
          fullWidth
          style={styles.registerButton}
        >
          Criar nova conta
        </Button>
      </Section>
    </Container>
  );
};

const styles = StyleSheet.create({
  section: {
    flex: 1, 
  },
  content: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  logo: {
    width: 300, 
    height: 300, 
    marginBottom: 20, 
  },
  loginButton: {
    marginTop: 20,
  },
  forgotButton: {
    marginTop: 10,
  },
  registerButton: {
    marginTop: 20,
  },
});
