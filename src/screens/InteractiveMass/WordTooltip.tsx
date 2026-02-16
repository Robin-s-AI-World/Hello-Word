/**
 * WordTooltip - Tap definition popup for Latin words
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';

interface WordTooltipProps {
  visible: boolean;
  word: string;
  definition: string;
  grammar?: string;
  categories?: string[];
  position?: { x: number; y: number };
  onClose: () => void;
  onPlayAudio?: () => void;
  onCategoryPress?: (category: string) => void;
}

export const WordTooltip: React.FC<WordTooltipProps> = ({
  visible,
  word,
  definition,
  grammar,
  categories = [],
  position = { x: 32, y: 200 },
  onClose,
  onPlayAudio,
  onCategoryPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
            <View
              style={[
                styles.tooltip,
                { top: position.y - 100 },
              ]}
            >
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
              <Text style={styles.definition}>
                <Text style={styles.definitionItalic}>{definition.split('.')[0]}.</Text>
                {definition.includes('.') && definition.slice(definition.indexOf('.') + 1)}
              </Text>

              {/* Categories */}
              {categories.length > 0 && (
                <View style={styles.categories}>
                  {categories.map((cat, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => onCategoryPress?.(cat)}
                    >
                      <Text style={styles.category}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Arrow */}
              <View style={styles.arrow} />
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
    left: 16,
    right: 16,
    backgroundColor: theme.dark ? '#1e2532' : '#1f2937',
    borderRadius: 12,
    padding: 12,
    maxWidth: 280,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
  definitionItalic: {
    fontStyle: 'italic',
    color: '#ffffff',
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
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  arrow: {
    position: 'absolute',
    bottom: -6,
    left: 32,
    width: 12,
    height: 12,
    backgroundColor: theme.dark ? '#1e2532' : '#1f2937',
    transform: [{ rotate: '45deg' }],
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default WordTooltip;
