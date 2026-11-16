import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { SECONDARY_BUTTON_H } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON_SIZE = 24;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  disabled?: boolean;
  tone?: 'outline' | 'filled';
  accessibilityLabel?: string;
}

/** 48 dp outlined action. Same icon size and gap as the primary button. */
function SecondaryButtonBase({
  label,
  onPress,
  Icon,
  disabled = false,
  tone = 'outline',
  accessibilityLabel,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(!disabled);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={styles.pressable}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.surface,
          tone === 'filled' ? styles.filled : styles.outline,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON_SIZE} color={theme.colors.text.primary} strokeWidth={2.2} /> : null}
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: SECONDARY_BUTTON_H,
  },
  surface: {
    width: '100%',
    height: SECONDARY_BUTTON_H,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  outline: {
    backgroundColor: 'rgba(246, 246, 237, 0.9)',
    borderColor: theme.colors.ui.borderStrong,
  },
  filled: {
    backgroundColor: theme.colors.bg.accent,
    borderColor: theme.colors.ui.borderStrong,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    ...theme.typography.buttonSmall,
    color: theme.colors.text.primary,
    lineHeight: ICON_SIZE,
  },
  disabled: {
    opacity: 0.45,
  },
});

export const SecondaryButton = memo(SecondaryButtonBase);
