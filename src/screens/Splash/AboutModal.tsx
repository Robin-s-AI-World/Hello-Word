/**
 * AboutModal Component - App info, credits, and legal
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { Modal } from '../../components/ui/Modal';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';
import { getFullVersion, getProductName } from '../../core/utils/version';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({
  visible,
  onClose,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const openPrivacyPolicy = () => {
    // Link to privacy policy
    Linking.openURL('https://example.com/privacy').catch(() => {});
  };

  const openLicenses = () => {
    // Link to open source licenses
    Linking.openURL('https://example.com/licenses').catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      maxWidth={380}
      footer={
        <Text style={styles.footerText}>Soli Deo Gloria</Text>
      }
    >
      {/* App Info Header */}
      <View style={styles.header}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>M</Text>
        </View>
        <Text style={styles.appName}>Missale Romanum</Text>
        <Text style={styles.version}>Version {getFullVersion()}</Text>
      </View>

      {/* Sections */}
      <View style={styles.sections}>
        {/* Development */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Development</Text>
          <Text style={styles.sectionText}>
            Created by the Guild of St. Genesius. Dedicated to preserving
            the liturgical heritage of the Church through technology.
          </Text>
        </View>

        {/* Texts & Translation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Texts & Translation</Text>
          <Text style={styles.sectionText}>
            Latin texts from the 1962 Missale Romanum. English translations
            adapted from the Douay-Rheims Bible and the Lasance Missal.
          </Text>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <Text style={styles.legalText}>
            © 2025 Robin L. M. Cheung, MBA. All rights reserved.{'\n'}
            Imprimatur for original texts remains with their respective
            ecclesiastical authorities.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={openPrivacyPolicy}>
          <Text style={styles.actionIcon}>🔒</Text>
          <Text style={styles.actionText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={openLicenses}>
          <Text style={styles.actionIcon}>📜</Text>
          <Text style={styles.actionText}>Open Source Licenses</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.dark ? 'rgba(255,255,255,0.05)' : theme.colors.border,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.dark ? '#1a1e26' : theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: `${LITURGICAL_COLORS.gold}30`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: LITURGICAL_COLORS.gold,
    fontFamily: 'Cinzel, serif',
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  version: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
    fontFamily: theme.typography.secondaryFont,
  },
  sections: {
    marginTop: 20,
    gap: 16,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: theme.typography.primaryFont,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.onSurface,
    lineHeight: 22,
    fontFamily: theme.typography.secondaryFont,
  },
  legalText: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
    fontFamily: theme.typography.secondaryFont,
  },
  actions: {
    marginTop: 20,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.dark ? 'rgba(0,0,0,0.3)' : theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
    gap: 8,
  },
  actionIcon: {
    fontSize: 14,
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.primaryFont,
  },
  footerText: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    fontFamily: theme.typography.secondaryFont,
  },
});

export default AboutModal;
