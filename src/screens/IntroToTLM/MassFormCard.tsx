/**
 * MassFormCard - Card for displaying Mass form information
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
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface MassFormCardProps {
  title: string;
  subtitle: string;
  icon: string;
  features: string[];
  variant?: 'default' | 'highlighted';
  onPress?: () => void;
}

export const MassFormCard: React.FC<MassFormCardProps> = ({
  title,
  subtitle,
  icon,
  features,
  variant = 'default',
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, variant);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Background decoration for highlighted variant */}
      {variant === 'highlighted' && (
        <View style={styles.backgroundDecoration}>
          <Text style={styles.backgroundIcon}>🎵</Text>
        </View>
      )}

      {/* Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text
          style={[
            styles.subtitle,
            variant === 'highlighted' && styles.subtitleHighlighted,
          ]}
        >
          {subtitle}
        </Text>

        {/* Features list */}
        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View
                style={[
                  styles.featureDot,
                  variant === 'highlighted' && styles.featureDotHighlighted,
                ]}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme, variant: 'default' | 'highlighted') => {
  const isHighlighted = variant === 'highlighted';
  const accentColor = isHighlighted ? LITURGICAL_COLORS.gold : theme.colors.onSurfaceVariant;

  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.dark ? '#1a2233' : '#ffffff',
      borderWidth: 1,
      borderColor: isHighlighted
        ? `${LITURGICAL_COLORS.gold}30`
        : (theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isHighlighted ? 0.1 : 0.05,
      shadowRadius: 8,
      elevation: isHighlighted ? 4 : 2,
      overflow: 'hidden',
    },
    backgroundDecoration: {
      position: 'absolute',
      right: 0,
      top: 0,
      padding: 8,
      opacity: 0.05,
    },
    backgroundIcon: {
      fontSize: 80,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: isHighlighted
        ? `${LITURGICAL_COLORS.gold}20`
        : (theme.dark ? 'rgba(255,255,255,0.05)' : theme.colors.surfaceVariant),
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    icon: {
      fontSize: 24,
      color: isHighlighted ? LITURGICAL_COLORS.gold : theme.colors.onSurfaceVariant,
    },
    content: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: theme.colors.onSurface,
      fontFamily: theme.typography.primaryFont,
    },
    subtitle: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 2,
      marginBottom: 8,
      fontFamily: theme.typography.primaryFont,
    },
    subtitleHighlighted: {
      color: LITURGICAL_COLORS.gold,
    },
    features: {
      marginTop: 4,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    featureDot: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.onSurfaceVariant,
      marginRight: 8,
    },
    featureDotHighlighted: {
      backgroundColor: LITURGICAL_COLORS.gold,
    },
    featureText: {
      fontSize: 14,
      color: theme.dark ? 'rgba(255,255,255,0.6)' : theme.colors.onSurfaceVariant,
      fontFamily: theme.typography.secondaryFont,
    },
  });
};

export default MassFormCard;
