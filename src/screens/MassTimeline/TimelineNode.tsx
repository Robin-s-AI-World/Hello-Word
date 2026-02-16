/**
 * TimelineNode - Icon/dot/gold node variants for timeline
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

type NodeType = 'icon' | 'dot' | 'gold';

interface TimelineNodeProps {
  type: NodeType;
  icon?: string;
  size?: 'small' | 'medium' | 'large';
  isActive?: boolean;
}

export const TimelineNode: React.FC<TimelineNodeProps> = ({
  type,
  icon,
  size = 'medium',
  isActive = false,
}) => {
  const { theme } = useTheme();

  const sizes = {
    small: 12,
    medium: 32,
    large: 48,
  };

  const nodeSize = sizes[size];

  if (type === 'dot') {
    return (
      <View
        style={[
          styles.dot,
          {
            width: nodeSize * 0.375,
            height: nodeSize * 0.375,
            borderRadius: nodeSize * 0.1875,
            backgroundColor: isActive
              ? LITURGICAL_COLORS.gold
              : LITURGICAL_COLORS.green,
          },
        ]}
      />
    );
  }

  if (type === 'gold') {
    return (
      <View
        style={[
          styles.goldNode,
          {
            width: nodeSize * 1.2,
            height: nodeSize * 1.2,
            borderRadius: nodeSize * 0.6,
          },
        ]}
      >
        <Text style={styles.goldIcon}>{icon || '★'}</Text>
      </View>
    );
  }

  // Icon type
  return (
    <View
      style={[
        styles.iconNode,
        {
          width: nodeSize,
          height: nodeSize,
          borderRadius: nodeSize / 2,
          backgroundColor: isActive
            ? LITURGICAL_COLORS.green
            : (theme.dark ? '#101622' : '#f6f6f8'),
          borderColor: LITURGICAL_COLORS.green,
          borderWidth: isActive ? 0 : 2,
        },
        isActive && styles.iconNodeActive,
      ]}
    >
      <Text
        style={[
          styles.iconText,
          {
            fontSize: nodeSize * 0.5,
            color: isActive ? '#ffffff' : LITURGICAL_COLORS.green,
          },
        ]}
      >
        {icon || '•'}
      </Text>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  dot: {},
  iconNode: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconNodeActive: {
    shadowColor: LITURGICAL_COLORS.green,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {},
  goldNode: {
    backgroundColor: LITURGICAL_COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  goldIcon: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
});

const styles = createStyles({} as Theme); // Placeholder for non-theme styles

export default TimelineNode;
