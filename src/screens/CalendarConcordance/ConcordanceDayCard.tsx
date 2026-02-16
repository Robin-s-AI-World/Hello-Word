/**
 * ConcordanceDayCard - Side-by-side 1962 vs Modern calendar comparison
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { ConcordanceDay, LITURGICAL_COLORS } from '../../core/types/liturgical';

interface ConcordanceDayCardProps {
  day: ConcordanceDay;
  showInfoButton?: boolean;
  onInfoPress?: () => void;
  onPress?: () => void;
}

export const ConcordanceDayCard: React.FC<ConcordanceDayCardProps> = ({
  day,
  showInfoButton = false,
  onInfoPress,
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getColorValue = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      green: LITURGICAL_COLORS.green,
      red: LITURGICAL_COLORS.red,
      white: theme.dark ? '#9ca3af' : '#f8f9fa',
      violet: LITURGICAL_COLORS.violet,
      gold: LITURGICAL_COLORS.gold,
    };
    return colorMap[colorName.toLowerCase()] || LITURGICAL_COLORS.green;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateLabel}>
            {day.dayOfWeek}, {day.displayDate}
          </Text>
          {showInfoButton && (
            <TouchableOpacity
              style={styles.infoButton}
              onPress={onInfoPress}
            >
              <View style={styles.infoPing} />
              <Text style={styles.infoText}>?</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.sunIcon}>☀</Text>
      </View>

      {/* Split content */}
      <View style={styles.content}>
        {/* 1962 Calendar */}
        <TouchableOpacity
          style={styles.side}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.colorBar,
              { backgroundColor: getColorValue(day.calendar1962.color) },
              styles.colorBarLeft,
            ]}
          />
          <View style={styles.sideContent}>
            <Text style={styles.sideLabel}>1962</Text>
            <Text style={styles.celebration} numberOfLines={2}>
              {day.calendar1962.celebration}
            </Text>
            <View
              style={[
                styles.rankBadge,
                { backgroundColor: `${getColorValue(day.calendar1962.color)}20` },
              ]}
            >
              <Text
                style={[
                  styles.rankText,
                  { color: getColorValue(day.calendar1962.color) },
                ]}
              >
                {day.calendar1962.rank}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Modern Calendar */}
        <TouchableOpacity
          style={[styles.side, styles.sideRight]}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.colorBar,
              { backgroundColor: getColorValue(day.modernCalendar.color) },
              styles.colorBarRight,
            ]}
          />
          <View style={[styles.sideContent, styles.sideContentRight]}>
            <Text style={styles.sideLabel}>Modern</Text>
            <Text style={[styles.celebration, styles.celebrationRight]} numberOfLines={2}>
              {day.modernCalendar.celebration}
            </Text>
            <View
              style={[
                styles.rankBadge,
                { backgroundColor: `${getColorValue(day.modernCalendar.color)}20` },
              ]}
            >
              <Text
                style={[
                  styles.rankText,
                  { color: getColorValue(day.modernCalendar.color) },
                ]}
              >
                {day.modernCalendar.rank}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    borderRadius: 12,
    backgroundColor: theme.dark ? '#1c1c1e' : '#ffffff',
    borderWidth: 1,
    borderColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.03)' : '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: theme.typography.primaryFont,
  },
  infoButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  infoPing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.primary,
    opacity: 0.5,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  sunIcon: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.3,
  },
  content: {
    flexDirection: 'row',
  },
  divider: {
    width: 1,
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  side: {
    flex: 1,
    padding: 12,
    position: 'relative',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  colorBar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
  },
  colorBarLeft: {
    left: 0,
  },
  colorBarRight: {
    right: 0,
  },
  sideContent: {
    paddingLeft: 8,
  },
  sideContentRight: {
    paddingLeft: 0,
    paddingRight: 8,
    alignItems: 'flex-end',
  },
  sideLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: 4,
    fontFamily: theme.typography.primaryFont,
  },
  celebration: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.onSurface,
    marginBottom: 6,
    fontFamily: theme.typography.primaryFont,
    lineHeight: 18,
  },
  celebrationRight: {
    textAlign: 'right',
  },
  rankBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  rankText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: theme.typography.primaryFont,
  },
});

export default ConcordanceDayCard;
