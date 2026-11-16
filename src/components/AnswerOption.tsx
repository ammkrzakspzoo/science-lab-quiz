import React, { memo, useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Check, Info } from 'lucide-react-native';
import { ANSWER_ROW_MIN_H } from '../constants/config';
import { theme } from '../constants/theme';
import type { OptionId } from '../game/types';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

export type AnswerState = 'idle' | 'chosen' | 'correct' | 'wrong';

interface Props {
  optionId: OptionId;
  letter: string;
  text: string;
  state: AnswerState;
  disabled: boolean;
  onPress: (optionId: OptionId) => void;
}

function AnswerOptionBase({ optionId, letter, text, state, disabled, onPress }: Props) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(!disabled);
  const handlePress = useCallback(() => onPress(optionId), [onPress, optionId]);

  const surfaceStyle =
    state === 'correct'
      ? styles.correct
      : state === 'wrong'
      ? styles.wrong
      : state === 'chosen'
      ? styles.chosen
      : null;

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT_SLOP}
      accessibilityRole="radio"
      accessibilityLabel={`Answer ${letter}. ${text}`}
      accessibilityState={{ disabled, selected: state !== 'idle' }}
      style={styles.pressable}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.row, surfaceStyle, { transform: [{ scale }] }]}>
        <View style={[styles.letterBadge, state === 'idle' ? null : styles.letterBadgeActive]}>
          <Text style={styles.letter}>{letter}</Text>
        </View>

        <Text style={styles.text}>{text}</Text>

        {state === 'correct' ? (
          <Check size={20} color={theme.colors.lab.greenDeep} strokeWidth={3} />
        ) : null}
        {state === 'wrong' ? (
          <Info size={20} color={theme.colors.lab.oliveDeep} strokeWidth={2.6} />
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
    minHeight: ANSWER_ROW_MIN_H + 8,
    alignSelf: 'stretch',
  },
  row: {
    width: '100%',
    minHeight: ANSWER_ROW_MIN_H + 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
  },
  chosen: {
    borderWidth: 2,
    borderColor: theme.colors.lab.action,
    backgroundColor: 'rgba(40, 41, 224, 0.08)',
  },
  correct: {
    borderWidth: 2,
    borderColor: theme.colors.lab.greenDeep,
    backgroundColor: 'rgba(199, 221, 176, 0.55)',
  },
  wrong: {
    borderWidth: 2,
    borderColor: theme.colors.lab.oliveDeep,
    backgroundColor: 'rgba(171, 170, 42, 0.14)',
  },
  letterBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  letterBadgeActive: {
    backgroundColor: theme.colors.bg.accent,
  },
  letter: {
    ...theme.typography.caption,
    fontSize: 14,
    lineHeight: 18,
    color: theme.colors.text.primary,
  },
  text: {
    ...theme.typography.body,
    fontWeight: '500',
    color: theme.colors.text.primary,
    flex: 1,
  },
});

export const AnswerOption = memo(AnswerOptionBase);
