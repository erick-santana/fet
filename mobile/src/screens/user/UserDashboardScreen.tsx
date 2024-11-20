import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { Container } from '../../components/layout/Container';
import { Section } from '../../components/layout/Section';
import { Button } from '../../components/ui/Button';
import { 
  UserStackParamList,
  MenuItemType,
  ScreenNavigationProp,
} from '../../types/navigation';
import theme from '../../styles/theme';

type NavigationProp = ScreenNavigationProp<UserStackParamList, 'UserDashboard'>;

export const UserDashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { auth, signOut } = useAuth();

  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Specify MenuItemType with UserStackParamList
  const menuItems: MenuItemType<UserStackParamList>[] = [
    {
      title: 'Meus Pedidos',
      icon: 'shopping-bag',
      screen: 'UserOrders',
      description: 'Ver histórico de pedidos',
    },
    {
      title: 'Meu Perfil',
      icon: 'user',
      screen: 'UserProfile',
      description: auth.user?.name ? `Editar perfil` : 'Completar perfil',
    },
    {
      title: 'Endereço de Entrega',
      icon: 'map-pin',
      screen: 'UserAddress',
      description: auth.user?.address ? 'Alterar endereço' : 'Adicionar endereço',
    },
  ];

  return (
    <Container>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Olá, {auth.user?.name}
        </Text>
        <Text style={styles.subtitle}>
          Bem-vindo ao seu painel
        </Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.menuIconContainer}>
              <Feather name={item.icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
            <Feather name="chevron-right" size={24} color={theme.colors.text.secondary} />
          </TouchableOpacity>
        ))}
      </View>

      <Button
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutButton}
      >
        Sair da Conta
      </Button>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  // Styles remain exactly the same
  header: {
    padding: theme.spacing.medium,
    backgroundColor: theme.colors.surface,
    alignItems: 'center', 
    justifyContent: 'center',
    marginHorizontal: -10,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xxlarge,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.small,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text.secondary,
  },
  menuContainer: {
    padding: theme.spacing.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.light,
  },
  menuIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${theme.colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.medium,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.tiny,
  },
  menuDescription: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.text.secondary,
  },
  logoutButton: {
    margin: theme.spacing.medium,
  },
});