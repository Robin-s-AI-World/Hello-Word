/**
 * RubricText Component - Red italic liturgical instructions
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface RubricTextProps {
  children: string;
  centered?: boolean;
  bold?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: TextStyle;
}

export const RubricText: React.FC<RubricTextProps> = ({
  children,
  centered = false,
  bold = false,
  size = 'small',
  style,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, size);

  return (
    <Text
      style={[
        styles.rubric,
        centered && styles.centered,
        bold && styles.bold,
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const createStyles = (theme: Theme, size: 'small' | 'medium' | 'large') => {
  const fontSizes = {
    small: 12,
    medium: 14,
    large: 16,
  };

  return StyleSheet.create({
    rubric: {
      fontFamily: theme.typography.secondaryFont,
      fontStyle: 'italic',
      color: LITURGICAL_COLORS.red,
      fontSize: fontSizes[size],
      lineHeight: fontSizes[size] * 1.4,
    },
    centered: {
      textAlign: 'center',
    },
    bold: {
      fontWeight: '700',
    },
  });
};

export default RubricText;
