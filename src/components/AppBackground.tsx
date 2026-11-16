import React, { memo } from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { assets } from '../assets';
import { theme } from '../constants/theme';

export type BackgroundVariant =
  | 'loader'
  | 'topics'
  | 'quiz'
  | 'explanation'
  | 'results'
  | 'badges'
  | 'stats'
  | 'settings';

interface VariantStyle {
  colors: string[];
  opacity: number;
  bubble: string;
  bubbleOpacity: number;
  dark: boolean;
}

const VARIANTS: Record<BackgroundVariant, VariantStyle> = {
  loader: {
    colors: [...theme.gradients.loader],
    opacity: 0.94,
    bubble: theme.colors.lab.green,
    bubbleOpacity: 0.08,
    dark: true,
  },
  topics: {
    colors: [...theme.gradients.menu],
    opacity: 0.94,
    bubble: theme.colors.lab.olive,
    bubbleOpacity: 0.1,
    dark: false,
  },
  quiz: {
    colors: [...theme.gradients.quiz],
    opacity: 0.97,
    bubble: theme.colors.lab.green,
    bubbleOpacity: 0.12,
    dark: false,
  },
  explanation: {
    colors: [...theme.gradients.explanation],
    opacity: 0.95,
    bubble: theme.colors.lab.olive,
    bubbleOpacity: 0.1,
    dark: false,
  },
  results: {
    colors: [...theme.gradients.results],
    opacity: 0.94,
    bubble: theme.colors.lab.action,
    bubbleOpacity: 0.08,
    dark: false,
  },
  badges: {
    colors: [...theme.gradients.badges],
    opacity: 0.95,
    bubble: theme.colors.lab.olive,
    bubbleOpacity: 0.1,
    dark: false,
  },
  stats: {
    colors: [...theme.gradients.stats],
    opacity: 0.96,
    bubble: theme.colors.lab.green,
    bubbleOpacity: 0.12,
    dark: false,
  },
  settings: {
    colors: [...theme.gradients.settings],
    opacity: 0.96,
    bubble: theme.colors.lab.olive,
    bubbleOpacity: 0.1,
    dark: false,
  },
};

/** Decorative bubbles live in the margins only — never across text. */
const BUBBLES = [
  { size: 32, top: 92, right: 10 },
  { size: 20, top: 150, right: 44 },
  { size: 12, top: 128, right: 74 },
  { size: 24, bottom: 120, left: 8 },
  { size: 12, bottom: 168, left: 36 },
];

function AppBackgroundBase({
  variant,
  children,
}: {
  variant: BackgroundVariant;
  children: React.ReactNode;
}) {
  const config = VARIANTS[variant];

  return (
    <View style={styles.root}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={config.dark ? 'light-content' : 'dark-content'}
      />
      <ImageBackground source={assets.bgGame} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient
          colors={config.colors}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={[StyleSheet.absoluteFill, { opacity: config.opacity }]}
        />
      </ImageBackground>

      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {BUBBLES.map((bubble, index) => (
          <View
            key={`bubble-${index}`}
            style={[
              styles.bubble,
              {
                width: bubble.size,
                height: bubble.size,
                borderRadius: bubble.size / 2,
                backgroundColor: config.bubble,
                opacity: config.bubbleOpacity,
                top: bubble.top,
                bottom: bubble.bottom,
                left: bubble.left,
                right: bubble.right,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  content: {
    flex: 1,
  },
  bubble: {
    position: 'absolute',
  },
});

export const AppBackground = memo(AppBackgroundBase);
