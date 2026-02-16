/**
 * ConsiderationsSection - FSSP/SSPX info section
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

export const ConsiderationsSection: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Considerations for Attendance</Text>

      {/* FSSP / ICKSP */}
      <View style={styles.item}>
        <View style={[styles.accentBar, styles.accentBarGreen]} />
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, styles.itemTitleGreen]}>
            FSSP / ICKSP
          </Text>
          <Text style={styles.itemSubtitle}>Full Communion</Text>
          <Text style={styles.itemText}>
            Groups like the Priestly Fraternity of St. Peter (FSSP) and the
            Institute of Christ the King (ICKSP) are established by the Holy
            See and are in full, regular canonical standing. The sacraments
            here are licit and valid.
          </Text>
        </View>
      </View>

      {/* SSPX */}
      <View style={styles.item}>
        <View style={[styles.accentBar, styles.accentBarOrange]} />
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, styles.itemTitleOrange]}>
            SSPX
          </Text>
          <Text style={styles.itemSubtitle}>Irregular Status</Text>
          <Text style={styles.itemText}>
            The Society of St. Pius X (SSPX) holds a complex canonical status.
            While their priests are validly ordained, the society lacks
            regular jurisdiction. Attendance fulfills the Sunday obligation,
            but discretion is advised regarding governance.
          </Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginTop: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 16,
    fontFamily: theme.typography.primaryFont,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingLeft: 16,
    position: 'relative',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  },
  accentBarGreen: {
    backgroundColor: '#16a34a',
  },
  accentBarOrange: {
    backgroundColor: '#f97316',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: theme.typography.primaryFont,
  },
  itemTitleGreen: {
    color: theme.dark ? '#4ade80' : '#16a34a',
  },
  itemTitleOrange: {
    color: theme.dark ? '#fb923c' : '#f97316',
  },
  itemSubtitle: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
    fontFamily: theme.typography.secondaryFont,
  },
  itemText: {
    fontSize: 14,
    color: theme.dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
    lineHeight: 22,
    fontFamily: theme.typography.secondaryFont,
  },
});

export default ConsiderationsSection;
