// Theme constants for the application
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const theme = {
  // Colors
  colors: {
    // Primary colors
    primary: '#4CAF50',
    primaryDark: '#388E3C',
    primaryLight: '#81C784',
    
    // Secondary colors
    secondary: '#FFC107',
    secondaryDark: '#FFA000',
    secondaryLight: '#FFD54F',
    
    // UI colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#DC3545',
    success: '#28A745',
    warning: '#FFC107',
    info: '#17A2B8',
    
    // Text colors
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
      inverse: '#FFFFFF',
    },
    
    // Border colors
    border: {
      light: '#EEEEEE',
      medium: '#DDDDDD',
      dark: '#CCCCCC',
    },
  },

  // Typography
  typography: {
    // Font families
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    
    // Font sizes
    fontSize: {
      tiny: 12,
      small: 14,
      medium: 16,
      large: 18,
      xlarge: 20,
      xxlarge: 24,
      huge: 32,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },

  // Spacing
  spacing: {
    tiny: 4,
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
    xxlarge: 48,
  },

  // Border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    round: 999,
  },

  // Shadows
  shadows: {
    light: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4.65,
      elevation: 4,
    },
    strong: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 5.46,
      elevation: 6,
    },
  },

  // Screen dimensions
  screen: {
    width,
    height,
    isSmall: width <= 375,
    padding: 16,
  },
};

export type Theme = typeof theme;

// Export default theme
export default theme;