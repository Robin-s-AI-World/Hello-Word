/**
 * Main Liturgical Application Component
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { DataManager } from '../core/services/dataManager';
import { CachedLiturgicalData } from '../core/types/liturgical';
import { CalendarDashboard } from './CalendarDashboard';
import { Journal } from './Journal';
import { SaintsInfo } from './SaintsInfo';
import { ParishDashboard } from './ParishDashboard';
import { VersionStatusBar } from './ui/VersionStatusBar';
import { getDisplayVersion } from '../core/utils/version';

// Import storage service based on platform
import { createStorageService } from '../platforms/storageFactory';

interface LiturgicalAppProps {
  initialDate?: string;
  parishId?: string; // Optional: if user is subscribed to a parish
}

type TabType = 'calendar' | 'journal' | 'saints' | 'parish';

export const LiturgicalApp: React.FC<LiturgicalAppProps> = ({ 
  initialDate, 
  parishId 
}) => {
  const [dataManager, setDataManager] = useState<DataManager | null>(null);
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [liturgicalData, setLiturgicalData] = useState<CachedLiturgicalData | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
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

      // Create platform-specific storage service
      const storageService = await createStorageService();
      
      // Initialize data manager
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
      setError(`Failed to load liturgical data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case 'calendar': return '📅';
      case 'journal': return '📝';
      case 'saints': return '✨';
      case 'parish': return '⛪';
      default: return '📱';
    }
  };

  const getTabLabel = (tab: TabType) => {
    switch (tab) {
      case 'calendar': return 'Calendar';
      case 'journal': return 'Journal';
      case 'saints': return 'Saints';
      case 'parish': return 'Parish';
      default: return 'App';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>SanctissiMissa</Text>
        <Text style={styles.loadingSubtitle}>Traditional Catholic Liturgy</Text>
        <Text style={styles.loadingText}>Initializing...</Text>
        <Text style={styles.copyright}>
          Copyright © 2025 Robin L. M. Cheung, MBA. All rights reserved.
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>SanctissiMissa</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={initializeApp}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!dataManager) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* App Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.appTitle}>SanctissiMissa</Text>
          <Text style={styles.appSubtitle}>Traditional Catholic Liturgy</Text>
          {liturgicalData && (
            <Text style={styles.liturgicalDate}>
              {liturgicalData.liturgicalDay.celebration} • {liturgicalData.liturgicalDay.season}
            </Text>
          )}
        </View>
        <Text style={styles.selectedDate}>
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </Text>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'calendar' && (
          <CalendarDashboard 
            dataManager={dataManager}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            liturgicalData={liturgicalData}
          />
        )}
        
        {activeTab === 'journal' && (
          <Journal 
            dataManager={dataManager}
            selectedDate={selectedDate}
            liturgicalData={liturgicalData}
          />
        )}
        
        {activeTab === 'saints' && (
          <SaintsInfo 
            dataManager={dataManager}
            selectedDate={selectedDate}
            liturgicalData={liturgicalData}
          />
        )}
        
        {activeTab === 'parish' && parishId && (
          <ParishDashboard 
            dataManager={dataManager}
            parishId={parishId}
            selectedDate={selectedDate}
            liturgicalData={liturgicalData}
          />
        )}

        {activeTab === 'parish' && !parishId && (
          <View style={styles.noParishContainer}>
            <Text style={styles.noParishIcon}>⛪</Text>
            <Text style={styles.noParishTitle}>No Parish Subscription</Text>
            <Text style={styles.noParishText}>
              Subscribe to a parish to access newsletters, events, and contact information.
            </Text>
          </View>
        )}
      </View>

      {/* Bottom Tab Navigation */}
      <View style={styles.tabBar}>
        {(['calendar', 'journal', 'saints'] as TabType[]).map((tab) => (
          <TouchableOpacity 
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabIcon, activeTab === tab && styles.activeTabIcon]}>
              {getTabIcon(tab)}
            </Text>
            <Text style={[styles.tabLabel, activeTab === tab && styles.activeTabLabel]}>
              {getTabLabel(tab)}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Parish tab only shows if parishId is provided */}
        {parishId && (
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'parish' && styles.activeTab]}
            onPress={() => setActiveTab('parish')}
          >
            <Text style={[styles.tabIcon, activeTab === 'parish' && styles.activeTabIcon]}>
              {getTabIcon('parish')}
            </Text>
            <Text style={[styles.tabLabel, activeTab === 'parish' && styles.activeTabLabel]}>
              {getTabLabel('parish')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Copyright Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Copyright © 2025 Robin L. M. Cheung, MBA. All rights reserved.
        </Text>
        <Text style={styles.versionText}>
          {getDisplayVersion()}
        </Text>
      </View>

      {/* Version Status Bar (bottom-right) */}
      <VersionStatusBar visible subtle />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'ios' ? 44 : 0, // Status bar height
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerContent: {
    flex: 1,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  liturgicalDate: {
    fontSize: 12,
    color: '#8e44ad',
    fontStyle: 'italic',
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3498db',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Home indicator space
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // Active tab styling handled by text color changes
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  activeTabIcon: {
    // Active styling will be applied via color
  },
  tabLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  activeTabLabel: {
    color: '#3498db',
    fontWeight: '600',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#adb5bd',
    textAlign: 'center',
  },
  versionText: {
    fontSize: 9,
    color: '#dee2e6',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 40,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#3498db',
    marginBottom: 60,
  },
  copyright: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 40,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noParishContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noParishIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  noParishTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  noParishText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
});