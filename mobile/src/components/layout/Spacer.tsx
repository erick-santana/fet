import React from 'react';
import { View } from 'react-native';
import theme from '../../styles/theme';

type SpacerSize = keyof typeof theme.spacing | number;

interface SpacerProps {
  size?: SpacerSize;
  horizontal?: boolean;
}

export const Spacer: React.FC<SpacerProps> = ({
  size = 'medium',
  horizontal = false,
}) => {
  const spacing = typeof size === 'number' ? size : theme.spacing[size];

  return (
    <View
      style={
        horizontal
          ? { width: spacing }
          : { height: spacing }
      }
    />
  );
};

export default Spacer;