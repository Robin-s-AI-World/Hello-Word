/**
 * ConcordanceScreen - 1962 vs Modern liturgical calendar comparison
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState, useMemo } from 'react';
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
import { SegmentedControl } from './SegmentedControl';
import { ConcordanceDayCard } from './ConcordanceDayCard';
import { EasterInfoModal } from './EasterInfoModal';
import { ConcordanceDay } from '../../core/types/liturgical';

// Sample data for demonstration
const SAMPLE_CONCORDANCE_DATA: ConcordanceDay[] = [
  {
    date: '2024-06-16',
    displayDate: 'Jun 16',
    dayOfWeek: 'Sun',
    calendar1962: {
      celebration: '4th Sunday after Pentecost',
      rank: 'II Class',
      color: 'green',
    },
    modernCalendar: {
      celebration: '11th Sunday in Ordinary Time',
      rank: 'Sunday',
      color: 'green',
    },
  },
  {
    date: '2024-06-17',
    displayDate: 'Jun 17',
    dayOfWeek: 'Mon',
    calendar1962: {
      celebration: 'St. Gregory Barbarigo',
      rank: 'III Class',
      color: 'white',
    },
    modernCalendar: {
      celebration: 'Monday of the 11th Week in Ordinary Time',
      rank: 'Weekday',
      color: 'green',
    },
  },
  {
    date: '2024-06-18',
    displayDate: 'Jun 18',
    dayOfWeek: 'Tue',
    calendar1962: {
      celebration: 'St. Ephrem the Syrian',
      rank: 'III Class',
      color: 'white',
    },
    modernCalendar: {
      celebration: 'Tuesday of the 11th Week in Ordinary Time',
      rank: 'Weekday',
      color: 'green',
    },
  },
  {
    date: '2024-06-19',
    displayDate: 'Jun 19',
    dayOfWeek: 'Wed',
    calendar1962: {
      celebration: 'St. Juliana Falconieri',
      rank: 'III Class',
      color: 'white',
    },
    modernCalendar: {
      celebration: 'St. Romuald',
      rank: 'Optional Memorial',
      color: 'white',
    },
  },
  {
    date: '2024-06-20',
    displayDate: 'Jun 20',
    dayOfWeek: 'Thu',
    calendar1962: {
      celebration: 'Feria of the IV Class',
      rank: 'IV Class',
      color: 'green',
    },
    modernCalendar: {
      celebration: 'Thursday of the 11th Week in Ordinary Time',
      rank: 'Weekday',
      color: 'green',
    },
  },
  {
    date: '2024-06-21',
    displayDate: 'Jun 21',
    dayOfWeek: 'Fri',
    calendar1962: {
      celebration: 'St. Aloysius Gonzaga',
      rank: 'III Class',
      color: 'white',
    },
    modernCalendar: {
      celebration: 'St. Aloysius Gonzaga',
      rank: 'Memorial',
      color: 'white',
    },
  },
  {
    date: '2024-06-22',
    displayDate: 'Jun 22',
    dayOfWeek: 'Sat',
    calendar1962: {
      celebration: 'St. Paulinus of Nola',
      rank: 'III Class',
      color: 'white',
    },
    modernCalendar: {
      celebration: 'Sts. John Fisher & Thomas More',
      rank: 'Optional Memorial',
      color: 'red',
    },
  },
];

type CalendarView = '1962' | 'concordance' | 'novusOrdo';

interface ConcordanceScreenProps {
  onNavigateBack?: () => void;
  onOpenCalendar?: () => void;
}

export const ConcordanceScreen: React.FC<ConcordanceScreenProps> = ({
  onNavigateBack,
  onOpenCalendar,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [selectedView, setSelectedView] = useState<CalendarView>('concordance');
  const [currentMonth, setCurrentMonth] = useState({ month: 5, year: 2024 }); // June 2024
  const [showEasterInfo, setShowEasterInfo] = useState(false);

  const segments = [
    { id: '1962', label: '1962' },
    { id: 'concordance', label: 'Concordance' },
    { id: 'novusOrdo', label: 'Novus Ordo' },
  ];

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      let newMonth = prev.month;
      let newYear = prev.year;

      if (direction === 'prev') {
        if (newMonth === 0) {
          newMonth = 11;
          newYear--;
        } else {
          newMonth--;
        }
      } else {
        if (newMonth === 11) {
          newMonth = 0;
          newYear++;
        } else {
          newMonth++;
        }
      }

      return { month: newMonth, year: newYear };
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={onNavigateBack}
        >
          <Text style={styles.headerBackIcon}>←</Text>
          <Text style={styles.headerBackText}>Missal</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar Concordance</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onOpenCalendar}
        >
          <Text style={styles.headerIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View style={styles.controlContainer}>
        <SegmentedControl
          segments={segments}
          selectedId={selectedView}
          onSelect={(id) => setSelectedView(id as CalendarView)}
        />
      </View>

      {/* Month Navigation */}
      <View style={styles.monthNav}>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => navigateMonth('prev')}
        >
          <Text style={styles.monthNavIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>
          {monthNames[currentMonth.month]} {currentMonth.year}
        </Text>
        <TouchableOpacity
          style={styles.monthButton}
          onPress={() => navigateMonth('next')}
        >
          <Text style={styles.monthNavIcon}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_CONCORDANCE_DATA.map((day, index) => (
          <ConcordanceDayCard
            key={day.date}
            day={day}
            showInfoButton={index === 0}
            onInfoPress={() => setShowEasterInfo(true)}
          />
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavItem icon="🏠" label="Home" />
        <BottomNavItem icon="📅" label="Calendar" active />
        <BottomNavItem icon="📖" label="Missal" />
        <BottomNavItem icon="⚙" label="Settings" />
      </View>

      {/* Easter Info Modal */}
      <EasterInfoModal
        visible={showEasterInfo}
        onClose={() => setShowEasterInfo(false)}
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
          { color: active ? theme.colors.primary : theme.colors.onSurfaceVariant },
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
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark ? '#000000' : '#f2f2f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.dark ? '#1c1c1e' : '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
  },
  headerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerBackIcon: {
    fontSize: 28,
    color: theme.colors.primary,
  },
  headerBackText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: theme.typography.primaryFont,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 24,
    color: theme.colors.primary,
  },
  controlContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.dark ? '#1c1c1e' : '#ffffff',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.dark ? '#000000' : '#f2f2f7',
  },
  monthButton: {
    padding: 4,
  },
  monthNavIcon: {
    fontSize: 24,
    color: theme.colors.onSurfaceVariant,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.dark ? '#1c1c1e' : '#ffffff',
    borderTopWidth: 1,
    borderTopColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingTop: 8,
  },
});

export default ConcordanceScreen;
