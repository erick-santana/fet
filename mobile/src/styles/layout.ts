import { StyleSheet } from 'react-native';
import theme from './theme';

export const layout = StyleSheet.create({
  // Screen Layouts
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flexGrow: 1,
  },
  
  // Content Containers
  container: {
    flex: 1,
    padding: theme.spacing.medium,
  },
  contentContainer: {
    flexGrow: 1,
    padding: theme.spacing.medium,
  },
  
  // Grid Layouts
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.small,
  },
  col2: {
    width: '50%',
    paddingHorizontal: theme.spacing.small,
  },
  col3: {
    width: '33.33%',
    paddingHorizontal: theme.spacing.small,
  },
  col4: {
    width: '25%',
    paddingHorizontal: theme.spacing.small,
  },
  
  // Flex Helpers
  flexGrow: {
    flexGrow: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexStart: {
    justifyContent: 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Spacing
  margin: {
    margin: theme.spacing.medium,
  },
  marginVertical: {
    marginVertical: theme.spacing.medium,
  },
  marginHorizontal: {
    marginHorizontal: theme.spacing.medium,
  },
  padding: {
    padding: theme.spacing.medium,
  },
  paddingVertical: {
    paddingVertical: theme.spacing.medium,
  },
  paddingHorizontal: {
    paddingHorizontal: theme.spacing.medium,
  },
  
  // Position
  relative: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // Z-Index Layers
  layer1: {
    zIndex: 1,
  },
  layer2: {
    zIndex: 2,
  },
  layer3: {
    zIndex: 3,
  },
  
  // Header and Footer
  header: {
    height: 56,
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.light,
    ...theme.shadows.light,
  },
  footer: {
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
});

export default layout;