/**
 * DropCap Component - Decorative drop-cap initial letter
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface DropCapProps {
  text: string;
  dropCapColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fontSize?: number;
}

export const DropCap: React.FC<DropCapProps> = ({
  text,
  dropCapColor = LITURGICAL_COLORS.gold,
  style,
  textStyle,
  fontSize = 18,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, dropCapColor, fontSize);

  if (!text || text.length === 0) {
    return null;
  }

  const firstChar = text.charAt(0);
  const restOfText = text.slice(1);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>
        <Text style={styles.dropCap}>{firstChar}</Text>
        {restOfText}
      </Text>
    </View>
  );
};

const createStyles = (theme: Theme, dropCapColor: string, fontSize: number) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  text: {
    fontSize,
    fontFamily: theme.typography.secondaryFont,
    color: theme.colors.onSurface,
    lineHeight: fontSize * 1.6,
  },
  dropCap: {
    fontSize: fontSize * 2.2,
    fontWeight: '700',
    color: dropCapColor,
    fontFamily: theme.typography.primaryFont,
    lineHeight: fontSize * 2,
  },
});

export default DropCap;
