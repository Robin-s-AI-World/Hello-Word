/**
 * SanctissiMissaApp - Main app with full navigation for all 6 new screens
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { DataManager } from '../core/services/dataManager';
import { createStorageService } from '../platforms/storageFactory';

// Import all screens
import { SplashScreen } from '../screens/Splash';
import { IntroToTLMScreen } from '../screens/IntroToTLM';
import { ConcordanceScreen } from '../screens/CalendarConcordance';
import { MassTimelineScreen } from '../screens/MassTimeline';
import { InteractiveMassScreen } from '../screens/InteractiveMass';
import { FellowshipScreen } from '../screens/Fellowship';

// Original screens
import { CalendarDashboard } from './CalendarDashboard';
import { Journal } from './Journal';
import { SaintsInfo } from './SaintsInfo';
import { ParishDashboard } from './ParishDashboard';
import { CachedLiturgicalData } from '../core/types/liturgical';

type ScreenType =
  | 'splash'
  | 'missal'
  | 'calendar'
  | 'parish'
  | 'intro'
  | 'concordance'
  | 'timeline'
  | 'interactive'
  | 'fellowship'
  | 'journal'
  | 'saints';

interface SanctissiMissaAppProps {
  initialDate?: string;
  parishId?: string;
}

export const SanctissiMissaApp: React.FC<SanctissiMissaAppProps> = ({
  initialDate,
  parishId,
}) => {
  const [dataManager, setDataManager] = useState<DataManager | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [liturgicalData, setLiturgicalData] = useState<CachedLiturgicalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    if (dataManager) {
      loadLiturgicalData();
    }
  }, [selectedDate, dataManager]);

  const initializeApp = async () => {
    try {
      setLoading(true);
      setError(null);

      const storageService = await createStorageService();
      const dm = new DataManager(storageService);
      await dm.initialize();

      setDataManager(dm);
      console.log('SanctissiMissa app initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      setError(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const loadLiturgicalData = async () => {
    if (!dataManager) return;

    try {
      const data = await dataManager.getLiturgicalDataForDate(selectedDate);
      setLiturgicalData(data);
    } catch (error) {
      console.error('Failed to load liturgical data:', error);
    }
  };

  const handleSplashFinish = () => {
    setCurrentScreen('missal');
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return (
          <SplashScreen
            onFinish={handleSplashFinish}
            minDisplayTime={2000}
          />
        );

      case 'missal':
        return (
          <MassTimelineScreen
            date={selectedDate}
            celebration={liturgicalData?.liturgicalDay.celebration}
            color={liturgicalData?.liturgicalDay.color}
            rank={`Class ${liturgicalData?.liturgicalDay.rank || 2}`}
            onNavigateBack={() => setCurrentScreen('calendar')}
            onStartMass={() => setCurrentScreen('interactive')}
            onPartSelect={(part) => {
              console.log('Selected part:', part);
              setCurrentScreen('interactive');
            }}
          />
        );

      case 'interactive':
        return (
          <InteractiveMassScreen
            date={selectedDate}
            onNavigateBack={() => setCurrentScreen('missal')}
            onOpenSettings={() => console.log('Open settings')}
          />
        );

      case 'intro':
        return (
          <IntroToTLMScreen
            onNavigateBack={() => setCurrentScreen('missal')}
            onNavigateToServerGuide={() => console.log('Server guide')}
          />
        );

      case 'concordance':
        return (
          <ConcordanceScreen
            onNavigateBack={() => setCurrentScreen('calendar')}
            onOpenCalendar={() => setCurrentScreen('calendar')}
          />
        );

      case 'fellowship':
        return (
          <FellowshipScreen
            parishName={parishId ? "St. Jude's Parish" : undefined}
            onMenuPress={() => console.log('Menu')}
            onNotificationPress={() => console.log('Notifications')}
          />
        );

      case 'calendar':
        return dataManager ? (
          <CalendarDashboard
            dataManager={dataManager}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            liturgicalData={liturgicalData}
          />
        ) : null;

      case 'journal':
        return dataManager ? (
          <Journal
            dataManager={dataManager}
            selectedDate={selectedDate}
            liturgicalData={liturgicalData}
          />
        ) : null;

      case 'saints':
        return dataManager ? (
          <SaintsInfo
            dataManager={dataManager}
            selectedDate={selectedDate}
            liturgicalData={liturgicalData}
          />
        ) : null;

      case 'parish':
        return dataManager && parishId ? (
          <ParishDashboard
            dataManager={dataManager}
            parishId={parishId}
            selectedDate={selectedDate}
            liturgicalData={liturgicalData}
          />
        ) : (
          <FellowshipScreen
            parishName="Select a Parish"
            onMenuPress={() => console.log('Menu')}
          />
        );

      default:
        return null;
    }
  };

  // For now, just render the splash screen or missal
  // Full navigation will be integrated with React Navigation in production
  if (currentScreen === 'splash') {
    return renderScreen();
  }

  // Simple tab navigation for demonstration
  return (
    <View style={styles.container}>
      {renderScreen()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default SanctissiMissaApp;
