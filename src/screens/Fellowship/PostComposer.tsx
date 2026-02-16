/**
 * PostComposer - Text area with privacy toggle for posts
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';

type Visibility = 'journal' | 'public';

interface PostComposerProps {
  userAvatar?: string;
  placeholder?: string;
  onPost?: (content: string, visibility: Visibility) => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  userAvatar,
  placeholder = "Share a reflection from today's Homily...",
  onPost,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Visibility>('journal');

  const handlePost = () => {
    if (content.trim()) {
      onPost?.(content, visibility);
      setContent('');
    }
  };

  const cycleVisibility = () => {
    setVisibility(v => v === 'journal' ? 'public' : 'journal');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          {/* Avatar */}
          <View style={styles.avatar}>
            {userAvatar ? (
              <Text style={styles.avatarText}>👤</Text>
            ) : (
              <Text style={styles.avatarText}>👤</Text>
            )}
          </View>

          {/* Text Input */}
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.onSurfaceVariant}
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Privacy Toggle */}
          <TouchableOpacity
            style={styles.privacyToggle}
            onPress={cycleVisibility}
          >
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyLabel}>
              {visibility === 'journal' ? 'Private Journal' : 'Public'}
            </Text>
            <Text style={styles.privacyArrow}>▼</Text>
          </TouchableOpacity>

          {/* Post Button */}
          <TouchableOpacity
            style={[
              styles.postButton,
              !content.trim() && styles.postButtonDisabled,
            ]}
            onPress={handlePost}
            disabled={!content.trim()}
          >
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: theme.dark ? '#111722' : '#f8fafc',
    borderWidth: 1,
    borderColor: theme.dark ? '#374151' : '#e5e7eb',
    borderRadius: 12,
    padding: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.dark ? '#374151' : '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.onSurface,
    fontFamily: theme.typography.secondaryFont,
    minHeight: 60,
    padding: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.dark ? '#1f2937' : '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  privacyIcon: {
    fontSize: 12,
  },
  privacyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.primaryFont,
  },
  privacyArrow: {
    fontSize: 10,
    color: theme.colors.onSurfaceVariant,
  },
  postButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: theme.typography.primaryFont,
  },
});

export default PostComposer;
