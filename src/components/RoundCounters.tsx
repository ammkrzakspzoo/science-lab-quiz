import React, { memo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { usePulse } from '../hooks/useEntryAnimation';

interface Props {
  correctCount: number;
  currentStreak: number;
  reduceMotion: boolean;
}

/**
 * Plain labelled counters — informative at zero, so they are never hidden and
 * never rendered as empty decorative pills.
 */
function RoundCountersBase({ correctCount, currentStreak, reduceMotion }: Props) {
  const correctScale = usePulse(correctCount, !reduceMotion);
  const streakScale = usePulse(currentStreak, !reduceMotion);

  return (
    <View style={styles.strip}>
      <View style={styles.item}>
        <Text style={styles.label}>Correct</Text>
        <Animated.Text style={[styles.value, { transform: [{ scale: correctScale }] }]}>
          {String(correctCount)}
        </Animated.Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.item}>
        <Text style={styles.label}>Streak</Text>
        <Animated.Text
          style={[styles.value, styles.streak, { transform: [{ scale: streakScale }] }]}>
          {String(currentStreak)}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: theme.colors.ui.divider,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    color: theme.colors.lab.greenDeep,
  },
  streak: {
    color: theme.colors.lab.action,
  },
});

export const RoundCounters = memo(RoundCountersBase);
