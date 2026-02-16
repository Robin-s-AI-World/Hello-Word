/**
 * Badge Component - Liturgical color badges and labels
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { LITURGICAL_COLORS, LiturgicalColorName } from '../../core/types/liturgical';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'proper' | 'ordinary' | 'solemn' | 'liturgical';
  liturgicalColor?: LiturgicalColorName;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  liturgicalColor = 'green',
  size = 'small',
  style,
  textStyle,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, size);

  const getBackgroundColor = () => {
    if (variant === 'liturgical') {
      const color = LITURGICAL_COLORS[liturgicalColor];
      return `${color}20`; // 20% opacity
    }
    switch (variant) {
      case 'proper':
        return `${LITURGICAL_COLORS.green}15`;
      case 'solemn':
        return `${LITURGICAL_COLORS.gold}15`;
      case 'ordinary':
        return theme.colors.surfaceVariant;
      default:
        return theme.colors.surfaceVariant;
    }
  };

  const getBorderColor = () => {
    if (variant === 'liturgical') {
      return `${LITURGICAL_COLORS[liturgicalColor]}40`;
    }
    switch (variant) {
      case 'proper':
        return `${LITURGICAL_COLORS.green}30`;
      case 'solemn':
        return `${LITURGICAL_COLORS.gold}30`;
      default:
        return theme.colors.border;
    }
  };

  const getTextColor = () => {
    if (variant === 'liturgical') {
      return LITURGICAL_COLORS[liturgicalColor];
    }
    switch (variant) {
      case 'proper':
        return LITURGICAL_COLORS.green;
      case 'solemn':
        return LITURGICAL_COLORS.gold;
      default:
        return theme.colors.onSurfaceVariant;
    }
  };

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: getTextColor() },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const createStyles = (theme: Theme, size: 'small' | 'medium' | 'large') => {
  const sizeConfig = {
    small: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      fontSize: 10,
      borderRadius: 4,
    },
    medium: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontSize: 12,
      borderRadius: 6,
    },
    large: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 14,
      borderRadius: 8,
    },
  };

  const config = sizeConfig[size];

  return StyleSheet.create({
    badge: {
      paddingHorizontal: config.paddingHorizontal,
      paddingVertical: config.paddingVertical,
      borderRadius: config.borderRadius,
      alignSelf: 'flex-start',
    },
    text: {
      fontSize: config.fontSize,
      fontWeight: '600',
      fontFamily: theme.typography.primaryFont,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });
};

export default Badge;
