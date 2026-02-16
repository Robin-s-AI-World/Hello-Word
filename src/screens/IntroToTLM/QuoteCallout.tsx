/**
 * QuoteCallout - Quote display box component
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface QuoteCalloutProps {
  quote: string;
  author: string;
  source: string;
  title: string;
}

export const QuoteCallout: React.FC<QuoteCalloutProps> = ({
  quote,
  author,
  source,
  title,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.quote}>"{quote}"</Text>
        <Text style={styles.attribution}>
          — {author}, <Text style={styles.source}>{source}</Text>
        </Text>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    backgroundColor: theme.dark
      ? `${LITURGICAL_COLORS.gold}10`
      : `${LITURGICAL_COLORS.gold}10`,
    overflow: 'hidden',
    marginTop: 24,
  },
  accentBar: {
    width: 4,
    backgroundColor: LITURGICAL_COLORS.gold,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 11,
    fontWeight: '700',
    color: LITURGICAL_COLORS.gold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: theme.typography.primaryFont,
  },
  quote: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'italic',
    color: theme.dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
    lineHeight: 22,
    fontFamily: theme.typography.secondaryFont,
  },
  attribution: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textAlign: 'right',
    marginTop: 8,
    opacity: 0.7,
    fontFamily: theme.typography.primaryFont,
  },
  source: {
    fontStyle: 'italic',
    fontWeight: '400',
  },
});

export default QuoteCallout;
