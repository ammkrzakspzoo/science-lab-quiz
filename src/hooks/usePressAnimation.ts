import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { PRESS_IN_MS } from '../constants/config';
import { theme } from '../constants/theme';

/**
 * Press feedback for a Pressable PARENT. The Animated.View always lives INSIDE
 * the Pressable, otherwise the native-driver layer swallows taps on Android.
 * Only `transform` is animated, so useNativeDriver is safe.
 */
export function usePressAnimation(enabled: boolean = true, pressedScale: number = 0.98) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    if (!enabled) {
      return;
    }
    Animated.timing(scale, {
      toValue: pressedScale,
      duration: PRESS_IN_MS,
      useNativeDriver: true,
    }).start();
  }, [enabled, pressedScale, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: theme.animation.press.tension,
      friction: theme.animation.press.friction,
      overshootClamping: true,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return { scale, onPressIn, onPressOut };
}
