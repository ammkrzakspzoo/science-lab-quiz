import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { ENTRY_FADE_MS } from '../constants/config';

/**
 * Entry fade plus a short upward move. Transform and opacity only, so the
 * animation runs on the native driver without touching layout.
 */
export function useEntryAnimation(delay: number = 0, rise: number = 12, reduceMotion = false) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(reduceMotion ? 0 : rise)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: ENTRY_FADE_MS,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: reduceMotion ? 0 : ENTRY_FADE_MS,
        delay,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [delay, opacity, reduceMotion, translateY]);

  return { opacity, translateY };
}

/** One-shot pulse used when a counter or a badge changes. */
export function usePulse(trigger: number | string, enabled = true) {
  const scale = useRef(new Animated.Value(1)).current;
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!enabled) {
      return;
    }
    scale.setValue(1);
    const animation = Animated.sequence([
      Animated.timing(scale, { toValue: 1.06, duration: 110, useNativeDriver: true }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 200,
        friction: 12,
        overshootClamping: true,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [enabled, scale, trigger]);

  return scale;
}
