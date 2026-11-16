import React, { memo } from 'react';
import { Animated, Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { ICON_BUTTON } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

interface Props {
  onPress: () => void;
  accessibilityLabel: string;
  /** A generated glyph (icon_home / icon_pause), drawn at a fixed 24x24. */
  image?: ImageSourcePropType;
  /** Or a vector icon node from the single icon library. */
  children?: React.ReactNode;
  tone?: 'light' | 'solid';
  disabled?: boolean;
}

function IconButtonBase({
  onPress,
  accessibilityLabel,
  image,
  children,
  tone = 'light',
  disabled = false,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(!disabled, 0.94);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      style={styles.pressable}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.surface,
          tone === 'solid' ? styles.solid : styles.lightTone,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        {image ? <Image source={image} style={styles.image} /> : <View>{children}</View>}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: ICON_BUTTON,
    height: ICON_BUTTON,
    alignItems: 'center',
    justifyContent: 'center',
  },
  surface: {
    width: ICON_BUTTON,
    height: ICON_BUTTON,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  lightTone: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: theme.colors.ui.border,
  },
  solid: {
    backgroundColor: theme.colors.bg.accent,
    borderColor: theme.colors.ui.borderStrong,
  },
  disabled: {
    opacity: 0.45,
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});

export const IconButton = memo(IconButtonBase);
