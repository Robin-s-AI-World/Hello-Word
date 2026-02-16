/**
 * WeeklyScheduleList - List of weekly schedule items
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
import { WeeklyScheduleItem } from '../../core/types/liturgical';

interface WeeklyScheduleListProps {
  items: WeeklyScheduleItem[];
  onItemPress?: (item: WeeklyScheduleItem) => void;
}

const ICON_COLORS: { [key: string]: string } = {
  church: '#1152d4',
  key: '#a855f7',
  sun: '#f59e0b',
  moon: '#6366f1',
  book: '#10b981',
};

export const WeeklyScheduleList: React.FC<WeeklyScheduleListProps> = ({
  items,
  onItemPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const getIconColor = (iconName: string): string => {
    return ICON_COLORS[iconName] || theme.colors.primary;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Weekly Schedule{' '}
        <Text style={styles.titleLatin}>(Ordo Hebdomadae)</Text>
      </Text>

      <View style={styles.list}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              index === items.length - 1 && styles.itemLast,
            ]}
            onPress={() => onItemPress?.(item)}
            activeOpacity={0.7}
          >
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getIconColor(item.iconColor)}15` },
              ]}
            >
              <Text
                style={[
                  styles.icon,
                  { color: getIconColor(item.iconColor) },
                ]}
              >
                {item.iconName === 'church' ? '⛪' :
                 item.iconName === 'key' ? '🔑' :
                 item.iconName === 'sun' ? '☀' :
                 item.iconName === 'moon' ? '🌙' :
                 item.iconName === 'book' ? '📖' : '•'}
              </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              {item.latinTitle && (
                <Text style={styles.itemLatin}>{item.latinTitle}</Text>
              )}
              <Text style={styles.itemTime}>
                {item.day}, {item.time}
              </Text>
            </View>

            {/* Location badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleLatin: {
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
  },
  list: {
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  itemLatin: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.secondaryFont,
    marginTop: 1,
  },
  itemTime: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.secondaryFont,
    marginTop: 2,
  },
  badge: {
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.primaryFont,
  },
});

export default WeeklyScheduleList;
