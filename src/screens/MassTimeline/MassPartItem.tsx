/**
 * MassPartItem - Mass part row with label and badges
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
import { Badge } from '../../components/ui';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';

interface MassPartItemProps {
  name: string;
  latinName?: string;
  type: 'ordinary' | 'proper' | 'solemn';
  badge?: string;
  isHighlighted?: boolean;
  isCompact?: boolean;
  onPress?: () => void;
}

export const MassPartItem: React.FC<MassPartItemProps> = ({
  name,
  latinName,
  type,
  badge,
  isHighlighted = false,
  isCompact = false,
  onPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme, isCompact, isHighlighted);

  const getBadgeVariant = (): 'ordinary' | 'proper' | 'solemn' => {
    if (type === 'solemn') return 'solemn';
    if (type === 'proper') return 'proper';
    return 'ordinary';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text
          style={[
            styles.name,
            isHighlighted && styles.nameHighlighted,
          ]}
        >
          {name}
        </Text>
        {latinName && (
          <Text style={styles.latinName}>{latinName}</Text>
        )}
      </View>
      {badge ? (
        <Badge
          label={badge}
          variant={getBadgeVariant()}
          size="small"
        />
      ) : type !== 'ordinary' ? (
        <Badge
          label={type === 'proper' ? 'Proper' : 'Solemn'}
          variant={getBadgeVariant()}
          size="small"
        />
      ) : (
        <Text style={styles.ordinaryLabel}>Ordinary</Text>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (theme: Theme, isCompact: boolean, isHighlighted: boolean) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: isCompact ? 20 : 44,
    paddingRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: isCompact ? 14 : (isHighlighted ? 20 : 16),
    fontWeight: isHighlighted ? '700' : ('500' as const),
    color: isHighlighted ? LITURGICAL_COLORS.gold : theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
    textTransform: isHighlighted ? 'uppercase' : ('none' as const),
    letterSpacing: isHighlighted ? 2 : 0,
  },
  nameHighlighted: {
    textShadowColor: LITURGICAL_COLORS.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  latinName: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.secondaryFont,
    marginTop: 2,
  },
  ordinaryLabel: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.primaryFont,
  },
});

export default MassPartItem;
