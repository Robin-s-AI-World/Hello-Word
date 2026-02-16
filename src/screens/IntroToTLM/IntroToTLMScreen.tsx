/**
 * IntroToTLMScreen - Educational introduction to Traditional Latin Mass
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { DropCap, RubricText, Badge } from '../../components/ui';
import { MassFormCard } from './MassFormCard';
import { QuoteCallout } from './QuoteCallout';
import { ConsiderationsSection } from './ConsiderationsSection';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface IntroToTLMScreenProps {
  onNavigateBack?: () => void;
  onNavigateToServerGuide?: () => void;
}

export const IntroToTLMScreen: React.FC<IntroToTLMScreenProps> = ({
  onNavigateBack,
  onNavigateToServerGuide,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onNavigateBack}
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Introduction</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={[styles.headerIcon, styles.headerIconMuted]}>Aa</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>The Traditional Latin Mass</Text>
        <RubricText centered>Introibo ad altare Dei</RubricText>

        {/* Main paragraph with drop cap */}
        <View style={styles.paragraph}>
          <DropCap
            text="he Traditional Latin Mass, also known as the Tridentine Mass, is the liturgy of the Roman Rite as it was celebrated for centuries prior to the reforms following the Second Vatican Council. Codified by Pope St. Pius V in 1570, it represents a living connection to the early Church and the medieval saints. It is characterized by its use of Latin, the Gregorian Chant, and a profound sense of reverence and silence."
            dropCapColor={LITURGICAL_COLORS.gold}
          />
        </View>

        {/* Quote callout */}
        <QuoteCallout
          quote="What earlier generations held as sacred, remains sacred and great for us too, and it cannot be all of a sudden entirely forbidden or even considered harmful."
          author="Pope Benedict XVI"
          source="Summorum Pontificum"
          title="The 2008 Motu Proprio"
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Forms of the Mass */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forms of the Mass</Text>
          <RubricText centered>Distinctions in celebration</RubricText>

          <View style={styles.cardsContainer}>
            <MassFormCard
              title="Missa Lecta"
              subtitle="Low Mass"
              icon="🕯"
              features={[
                'Spoken, not sung',
                'One priest, one or two servers',
                'Usually two altar candles',
              ]}
              variant="default"
            />
            <MassFormCard
              title="Missa Cantata"
              subtitle="Sung Mass"
              icon="🎵"
              features={[
                'Parts of the Mass are sung',
                'Incense may be used',
                'Six altar candles',
              ]}
              variant="highlighted"
            />
            <MassFormCard
              title="Missa Solemnis"
              subtitle="Solemn High Mass"
              icon="👥"
              features={[
                'Assisted by Deacon & Subdeacon',
                'Full ceremonial & incense',
                'The normative form of the rite',
              ]}
              variant="default"
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Considerations Section */}
        <ConsiderationsSection />

        {/* Server Guide CTA */}
        <View style={styles.ctaCard}>
          <View style={styles.ctaContent}>
            <View style={styles.ctaHeader}>
              <Text style={styles.ctaIcon}>👤</Text>
              <Text style={styles.ctaLabel}>Ministrare</Text>
            </View>
            <Text style={styles.ctaTitle}>Serving at the Altar</Text>
            <Text style={styles.ctaDescription}>
              To serve at the altar is a privilege next to the priesthood itself.
              Learn the responses, the movements, and the rubrics required for the acolyte.
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={onNavigateToServerGuide}
            >
              <Text style={styles.ctaButtonText}>View Server Guide</Text>
              <Text style={styles.ctaButtonIcon}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation placeholder */}
      <View style={styles.bottomNav}>
        <BottomNavItem icon="⛪" label="Mass" />
        <BottomNavItem icon="📖" label="Readings" />
        <BottomNavItem icon="🎓" label="Learn" active />
        <BottomNavItem icon="🎵" label="Chant" />
        <BottomNavItem icon="•••" label="More" />
      </View>
    </View>
  );
};

// Bottom Nav Item component
const BottomNavItem: React.FC<{
  icon: string;
  label: string;
  active?: boolean;
}> = ({ icon, label, active }) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity style={bottomNavStyles.item}>
      <Text
        style={[
          bottomNavStyles.icon,
          active && bottomNavStyles.iconActive,
        ]}
      >
        {icon}
      </Text>
      <Text
        style={[
          bottomNavStyles.label,
          { color: active ? theme.colors.primary : theme.colors.onSurfaceVariant },
          active && bottomNavStyles.labelActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const bottomNavStyles = StyleSheet.create({
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  icon: {
    fontSize: 22,
    marginBottom: 2,
  },
  iconActive: {
    // Active state styling
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
  labelActive: {
    fontWeight: '700',
  },
});

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark ? '#101622' : '#f6f6f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
  },
  headerButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },
  headerIcon: {
    fontSize: 24,
    color: theme.colors.onSurface,
  },
  headerIconMuted: {
    color: '#92a4c9',
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: theme.typography.primaryFont,
  },
  paragraph: {
    marginTop: 24,
    marginBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: theme.typography.primaryFont,
  },
  cardsContainer: {
    marginTop: 24,
    gap: 16,
  },
  divider: {
    height: 1,
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
    marginVertical: 32,
    marginHorizontal: '25%',
  },
  ctaCard: {
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: theme.dark ? '#1a2233' : theme.colors.surface,
  },
  ctaContent: {
    padding: 24,
  },
  ctaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  ctaIcon: {
    fontSize: 20,
    color: LITURGICAL_COLORS.red,
  },
  ctaLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: LITURGICAL_COLORS.red,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: theme.typography.primaryFont,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
    fontFamily: theme.typography.primaryFont,
  },
  ctaDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: theme.typography.secondaryFont,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  ctaButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
    fontFamily: theme.typography.primaryFont,
  },
  ctaButtonIcon: {
    fontSize: 14,
    color: '#000000',
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.dark ? '#151b28' : '#ffffff',
    borderTopWidth: 1,
    borderTopColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
});

export default IntroToTLMScreen;
