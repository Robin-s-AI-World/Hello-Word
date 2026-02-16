/**
 * AnnouncementsCarousel - Horizontal scrolling announcement cards
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { Carousel } from '../../components/ui';
import { Announcement } from '../../core/types/liturgical';

interface AnnouncementsCarouselProps {
  announcements: Announcement[];
  onSeeAll?: () => void;
  onAnnouncementPress?: (announcement: Announcement) => void;
}

export const AnnouncementsCarousel: React.FC<AnnouncementsCarouselProps> = ({
  announcements,
  onSeeAll,
  onAnnouncementPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Announcements{' '}
          <Text style={styles.titleLatin}>(Nuntii)</Text>
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      <Carousel cardWidth={280} gap={16}>
        {announcements.map((announcement) => (
          <TouchableOpacity
            key={announcement.id}
            style={styles.card}
            onPress={() => onAnnouncementPress?.(announcement)}
            activeOpacity={0.9}
          >
            {/* Image */}
            <View style={styles.imageContainer}>
              <View style={styles.imageGradient} />
              {announcement.imageUrl ? (
                <Image
                  source={{ uri: announcement.imageUrl }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderIcon}>⛪</Text>
                </View>
              )}
              {/* Overlay content */}
              <View style={styles.overlay}>
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{announcement.dateLabel}</Text>
                </View>
                <Text style={styles.cardTitle}>{announcement.title}</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {announcement.description || announcement.category}
                {announcement.timeLabel && ` - ${announcement.timeLabel}`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </Carousel>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  titleLatin: {
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primary,
    fontFamily: theme.typography.primaryFont,
  },
  card: {
    flex: 1,
  },
  imageContainer: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
  },
  overlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  dateBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: theme.typography.primaryFont,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: theme.typography.primaryFont,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  footer: {
    marginTop: 12,
    paddingHorizontal: 4,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.secondaryFont,
  },
});

export default AnnouncementsCarousel;
