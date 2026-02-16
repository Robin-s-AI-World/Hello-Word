/**
 * TimelineSection - Section container for Mass parts (I, II, III)
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { TimelineNode } from './TimelineNode';
import { MassPartItem } from './MassPartItem';
import { MassPart } from '../../core/types/liturgical';

interface TimelineSectionProps {
  number: string;
  title: string;
  parts: MassPart[];
  isExpanded?: boolean;
  onToggle?: () => void;
  onPartPress?: (part: MassPart) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  number,
  title,
  parts,
  isExpanded = true,
  onToggle,
  onPartPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{number}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.toggleIcon}>{isExpanded ? '−' : '+'}</Text>
      </TouchableOpacity>

      {/* Timeline Content */}
      {isExpanded && (
        <View style={styles.timeline}>
          {/* Vertical line */}
          <View style={styles.line} />

          {/* Parts */}
          {parts.map((part, index) => (
            <View key={part.id} style={styles.partRow}>
              {/* Node column */}
              <View style={styles.nodeColumn}>
                <TimelineNode
                  type={part.nodeType}
                  icon={part.icon}
                  size={part.nodeType === 'gold' ? 'large' : 'medium'}
                  isActive={part.nodeType === 'gold'}
                />
                {index < parts.length - 1 && <View style={styles.lineConnector} />}
              </View>

              {/* Content column */}
              <View style={styles.contentColumn}>
                <MassPartItem
                  name={part.name}
                  latinName={part.latinName}
                  type={part.type}
                  isCompact={part.nodeType === 'dot'}
                  isHighlighted={part.nodeType === 'gold'}
                  onPress={() => onPartPress?.(part)}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.dark ? '#1a2233' : '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.primaryFont,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  toggleIcon: {
    fontSize: 24,
    color: theme.colors.onSurfaceVariant,
  },
  timeline: {
    marginLeft: 8,
  },
  line: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: `${LITURGICAL_COLORS.green}50`,
  },
  partRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  nodeColumn: {
    width: 40,
    alignItems: 'center',
    zIndex: 10,
  },
  lineConnector: {
    position: 'absolute',
    top: 40,
    bottom: -24,
    width: 2,
    backgroundColor: `${LITURGICAL_COLORS.green}50`,
    left: 19,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default TimelineSection;
