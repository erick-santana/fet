import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: {
    primary: string;
    secondary: string;
    inverse: string;
  };
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface ThemeSpacing {
  tiny: number;
  small: number;
  medium: number;
  large: number;
  xlarge: number;
}

// Style Properties
export type StyleProp = ViewStyle | TextStyle | ImageStyle;

// Common Component Styles
export interface ComponentStyles {
  container: ViewStyle;
  text: TextStyle;
  button: ViewStyle;
  buttonText: TextStyle;
}