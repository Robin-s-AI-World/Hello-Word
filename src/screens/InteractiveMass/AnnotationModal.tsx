/**
 * AnnotationModal - Long-press options for creating annotations
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
import { Modal } from '../../components/ui/Modal';

type AnnotationType = 'audio' | 'text' | 'drawing' | 'picture' | 'url';

interface AnnotationOption {
  type: AnnotationType;
  label: string;
  icon: string;
}

const ANNOTATION_OPTIONS: AnnotationOption[] = [
  { type: 'audio', label: 'Audio Note', icon: '🎤' },
  { type: 'text', label: 'Text Note', icon: '📝' },
  { type: 'drawing', label: 'Drawing', icon: '✏️' },
  { type: 'picture', label: 'Picture', icon: '📷' },
  { type: 'url', label: 'URL Link', icon: '🔗' },
];

interface AnnotationModalProps {
  visible: boolean;
  word: string;
  onClose: () => void;
  onSelect: (type: AnnotationType, word: string) => void;
}

export const AnnotationModal: React.FC<AnnotationModalProps> = ({
  visible,
  word,
  onClose,
  onSelect,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSelect = (type: AnnotationType) => {
    onSelect(type, word);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Add Annotation"
    >
      <Text style={styles.wordLabel}>
        Add annotation for: <Text style={styles.word}>{word}</Text>
      </Text>

      <View style={styles.options}>
        {ANNOTATION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={styles.option}
            onPress={() => handleSelect(option.type)}
          >
            <Text style={styles.optionIcon}>{option.icon}</Text>
            <Text style={styles.optionLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.hint}>
        Long-press any word to add personal annotations for study and reflection.
      </Text>
    </Modal>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  wordLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 20,
    fontFamily: theme.typography.secondaryFont,
  },
  word: {
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontStyle: 'italic',
  },
  options: {
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceVariant,
    gap: 12,
  },
  optionIcon: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  hint: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: theme.typography.secondaryFont,
  },
});

export default AnnotationModal;
