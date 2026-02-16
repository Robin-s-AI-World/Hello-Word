/**
 * Tooltip Component - Popover tooltips for word definitions
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';

interface TooltipProps {
  visible: boolean;
  word: string;
  grammar?: string;
  definition: string;
  categories?: string[];
  onClose: () => void;
  onPlayAudio?: () => void;
  targetY?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Tooltip: React.FC<TooltipProps> = ({
  visible,
  word,
  grammar,
  definition,
  categories = [],
  onClose,
  onPlayAudio,
  targetY = 200,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const positionStyle = {
    top: targetY > SCREEN_HEIGHT / 2 ? targetY - 180 : targetY + 20,
    left: 16,
    right: 16,
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.tooltip, positionStyle]}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Text style={styles.word}>{word}</Text>
                  {grammar && (
                    <Text style={styles.grammar}>{grammar}</Text>
                  )}
                </View>
                {onPlayAudio && (
                  <TouchableOpacity
                    style={styles.audioButton}
                    onPress={onPlayAudio}
                  >
                    <Text style={styles.audioIcon}>🔊</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Definition */}
              <Text style={styles.definition}>{definition}</Text>

              {/* Categories */}
              {categories.length > 0 && (
                <View style={styles.categories}>
                  {categories.map((cat, index) => (
                    <TouchableOpacity key={index}>
                      <Text style={styles.category}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Arrow pointer */}
              <View
                style={[
                  styles.arrow,
                  targetY > SCREEN_HEIGHT / 2
                    ? styles.arrowBottom
                    : styles.arrowTop,
                ]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: theme.dark ? '#1e2532' : '#1f2937',
    borderRadius: 12,
    padding: 12,
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: theme.typography.primaryFont,
  },
  grammar: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: theme.typography.secondaryFont,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  audioButton: {
    padding: 4,
  },
  audioIcon: {
    fontSize: 18,
  },
  definition: {
    fontSize: 14,
    color: '#d1d5db',
    fontFamily: theme.typography.secondaryFont,
    lineHeight: 20,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  category: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrow: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: theme.dark ? '#1e2532' : '#1f2937',
    transform: [{ rotate: '45deg' }],
  },
  arrowTop: {
    top: -6,
    left: 32,
  },
  arrowBottom: {
    bottom: -6,
    left: 32,
  },
});

export default Tooltip;
