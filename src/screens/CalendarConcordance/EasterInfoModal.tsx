/**
 * EasterInfoModal - Butcher's Algorithm explanation
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
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface EasterInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EasterInfoModal: React.FC<EasterInfoModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={
        <View style={styles.titleContainer}>
          <Text style={styles.titleIcon}>🎓</Text>
          <Text style={styles.title}>Did You Know?</Text>
        </View>
      }
      footer={
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Understood</Text>
        </TouchableOpacity>
      }
    >
      {/* The Algorithm section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>The Algorithm</Text>
        <Text style={styles.sectionTitle}>Calculating the Movable Feast</Text>
        <Text style={styles.sectionText}>
          Easter is the anchor for the entire liturgical year. But how is it
          determined? It follows the rule established at the Council of Nicaea
          (325 AD): the first Sunday after the first full moon occurring on or
          after the vernal equinox.
        </Text>
      </View>

      {/* Butcher's Algorithm box */}
      <View style={styles.algorithmBox}>
        <View style={styles.algorithmHeader}>
          <Text style={styles.algorithmIcon}>🧮</Text>
          <Text style={styles.algorithmTitle}>Butcher's Algorithm</Text>
        </View>
        <Text style={styles.algorithmText}>
          Published by{' '}
          <Text style={styles.algorithmTextBold}>Samuel Butcher</Text> in{' '}
          <Text style={styles.algorithmTextCode}>1877</Text> in the{' '}
          <Text style={styles.algorithmTextItalic}>Ecclesiastical Calendar</Text>.
          It is an ingenious "computus" that determines the date of Easter for
          any year in the Gregorian calendar without needing astronomical tables.
        </Text>
        <View style={styles.codeBlock}>
          <Text style={styles.code}>
            {`a = year % 19
b = year // 100
c = year % 100
...
// Returns Easter Month & Day`}
          </Text>
        </View>
      </View>

      {/* Accuracy section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Accuracy & Legacy</Text>
        <Text style={styles.sectionText}>
          This mathematical method elegantly reconciles the solar year
          (365.2425 days) with the lunar cycles (29.53 days). While
          astronomical full moons may vary slightly by timezone, Butcher's
          Algorithm provides the canonical Ecclesiastical Full Moon used by
          the Church worldwide.
        </Text>
      </View>

      {/* Fun fact card */}
      <View style={styles.factCard}>
        <View style={styles.factIconContainer}>
          <Text style={styles.factIcon}>☀</Text>
        </View>
        <View style={styles.factContent}>
          <Text style={styles.factLabel}>Sancta Nocte Fact</Text>
          <Text style={styles.factText}>
            There are 35 possible dates for Easter, ranging from March 22 to
            April 25.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleIcon: {
    fontSize: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: theme.typography.primaryFont,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: theme.typography.primaryFont,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginBottom: 8,
    fontFamily: theme.typography.primaryFont,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
    fontFamily: theme.typography.secondaryFont,
  },
  algorithmBox: {
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: theme.dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
  },
  algorithmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  algorithmIcon: {
    fontSize: 20,
    color: LITURGICAL_COLORS.violet,
  },
  algorithmTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  algorithmText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: theme.typography.secondaryFont,
  },
  algorithmTextBold: {
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  algorithmTextCode: {
    fontFamily: theme.typography.monoFont || 'monospace',
    color: theme.colors.primary,
  },
  algorithmTextItalic: {
    fontStyle: 'italic',
  },
  codeBlock: {
    backgroundColor: theme.dark ? 'rgba(0,0,0,0.3)' : '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
  },
  code: {
    fontFamily: theme.typography.monoFont || 'monospace',
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
  },
  factCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#1e1b4b',
    overflow: 'hidden',
  },
  factIconContainer: {
    marginRight: 12,
  },
  factIcon: {
    fontSize: 24,
    color: '#fbbf24',
  },
  factContent: {
    flex: 1,
  },
  factLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: theme.typography.primaryFont,
  },
  factText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    fontFamily: theme.typography.secondaryFont,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: theme.typography.primaryFont,
  },
});

export default EasterInfoModal;
