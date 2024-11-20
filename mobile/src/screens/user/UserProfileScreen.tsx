import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ErrorDisplay } from '../../components/feedback/ErrorDisplay';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../contexts/ToastContext';
import { schemas } from '../../utils/validation';
import theme from '../../styles/theme';
import { useNavigation } from '@react-navigation/native';

interface ProfileForm {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
}

export const UserProfileScreen = () => {
  const navigation = useNavigation();
  const { auth, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useForm<ProfileForm>({
    initialValues: {
      name: auth.user?.name || '',
      email: auth.user?.email || '',
      currentPassword: '',
      newPassword: '',
    },
    validationSchema: schemas.user.updateProfile,
    onSubmit: async (formValues) => {
      try {
        await updateProfile({
          name: formValues.name,
          ...(formValues.newPassword && {
            currentPassword: formValues.currentPassword,
            newPassword: formValues.newPassword,
          }),
        });
        showToast('Perfil atualizado com sucesso', 'success');
      } catch (err) {
        showToast('Erro ao atualizar perfil', 'error');
      }
    },
  });

  return (
    <Container style={{ marginHorizontal: 10 }} scroll>
      <Section
        title="Meu Perfil"
        subtitle="Atualize suas informações pessoais"
        titleStyle={styles.title}
        subtitleStyle={styles.subtitle}
        
      >
        <View style={styles.form}>
          <Input
            label="Nome"
            value={values.name}
            onChangeText={handleChange('name')}
            error={errors.name}
            placeholder="Seu nome completo"
            autoCapitalize="words"
            leftIcon="user"
          />

          <Input
            label="Email"
            value={values.email}
            onChangeText={handleChange('email')}
            error={errors.email}
            placeholder="Seu nome completo"
            leftIcon="mail"            
          />

          <Section title="Alterar Senha" style={styles.passwordSection}>
            <Input
              label="Senha Atual"
              value={values.currentPassword}
              onChangeText={handleChange('currentPassword')}
              error={errors.currentPassword}
              secureTextEntry={!showPassword}
              placeholder="Digite sua senha atual"
              leftIcon="lock"
              rightIcon={showPassword ? "eye-off" : "eye"}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Nova Senha"
              value={values.newPassword}
              onChangeText={handleChange('newPassword')}
              error={errors.newPassword}
              secureTextEntry={!showPassword}
              placeholder="Digite a nova senha"
              leftIcon="lock"
            />
          </Section>

          <Button
            onPress={handleSubmit}
            loading={isSubmitting}
            fullWidth
            variant="primary"
            style={styles.submitButton}
          >
            Salvar Alterações
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
  passwordSection: {
    marginTop: theme.spacing.large,
  },
  disabledInput: {
    backgroundColor: theme.colors.surface,
    opacity: 0.7,
  },
  submitButton: {
    marginTop: theme.spacing.large,
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
  },
  cancelButton: {
    marginTop: theme.spacing.small,
  },
});