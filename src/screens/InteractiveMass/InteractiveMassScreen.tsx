/**
 * InteractiveMassScreen - Bilingual viewer with word hints and annotations
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
import { ProgressIndicator } from './ProgressIndicator';
import { BilingualTextRow } from './BilingualTextRow';
import { WordTooltip } from './WordTooltip';
import { AnnotationModal } from './AnnotationModal';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

// Sample Mass text data
const SAMPLE_TEXTS = [
  {
    section: 'asperges',
    latin: 'In nómine Patris, et Fílii, et Spíritus Sancti. Amen.',
    english: 'In the name of the Father, and of the Son, and of the Holy Ghost. Amen.',
    isRubric: false,
  },
  {
    section: 'introibo',
    latin: 'Introíbo ad altáre Dei.',
    english: 'I will go in to the altar of God.',
    isRubric: false,
  },
  {
    section: 'rubric1',
    latin: '[The Priest stands at the foot of the altar.]',
    english: '',
    isRubric: true,
  },
  {
    section: 'psalm42',
    latin: 'Introíbo ad altáre Dei. Ad Deum qui lætíficat juventútem meam.',
    english: 'I will go in to the altar of God. To God, the joy of my youth.',
    isRubric: false,
    showDropCap: true,
  },
  {
    section: 'judica',
    latin: 'Júdica me, Deus, et discérne causam meam de gente non sancta: ab hómine iníquo, et dolóso érue me.',
    english: 'Judge me, O God, and distinguish my cause from the nation that is not holy: deliver me from the unjust and deceitful man.',
    isRubric: false,
  },
  {
    section: 'rubric2',
    latin: '[The Priest bows slightly.]',
    english: '',
    isRubric: true,
  },
  {
    section: 'quia',
    latin: 'Quia tu es, Deus, fortitúdo mea: quare me repulísti? et quare tristis incédo, dum afflígit me inimícus?',
    english: 'For Thou art God my strength: why hast Thou cast me off? and why do I go sorrowful whilst the enemy afflicteth me?',
    isRubric: false,
  },
];

const PROGRESS_STEPS = [
  { id: 'asperges', label: 'Asperges' },
  { id: 'introit', label: 'Introit' },
  { id: 'kyrie', label: 'Kyrie' },
  { id: 'gloria', label: 'Gloria' },
  { id: 'collect', label: 'Collect' },
  { id: 'epistle', label: 'Epistle' },
  { id: 'gospel', label: 'Gospel' },
  { id: 'credo', label: 'Credo' },
];

// Sample word hints
const WORD_HINTS = [
  { word: 'Dei', definition: 'of God. Referring to the Supreme Being, creator and ruler of the universe.', grammar: 'Noun • Genitive Singular' },
  { word: 'altáre', definition: 'altar. The sacred table where the Holy Sacrifice of the Mass is offered.', grammar: 'Noun • Accusative' },
  { word: 'Patris', definition: 'of the Father. First Person of the Blessed Trinity.', grammar: 'Noun • Genitive Singular' },
];

interface InteractiveMassScreenProps {
  date?: string;
  onNavigateBack?: () => void;
  onOpenSettings?: () => void;
}

export const InteractiveMassScreen: React.FC<InteractiveMassScreenProps> = ({
  date = new Date().toISOString().split('T')[0],
  onNavigateBack,
  onOpenSettings,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 32, y: 200 });
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);

  const getCurrentHint = () => {
    if (!selectedWord) return null;
    return WORD_HINTS.find(h => h.word.toLowerCase() === selectedWord.toLowerCase());
  };

  const handleWordTap = (word: string, position: { x: number; y: number }) => {
    setSelectedWord(word);
    setTooltipPosition(position);
  };

  const handleWordLongPress = (word: string) => {
    setSelectedWord(word);
    setShowAnnotationModal(true);
  };

  const handleAnnotationSelect = (type: string, word: string) => {
    console.log(`Creating ${type} annotation for "${word}"`);
    // Implement annotation creation logic
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
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Sunday Mass</Text>
          <Text style={styles.headerTitle}>Ordinary of the Mass</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onOpenSettings}
        >
          <Text style={styles.headerIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Indicator */}
      <ProgressIndicator
        steps={PROGRESS_STEPS}
        currentStep={currentStep}
        onStepPress={setCurrentStep}
      />

      {/* Side Scroll Indicator */}
      <View style={styles.sideIndicator}>
        <View style={styles.sideLine} />
        {PROGRESS_STEPS.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            onPress={() => setCurrentStep(index)}
          >
            <View
              style={[
                styles.sideDot,
                index === currentStep && styles.sideDotActive,
                index < currentStep && styles.sideDotCompleted,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_TEXTS.map((text, index) => (
          <View
            key={text.section}
            style={[
              styles.section,
              index > 0 && styles.sectionBorder,
            ]}
          >
            <BilingualTextRow
              latin={text.latin}
              english={text.english}
              isRubric={text.isRubric}
              showDropCap={text.showDropCap}
              highlightedWord={selectedWord || undefined}
              wordHints={WORD_HINTS}
              onWordTap={handleWordTap}
              onWordLongPress={handleWordLongPress}
            />
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavItem icon="🏠" label="Home" />
        <BottomNavItem icon="📖" label="Missal" active />
        <BottomNavItem icon="📅" label="Calendar" />
        <BottomNavItem icon="❤" label="Prayers" />
        <BottomNavItem icon="👤" label="Profile" />
      </View>

      {/* Word Tooltip */}
      {selectedWord && getCurrentHint() && (
        <WordTooltip
          visible={!showAnnotationModal}
          word={getCurrentHint()!.word}
          definition={getCurrentHint()!.definition}
          grammar={getCurrentHint()!.grammar}
          categories={['Theology', 'Conjugation']}
          position={tooltipPosition}
          onClose={() => setSelectedWord(null)}
          onPlayAudio={() => console.log('Playing audio...')}
          onCategoryPress={(cat) => console.log(`Category: ${cat}`)}
        />
      )}

      {/* Annotation Modal */}
      <AnnotationModal
        visible={showAnnotationModal}
        word={selectedWord || ''}
        onClose={() => {
          setShowAnnotationModal(false);
          setSelectedWord(null);
        }}
        onSelect={handleAnnotationSelect}
      />
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
      <Text style={bottomNavStyles.icon}>{icon}</Text>
      <Text
        style={[
          bottomNavStyles.label,
          {
            color: active
              ? (theme.dark ? '#ffffff' : theme.colors.primary)
              : theme.colors.onSurfaceVariant,
            fontWeight: active ? '700' : '500',
          },
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
    fontSize: 26,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
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
    backgroundColor: theme.dark ? 'rgba(16, 22, 34, 0.95)' : 'rgba(246, 246, 248, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerIcon: {
    fontSize: 24,
    color: theme.colors.onSurface,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: theme.typography.primaryFont,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  sideIndicator: {
    position: 'absolute',
    right: 4,
    top: '50%',
    transform: [{ translateY: -120 }],
    height: '60%',
    width: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 40,
  },
  sideLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderRadius: 1,
  },
  sideDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.onSurfaceVariant,
    zIndex: 10,
  },
  sideDotActive: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22d3ee',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  sideDotCompleted: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  section: {
    padding: 24,
  },
  sectionBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.dark ? 'rgba(255,255,255,0.05)' : theme.colors.border,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#ffffff',
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.dark ? 'rgba(12, 17, 26, 0.95)' : 'rgba(246, 246, 248, 0.95)',
    borderTopWidth: 1,
    borderTopColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
});

export default InteractiveMassScreen;
