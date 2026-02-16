/**
 * VersionStatusBar - Displays version in bottom-right corner
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { getDisplayVersion } from '../../core/utils/version';

interface VersionStatusBarProps {
  /**
   * If true, shows the status bar. Default: true
   */
  visible?: boolean;
  /**
   * If true, uses a subtle transparent style. Default: false
   */
  subtle?: boolean;
}

export const VersionStatusBar: React.FC<VersionStatusBarProps> = ({
  visible = true,
  subtle = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, subtle);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.versionText}>{getDisplayVersion()}</Text>
    </View>
  );
};

const createStyles = (theme: Theme, subtle: boolean) => StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: subtle
      ? 'transparent'
      : theme.dark
        ? 'rgba(0,0,0,0.3)'
        : 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    zIndex: 1000,
  },
  versionText: {
    fontSize: 8,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
    color: subtle
      ? (theme.dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')
      : (theme.dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'),
    letterSpacing: 0.5,
  },
});

export default VersionStatusBar;
