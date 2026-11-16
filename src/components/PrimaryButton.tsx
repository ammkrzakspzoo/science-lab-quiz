import React, { memo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { PRIMARY_BUTTON_H } from '../constants/config';
import { theme } from '../constants/theme';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON_SIZE = 24;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: LucideIcon;
  disabled?: boolean;
  accessibilityLabel?: string;
}

/**
 * 56 dp gradient action. Icon is always 24x24 and the label line height
 * matches it, so the row can never look misaligned.
 */
function PrimaryButtonBase({ label, onPress, Icon, disabled = false, accessibilityLabel }: Props) {
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
          styles.shadow,
          disabled ? styles.disabled : null,
          { transform: [{ scale }] },
        ]}>
        <LinearGradient
          colors={[...theme.gradients.action]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          locations={[0.65, 1]}
          style={styles.surface}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON_SIZE} color={theme.colors.text.onAction} strokeWidth={2.4} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    height: PRIMARY_BUTTON_H,
  },
  shadow: {
    width: '100%',
    height: PRIMARY_BUTTON_H,
    borderRadius: theme.radius.lg,
    ...theme.shadows.button,
  },
  surface: {
    width: '100%',
    height: PRIMARY_BUTTON_H,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    ...theme.typography.button,
    color: theme.colors.text.onAction,
    lineHeight: ICON_SIZE,
  },
  disabled: {
    opacity: 0.5,
  },
});

export const PrimaryButton = memo(PrimaryButtonBase);
