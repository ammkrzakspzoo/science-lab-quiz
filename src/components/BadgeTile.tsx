import React, { memo, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Atom, Award, Droplets, FlaskConical, Leaf, Lock, Sparkles } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { theme } from '../constants/theme';
import type { BadgeDefinition } from '../game/types';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const TILE_H = 132;

const ICONS: Record<BadgeDefinition['iconKey'], LucideIcon> = {
  spark: Sparkles,
  flask: FlaskConical,
  medal: Award,
  atom: Atom,
  bubbles: Droplets,
  leaf: Leaf,
};

interface Props {
  badge: BadgeDefinition;
  unlocked: boolean;
  width: number;
  onPress: (badgeId: string) => void;
}

function BadgeTileBase({ badge, unlocked, width, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(true);
  const handlePress = useCallback(() => onPress(badge.id), [badge.id, onPress]);
  const Icon = ICONS[badge.iconKey];
  const accent = unlocked ? theme.colors.lab.oliveDeep : theme.colors.text.tertiary;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`${badge.name}. ${unlocked ? 'Unlocked' : 'Locked'}. ${badge.rule}`}
      style={[styles.pressable, { width }]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.tile,
          { width },
          unlocked ? styles.unlocked : styles.locked,
          { transform: [{ scale }] },
        ]}>
        <View style={[styles.iconWrap, { backgroundColor: accent + '1A' }]}>
          <Icon size={28} color={accent} strokeWidth={2.4} />
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {badge.name}
        </Text>

        {unlocked ? (
          <Text style={[styles.state, { color: theme.colors.lab.greenDeep }]}>Earned</Text>
        ) : (
          <View style={styles.lockRow}>
            <Lock size={12} color={theme.colors.text.tertiary} strokeWidth={2.6} />
            <Text style={styles.stateInline}>Locked</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    height: TILE_H,
  },
  tile: {
    height: TILE_H,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    ...theme.shadows.card,
  },
  unlocked: {
    backgroundColor: theme.colors.bg.secondary,
    borderColor: theme.colors.ui.borderStrong,
  },
  locked: {
    backgroundColor: 'rgba(246, 246, 237, 0.92)',
    borderColor: theme.colors.ui.border,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    ...theme.typography.caption,
    fontSize: 15,
    lineHeight: 19,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  state: {
    ...theme.typography.micro,
    color: theme.colors.text.tertiary,
    marginTop: 4,
  },
  stateInline: {
    ...theme.typography.micro,
    color: theme.colors.text.tertiary,
  },
});

export const BadgeTile = memo(BadgeTileBase);
