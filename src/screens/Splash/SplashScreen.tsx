/**
 * SplashScreen Component - App loading screen with Chi-Rho animation
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Easing,
  Platform,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';
import { AboutModal } from './AboutModal';
import { LITURGICAL_COLORS } from '../../core/types/liturgical';
import { getDisplayVersion } from '../../core/utils/version';

interface SplashScreenProps {
  onFinish?: () => void;
  minDisplayTime?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  minDisplayTime = 2000,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const [showAbout, setShowAbout] = useState(false);

  // Animation values
  const chiRhoScale = useRef(new Animated.Value(0.8)).current;
  const chiRhoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      // Chi-Rho fades in and scales
      Animated.parallel([
        Animated.timing(chiRhoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(chiRhoScale, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.2)),
        }),
      ]),
      // Title fades in
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Subtitle fades in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Loading dots animation (continuous bounce)
    const createDotAnimation = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.in(Easing.quad),
          }),
          Animated.delay(800),
        ])
      );
    };

    createDotAnimation(dot1, 0).start();
    createDotAnimation(dot2, 200).start();
    createDotAnimation(dot3, 400).start();

    // Auto-finish after min display time
    const timer = setTimeout(() => {
      onFinish?.();
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, []);

  const dotScale = (dot: Animated.Value) => ({
    transform: [
      {
        translateY: dot.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      {/* Background gradient overlay */}
      <View style={styles.backgroundOverlay} />

      {/* Main content */}
      <View style={styles.content}>
        {/* Chi-Rho Symbol */}
        <Animated.View
          style={[
            styles.chiRhoContainer,
            {
              opacity: chiRhoOpacity,
              transform: [{ scale: chiRhoScale }],
            },
          ]}
        >
          <ChiRhoSVG color={LITURGICAL_COLORS.gold} size={120} />
        </Animated.View>

        {/* Title */}
        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>MISSALE</Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={{ opacity: subtitleOpacity }}>
          <Text style={styles.subtitle}>Romanum</Text>
        </Animated.View>

        {/* Loading dots */}
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, dotScale(dot1)]} />
          <Animated.View style={[styles.dot, dotScale(dot2)]} />
          <Animated.View style={[styles.dot, dotScale(dot3)]} />
        </Animated.View>
      </View>

      {/* About button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.aboutButton}
          onPress={() => setShowAbout(true)}
        >
          <Text style={styles.aboutIcon}>ℹ</Text>
          <Text style={styles.aboutText}>About</Text>
        </TouchableOpacity>
        <Text style={styles.motto}>Ad Maiorem Dei Gloriam</Text>
        <Text style={styles.version}>{getDisplayVersion()}</Text>
      </View>

      {/* About Modal */}
      <AboutModal
        visible={showAbout}
        onClose={() => setShowAbout(false)}
      />
    </View>
  );
};

// Chi-Rho SVG Component
const ChiRhoSVG: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  const strokeWidth = 3;
  const center = size / 2;
  const scale = size / 100;

  return (
    <View style={{ width: size, height: size }}>
      {/* Using View with border styling for cross */}
      <View
        style={{
          position: 'absolute',
          left: center - (strokeWidth * scale) / 2,
          top: size * 0.1,
          width: strokeWidth * scale,
          height: size * 0.8,
          backgroundColor: color,
          borderRadius: strokeWidth,
        }}
      />
      {/* Rho (Ρ) curved part */}
      <View
        style={{
          position: 'absolute',
          left: center,
          top: size * 0.1,
          width: size * 0.25,
          height: size * 0.35,
          borderWidth: strokeWidth * scale,
          borderColor: color,
          borderLeftWidth: 0,
          borderTopRightRadius: size * 0.2,
          borderBottomRightRadius: size * 0.2,
        }}
      />
      {/* Chi (X) diagonal lines */}
      <View
        style={{
          position: 'absolute',
          left: size * 0.25,
          top: size * 0.2,
          width: size * 0.5,
          height: strokeWidth * scale,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          borderRadius: strokeWidth,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: size * 0.25,
          top: size * 0.6,
          width: size * 0.5,
          height: strokeWidth * scale,
          backgroundColor: color,
          transform: [{ rotate: '-45deg' }],
          borderRadius: strokeWidth,
        }}
      />
      {/* Alpha (Α) hint */}
      <View
        style={{
          position: 'absolute',
          left: size * 0.15,
          top: size * 0.45,
          width: size * 0.15,
          height: strokeWidth * scale * 0.8,
          backgroundColor: color,
          borderRadius: strokeWidth,
        }}
      />
      {/* Omega (Ω) hint */}
      <View
        style={{
          position: 'absolute',
          right: size * 0.15,
          top: size * 0.45,
          width: size * 0.2,
          height: size * 0.15,
          borderWidth: strokeWidth * scale * 0.8,
          borderColor: color,
          borderTopWidth: 0,
          borderBottomLeftRadius: size * 0.1,
          borderBottomRightRadius: size * 0.1,
        }}
      />
    </View>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.dark ? '#0f1216' : '#1a1e26',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.dark ? 'rgba(0,0,0,0.3)' : 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  chiRhoContainer: {
    marginBottom: 40,
    opacity: 0.9,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Cinzel, serif',
    letterSpacing: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#a68826',
    fontFamily: 'Cinzel, serif',
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginTop: 8,
    marginBottom: 48,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: `${LITURGICAL_COLORS.gold}80`,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    paddingHorizontal: 24,
  },
  aboutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  aboutIcon: {
    fontSize: 16,
    color: '#a68826',
  },
  aboutText: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: theme.typography.secondaryFont,
  },
  motto: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 24,
    textTransform: 'uppercase',
    letterSpacing: 3,
    opacity: 0.6,
  },
  version: {
    fontSize: 9,
    color: '#4b5563',
    marginTop: 8,
    opacity: 0.5,
    fontFamily: 'monospace',
  },
});

export default SplashScreen;
