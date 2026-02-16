/**
 * ProgressIndicator - Top progress bar for Mass sections
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

interface ProgressStep {
  id: string;
  label: string;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: number;
  onStepPress?: (index: number) => void;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  onStepPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Progress line */}
      <View style={styles.lineContainer}>
        <View style={styles.line} />
        {steps.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            style={styles.stepButton}
            onPress={() => onStepPress?.(index)}
          >
            <View
              style={[
                styles.dot,
                index < currentStep && styles.dotCompleted,
                index === currentStep && styles.dotActive,
              ]}
            >
              {index === currentStep && (
                <>
                  <View style={styles.pingAnimation} />
                  <View style={styles.pulseAnimation} />
                </>
              )}
            </View>
            <Text
              style={[
                styles.label,
                index === currentStep && styles.labelActive,
                index > currentStep && styles.labelInactive,
              ]}
              numberOfLines={1}
            >
              {step.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: theme.dark ? '#101622' : '#f6f6f8',
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    position: 'relative',
  },
  line: {
    position: 'absolute',
    top: 8,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: theme.dark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.5)',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  stepButton: {
    alignItems: 'center',
    width: 48,
    zIndex: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.dark ? '#4b5563' : '#9ca3af',
    marginBottom: 6,
  },
  dotCompleted: {
    backgroundColor: theme.colors.primary,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22d3ee',
    shadowColor: '#22d3ee',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
  },
  pingAnimation: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    opacity: 0.2,
  },
  pulseAnimation: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3b82f6',
    opacity: 0.4,
  },
  label: {
    fontSize: 8,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  labelActive: {
    fontSize: 9,
    color: '#22d3ee',
    textShadowColor: '#22d3ee',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  labelInactive: {
    fontSize: 8,
    fontWeight: '500',
    color: theme.colors.onSurfaceVariant,
  },
});

export default ProgressIndicator;
