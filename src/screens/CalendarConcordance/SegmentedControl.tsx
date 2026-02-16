/**
 * SegmentedControl - Tab selector component
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

interface Segment {
  id: string;
  label: string;
}

interface SegmentedControlProps {
  segments: Segment[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  segments,
  selectedId,
  onSelect,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {segments.map((segment) => {
        const isSelected = segment.id === selectedId;
        return (
          <TouchableOpacity
            key={segment.id}
            style={[styles.segment, isSelected && styles.segmentSelected]}
            onPress={() => onSelect(segment.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.segmentText,
                isSelected && styles.segmentTextSelected,
              ]}
            >
              {segment.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  segmentSelected: {
    backgroundColor: theme.dark ? '#374151' : '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.primaryFont,
  },
  segmentTextSelected: {
    color: theme.colors.onSurface,
    fontWeight: '600',
  },
});

export default SegmentedControl;
