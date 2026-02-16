/**
 * MassTimelineScreen - Visual navigation through Mass parts
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState } from 'react';
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
import { TimelineSection } from './TimelineSection';
import { Badge } from '../../components/ui';
import { MassPart, LITURGICAL_COLORS } from '../../core/types/liturgical';

// Sample Mass parts data
const MASS_PARTS_CATECHUMENS: MassPart[] = [
  {
    id: 'prayers-foot',
    key: 'Introibo',
    name: 'Prayers at the Foot of the Altar',
    section: 'catechumens',
    sequence: 1,
    type: 'ordinary',
    nodeType: 'icon',
    icon: '⛪',
  },
  {
    id: 'introit',
    key: 'Introitus',
    name: 'Introit',
    latinName: 'Introitus',
    section: 'catechumens',
    sequence: 2,
    type: 'proper',
    nodeType: 'dot',
  },
  {
    id: 'kyrie',
    key: 'Kyrie',
    name: 'Kyrie',
    section: 'catechumens',
    sequence: 3,
    type: 'ordinary',
    nodeType: 'dot',
  },
  {
    id: 'gloria',
    key: 'Gloria',
    name: 'Gloria',
    section: 'catechumens',
    sequence: 4,
    type: 'ordinary',
    nodeType: 'dot',
  },
  {
    id: 'collect',
    key: 'Oratio',
    name: 'Collect',
    latinName: 'Collecta',
    section: 'catechumens',
    sequence: 5,
    type: 'proper',
    nodeType: 'dot',
  },
  {
    id: 'epistle',
    key: 'Lectio',
    name: 'Epistle',
    latinName: 'Lectio Epistolae',
    section: 'catechumens',
    sequence: 6,
    type: 'proper',
    nodeType: 'icon',
    icon: '📖',
  },
  {
    id: 'gospel',
    key: 'Evangelium',
    name: 'Gospel',
    latinName: 'Initium Sancti Evangelii',
    section: 'catechumens',
    sequence: 7,
    type: 'proper',
    nodeType: 'icon',
    icon: '✝',
  },
  {
    id: 'credo',
    key: 'Credo',
    name: 'Credo',
    section: 'catechumens',
    sequence: 8,
    type: 'ordinary',
    nodeType: 'dot',
  },
];

const MASS_PARTS_FAITHFUL: MassPart[] = [
  {
    id: 'offertory',
    key: 'Offertorium',
    name: 'Offertory',
    section: 'faithful',
    sequence: 1,
    type: 'proper',
    nodeType: 'dot',
  },
  {
    id: 'secret',
    key: 'Secreta',
    name: 'Secret',
    section: 'faithful',
    sequence: 2,
    type: 'proper',
    nodeType: 'dot',
  },
  {
    id: 'preface',
    key: 'Praefatio',
    name: 'Preface',
    section: 'faithful',
    sequence: 3,
    type: 'proper',
    nodeType: 'dot',
  },
  {
    id: 'sanctus',
    key: 'Sanctus',
    name: 'Sanctus',
    section: 'faithful',
    sequence: 4,
    type: 'ordinary',
    nodeType: 'icon',
    icon: '🔔',
  },
  {
    id: 'canon',
    key: 'Canon',
    name: 'The Canon',
    latinName: 'Canon Missae',
    section: 'faithful',
    sequence: 5,
    type: 'solemn',
    nodeType: 'gold',
    icon: '★',
  },
  {
    id: 'pater',
    key: 'Pater',
    name: 'Pater Noster',
    section: 'faithful',
    sequence: 6,
    type: 'ordinary',
    nodeType: 'dot',
  },
  {
    id: 'agnus',
    key: 'Agnus',
    name: 'Agnus Dei',
    section: 'faithful',
    sequence: 7,
    type: 'ordinary',
    nodeType: 'dot',
  },
];

const MASS_PARTS_COMMUNION: MassPart[] = [
  {
    id: 'communion',
    key: 'Communio',
    name: 'Communion',
    section: 'communion',
    sequence: 1,
    type: 'proper',
    nodeType: 'icon',
    icon: '🍷',
  },
  {
    id: 'postcommunion',
    key: 'Postcommunio',
    name: 'Postcommunion',
    section: 'communion',
    sequence: 2,
    type: 'proper',
    nodeType: 'dot',
  },
  {
    id: 'last-gospel',
    key: 'LastGospel',
    name: 'Last Gospel',
    section: 'communion',
    sequence: 3,
    type: 'ordinary',
    nodeType: 'dot',
  },
];

interface MassTimelineScreenProps {
  date?: string;
  celebration?: string;
  color?: string;
  rank?: string;
  onNavigateBack?: () => void;
  onStartMass?: () => void;
  onPartSelect?: (part: MassPart) => void;
}

export const MassTimelineScreen: React.FC<MassTimelineScreenProps> = ({
  date = new Date().toISOString().split('T')[0],
  celebration = 'Third Sunday after Pentecost',
  color = 'green',
  rank = 'Class II',
  onNavigateBack,
  onStartMass,
  onPartSelect,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [expandedSections, setExpandedSections] = useState({
    catechumens: true,
    faithful: true,
    communion: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

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
        <Text style={styles.headerTitle}>Ordo Missae</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={[styles.headerIcon, styles.headerIconMuted]}>⚙</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Liturgical Header */}
        <View style={styles.liturgicalHeader}>
          <View style={styles.liturgicalBadge}>
            <Text style={styles.liturgicalBadgeIcon}>●</Text>
            <Badge
              label={`${rank} • ${color.charAt(0).toUpperCase() + color.slice(1)}`}
              variant="liturgical"
              liturgicalColor={color as any}
            />
          </View>
          <Text style={styles.celebration}>{celebration}</Text>
          <Text style={styles.latinCelebration}>Dominica III Post Pentecosten</Text>
        </View>

        {/* Start Mass Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={onStartMass}
          >
            <Text style={styles.startButtonIcon}>▶</Text>
            <Text style={styles.startButtonText}>Start Mass</Text>
          </TouchableOpacity>
        </View>

        {/* Timeline Sections */}
        <View style={styles.timeline}>
          <TimelineSection
            number="I"
            title="Mass of the Catechumens"
            parts={MASS_PARTS_CATECHUMENS}
            isExpanded={expandedSections.catechumens}
            onToggle={() => toggleSection('catechumens')}
            onPartPress={onPartSelect}
          />

          <TimelineSection
            number="II"
            title="Mass of the Faithful"
            parts={MASS_PARTS_FAITHFUL}
            isExpanded={expandedSections.faithful}
            onToggle={() => toggleSection('faithful')}
            onPartPress={onPartSelect}
          />

          <TimelineSection
            number="III"
            title="Communion"
            parts={MASS_PARTS_COMMUNION}
            isExpanded={expandedSections.communion}
            onToggle={() => toggleSection('communion')}
            onPartPress={onPartSelect}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>🔖</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  liturgicalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  liturgicalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  liturgicalBadgeIcon: {
    fontSize: 14,
    color: LITURGICAL_COLORS.green,
  },
  celebration: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.onSurface,
    textAlign: 'center',
    fontFamily: theme.typography.primaryFont,
  },
  latinCelebration: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
    fontFamily: theme.typography.secondaryFont,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: theme.typography.primaryFont,
  },
  timeline: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.dark ? '#ffffff' : '#1a2233',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: theme.dark ? '#000000' : '#ffffff',
  },
});

export default MassTimelineScreen;
