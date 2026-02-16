/**
 * Carousel Component - Horizontal scrollable card container
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

import React, { useRef } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../shared/themes/ThemeProvider';
import { Theme } from '../../shared/themes/index';

interface CarouselProps {
  children: React.ReactNode;
  gap?: number;
  cardWidth?: number;
  showScrollIndicator?: boolean;
  style?: ViewStyle;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  gap = 16,
  cardWidth = 280,
  showScrollIndicator = false,
  style,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const scrollViewRef = useRef<ScrollView>(null);

  const childArray = React.Children.toArray(children);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={showScrollIndicator}
      contentContainerStyle={[
        styles.container,
        { paddingHorizontal: gap / 2 },
        style,
      ]}
      decelerationRate="fast"
      snapToInterval={cardWidth + gap}
      snapToAlignment="start"
    >
      {childArray.map((child, index) => (
        <View
          key={index}
          style={[
            styles.card,
            {
              width: cardWidth,
              marginRight: index < childArray.length - 1 ? gap : 0,
            },
          ]}
        >
          {child}
        </View>
      ))}
    </ScrollView>
  );
};

const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  card: {
    flex: 1,
  },
});

export default Carousel;
