/**
 * PostCard - Feed post display component
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
import { CommunityPost } from '../../core/types/liturgical';

interface PostCardProps {
  post: CommunityPost;
  onLike?: () => void;
  onComment?: () => void;
  onMore?: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onMore,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Avatar */}
          <View
            style={[
              styles.avatar,
              post.isAdmin && styles.avatarAdmin,
            ]}
          >
            {post.authorAvatar ? (
              <Image
                source={{ uri: post.authorAvatar }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>
                {post.isAdmin ? '⛪' : '👤'}
              </Text>
            )}
          </View>

          {/* Author info */}
          <View style={styles.authorInfo}>
            <View style={styles.authorRow}>
              <Text style={styles.authorName}>{post.authorName}</Text>
              {post.isAdmin && (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminBadgeText}>Admin</Text>
                </View>
              )}
            </View>
            <Text style={styles.timestamp}>
              {formatTime(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* More button */}
        <TouchableOpacity style={styles.moreButton} onPress={onMore}>
          <Text style={styles.moreIcon}>•••</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onLike}
        >
          <Text style={styles.actionIcon}>❤</Text>
          <Text style={styles.actionText}>{post.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onComment}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>
            {post.commentsCount > 0 ? post.commentsCount : 'Reply'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarAdmin: {
    backgroundColor: theme.colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 20,
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.primaryFont,
  },
  adminBadge: {
    backgroundColor: `${theme.colors.primary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    textTransform: 'uppercase',
    fontFamily: theme.typography.primaryFont,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.secondaryFont,
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
  },
  moreIcon: {
    fontSize: 18,
    color: theme.colors.onSurfaceVariant,
  },
  content: {
    paddingLeft: 52,
  },
  contentText: {
    fontSize: 14,
    color: theme.dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
    lineHeight: 22,
    fontFamily: theme.typography.secondaryFont,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    paddingLeft: 52,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.primaryFont,
  },
});

export default PostCard;
