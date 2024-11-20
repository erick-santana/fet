import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import theme from '../../styles/theme';

interface ContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  safeArea?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  backgroundColor?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  safeArea = true,
  refreshing = false,
  onRefresh,
  backgroundColor = theme.colors.background,
}) => {
  const Wrapper = safeArea ? SafeAreaView : View;
  const Content = scroll ? ScrollView : View;

  return (
    <Wrapper style={[styles.container, { backgroundColor }, style]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle="dark-content"
      />
      <Content
        style={styles.content}
        contentContainerStyle={[
          scroll ? styles.scrollContent : styles.viewContent,
          contentContainerStyle,
        ]}
        refreshControl={
          scroll && onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
            />
          ) : undefined
        }
      >
        {children}
      </Content>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  viewContent: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default Container;