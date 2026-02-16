/**
 * BilingualTextRow - Latin/English parallel text columns
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  LongPressGestureHandler,
  State,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface WordHint {
  word: string;
  definition: string;
  grammar?: string;
}

interface BilingualTextRowProps {
  latin: string;
  english: string;
  isRubric?: boolean;
  showDropCap?: boolean;
  highlightedWord?: string;
  wordHints?: WordHint[];
  onWordTap?: (word: string, position: { x: number; y: number }) => void;
  onWordLongPress?: (word: string) => void;
}

export const BilingualTextRow: React.FC<BilingualTextRowProps> = ({
  latin,
  english,
  isRubric = false,
  showDropCap = false,
  highlightedWord,
  wordHints = [],
  onWordTap,
  onWordLongPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, isRubric, showDropCap);

  const handleWordPress = (word: string, event: GestureResponderEvent) => {
    const cleanWord = word.replace(/[.,;:!?]/g, '');
    if (wordHints.some(h => h.word.toLowerCase() === cleanWord.toLowerCase())) {
      onWordTap?.(cleanWord, {
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      });
    }
  };

  const renderTextWithHints = (text: string, isLatin: boolean) => {
    const words = text.split(' ');
    const hasHint = (word: string) =>
      wordHints.some(h => h.word.toLowerCase() === word.replace(/[.,;:!?]/g, '').toLowerCase());

    return (
      <Text style={isLatin ? styles.latinText : styles.englishText}>
        {words.map((word, index) => {
          const cleanWord = word.replace(/[.,;:!?]/g, '');
          const isHighlighted = highlightedWord?.toLowerCase() === cleanWord.toLowerCase();
          const canShowHint = isLatin && hasHint(word);

          if (showDropCap && index === 0 && isLatin) {
            return (
              <Text key={index}>
                <Text style={styles.dropCap}>{word.charAt(0)}</Text>
                <Text
                  style={[
                    styles.latinText,
                    canShowHint && styles.hintWord,
                    isHighlighted && styles.highlightedWord,
                  ]}
                  onPress={(e) => canShowHint && handleWordPress(word, e)}
                >
                  {word.slice(1)}{' '}
                </Text>
              </Text>
            );
          }

          return (
            <Text
              key={index}
              style={[
                isLatin ? styles.latinText : styles.englishText,
                canShowHint && styles.hintWord,
                isHighlighted && styles.highlightedWord,
              ]}
              onPress={(e) => canShowHint && handleWordPress(word, e)}
            >
              {word}{' '}
            </Text>
          );
        })}
      </Text>
    );
  };

  if (isRubric) {
    return (
      <View style={styles.rubricContainer}>
        <Text style={styles.rubricText}>{latin || english}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        {renderTextWithHints(latin, true)}
      </View>
      <View style={styles.column}>
        {renderTextWithHints(english, false)}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme, isRubric: boolean, showDropCap: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 24,
  },
  column: {
    flex: 1,
  },
  latinText: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.secondaryFont,
  },
  englishText: {
    fontSize: 16,
    lineHeight: 26,
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
    fontWeight: '300',
    fontFamily: theme.typography.secondaryFont,
  },
  dropCap: {
    fontSize: 42,
    fontWeight: '400',
    color: theme.colors.primary,
    lineHeight: 42,
  },
  hintWord: {
    backgroundColor: `${theme.colors.primary}30`,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  highlightedWord: {
    backgroundColor: `${theme.colors.primary}40`,
    color: '#ffffff',
    borderRadius: 2,
  },
  rubricContainer: {
    paddingVertical: 8,
  },
  rubricText: {
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '500',
    color: LITURGICAL_COLORS.red,
    textAlign: 'center',
    fontFamily: theme.typography.secondaryFont,
  },
});

export default BilingualTextRow;
