import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { assets } from '../assets';
import { CONTENT_W, LOADER_DURATION_MS, LOADER_MARK, LOADER_TICK_MS } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  onComplete: () => void;
}

/**
 * Splash. Deliberately darker than Topics: no chips, no call-to-action, just the
 * brand mark, the title and a time-based progress bar.
 */
export function LoaderScreen({ onComplete }: Props) {
  const [elapsed, setElapsed] = useState(0);

  const markOpacity = useRef(new Animated.Value(0)).current;
  const markScale = useRef(new Animated.Value(0.96)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const entry = Animated.parallel([
      Animated.timing(markOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(markScale, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 180,
        delay: 220,
        useNativeDriver: true,
      }),
    ]);
    entry.start();

    const started = Date.now();
    const ticker = setInterval(() => {
      setElapsed(Math.min(Date.now() - started, LOADER_DURATION_MS));
    }, LOADER_TICK_MS);

    const timer = setTimeout(() => completeRef.current(), LOADER_DURATION_MS);

    return () => {
      entry.stop();
      clearInterval(ticker);
      clearTimeout(timer);
    };
  }, [markOpacity, markScale, titleOpacity]);

  const percent = Math.round((elapsed / LOADER_DURATION_MS) * 100);

  return (
    <AppBackground variant="loader">
      <View style={styles.root}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.markCard,
            { opacity: markOpacity, transform: [{ scale: markScale }] },
          ]}>
          <Image source={assets.logo} style={styles.logo} accessibilityElementsHidden />
        </Animated.View>

        <Animated.View pointerEvents="box-none" style={{ opacity: titleOpacity }}>
          <Text style={styles.title} accessibilityRole="header">
            Science Lab{'\n'}Quiz
          </Text>
          <Text style={styles.subtitle}>Small questions. Big discoveries.</Text>
        </Animated.View>

        <View style={styles.progressBlock}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${percent}%` }]} />
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: CONTENT_W,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCard: {
    width: LOADER_MARK,
    height: LOADER_MARK,
    borderRadius: theme.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(246, 246, 237, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(246, 246, 237, 0.3)',
    marginBottom: 28,
  },
  logo: {
    width: LOADER_MARK - 28,
    height: LOADER_MARK - 28,
    resizeMode: 'contain',
  },
  title: {
    ...theme.typography.hero,
    color: theme.colors.text.onDark,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.body,
    fontWeight: '500',
    color: 'rgba(246, 246, 237, 0.85)',
    textAlign: 'center',
    marginTop: 12,
  },
  progressBlock: {
    alignItems: 'center',
    marginTop: 44,
  },
  track: {
    width: 180,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(246, 246, 237, 0.18)',
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.lab.green,
  },
  loading: {
    ...theme.typography.micro,
    color: 'rgba(246, 246, 237, 0.85)',
    marginTop: 12,
  },
});
