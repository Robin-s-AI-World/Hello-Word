/**
 * FellowshipScreen - Parish announcements and community features
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
import { AnnouncementsCarousel } from './AnnouncementsCarousel';
import { WeeklyScheduleList } from './WeeklyScheduleList';
import { PostComposer } from './PostComposer';
import { PostCard } from './PostCard';
import { Announcement, WeeklyScheduleItem, CommunityPost } from '../../core/types/liturgical';

// Sample data
const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Requiem Mass',
    dateLabel: 'Nov 2',
    timeLabel: '10:00 AM',
    category: 'liturgical',
    description: 'All Souls Day',
  },
  {
    id: '2',
    title: 'Parish Picnic',
    dateLabel: 'Sunday',
    timeLabel: 'After High Mass',
    category: 'social',
    description: 'Families gathering',
  },
  {
    id: '3',
    title: 'Altar Server Training',
    dateLabel: 'Volunteer',
    timeLabel: 'Saturday, 2:00 PM',
    category: 'educational',
    description: 'New server orientation',
  },
];

const SAMPLE_SCHEDULE: WeeklyScheduleItem[] = [
  {
    id: '1',
    title: 'Missa Cantata',
    latinTitle: 'Missa Cantata',
    day: 'Sunday',
    time: '10:00 AM',
    location: 'High Altar',
    iconName: 'church',
    iconColor: 'church',
  },
  {
    id: '2',
    title: 'Confession',
    latinTitle: 'Confessio',
    day: 'Sat',
    time: '3:00 PM - 4:45 PM',
    location: 'Chapel',
    iconName: 'key',
    iconColor: 'key',
  },
  {
    id: '3',
    title: 'Vespers',
    latinTitle: 'Vesperae',
    day: 'Sunday',
    time: '5:00 PM',
    location: 'Main Church',
    iconName: 'sun',
    iconColor: 'sun',
  },
];

const SAMPLE_POSTS: CommunityPost[] = [
  {
    id: '1',
    parishId: 'st-judes',
    authorName: 'Thomas Aquinas',
    isAdmin: false,
    content: 'The chant for the Kyrie was particularly moving today. It really helped me focus on the penitential nature of the season. #GregorianChant',
    visibility: 'public',
    likesCount: 12,
    commentsCount: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    parishId: 'st-judes',
    authorName: 'Parish Office',
    isAdmin: true,
    content: 'We are still looking for two volunteers to help set up the coffee hour after the 10am High Mass next Sunday. Please sign up above if you can help!',
    visibility: 'public',
    likesCount: 8,
    commentsCount: 2,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

interface FellowshipScreenProps {
  parishName?: string;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

export const FellowshipScreen: React.FC<FellowshipScreenProps> = ({
  parishName = "St. Jude's Parish",
  onMenuPress,
  onNotificationPress,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [posts, setPosts] = useState<CommunityPost[]>(SAMPLE_POSTS);

  const handlePost = (content: string, visibility: 'journal' | 'public') => {
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      parishId: 'st-judes',
      authorName: 'You',
      isAdmin: false,
      content,
      visibility,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(p =>
      p.id === postId ? { ...p, likesCount: p.likesCount + 1 } : p
    ));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onMenuPress}
        >
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{parishName}</Text>
          <Text style={styles.headerLabel}>Vita Parochialis</Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onNotificationPress}
        >
          <Text style={styles.headerIcon}>🔔</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Announcements */}
        <AnnouncementsCarousel
          announcements={SAMPLE_ANNOUNCEMENTS}
          onSeeAll={() => console.log('See all announcements')}
          onAnnouncementPress={(a) => console.log('Announcement:', a.title)}
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Weekly Schedule */}
        <WeeklyScheduleList
          items={SAMPLE_SCHEDULE}
          onItemPress={(item) => console.log('Schedule item:', item.title)}
        />

        {/* Divider */}
        <View style={styles.divider} />

        {/* Fellowship Section */}
        <View style={styles.fellowshipSection}>
          <Text style={styles.fellowshipTitle}>
            Fellowship{' '}
            <Text style={styles.titleLatin}>(Communio)</Text>
          </Text>

          {/* Post Composer */}
          <PostComposer
            onPost={handlePost}
            placeholder="Share a reflection from today's Homily..."
          />

          {/* Feed */}
          <View style={styles.feed}>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={() => handleLike(post.id)}
                onComment={() => console.log('Comment on:', post.id)}
                onMore={() => console.log('More options:', post.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <BottomNavItem icon="📖" label="Missal" />
        <BottomNavItem icon="👥" label="Parish" active />
        <BottomNavItem icon="📅" label="Calendar" />
        <BottomNavItem icon="⚙" label="Settings" />
      </View>
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
    fontSize: 26,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    fontFamily: theme.typography.primaryFont,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  divider: {
    height: 1,
    backgroundColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
    marginHorizontal: 16,
    marginVertical: 24,
  },
  fellowshipSection: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    minHeight: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  fellowshipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleLatin: {
    fontSize: 14,
    fontWeight: '400',
    fontStyle: 'italic',
    color: theme.colors.onSurfaceVariant,
  },
  feed: {
    paddingHorizontal: 16,
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.dark ? '#101622' : '#f6f6f8',
    borderTopWidth: 1,
    borderTopColor: theme.dark ? 'rgba(255,255,255,0.1)' : theme.colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    height: 80,
  },
});

export default FellowshipScreen;
