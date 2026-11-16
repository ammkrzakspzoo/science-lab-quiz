import React, { memo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Check, Info } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { usePulse } from '../hooks/useEntryAnimation';

interface Props {
  isCorrect: boolean;
  prompt: string;
  chosenText: string;
  correctText: string;
  reduceMotion: boolean;
}

/** Calm feedback: no red flash, no shake, and the correct answer is explicit. */
function FeedbackPanelBase({ isCorrect, prompt, chosenText, correctText, reduceMotion }: Props) {
  const iconScale = usePulse(isCorrect ? `ok-${correctText}` : `no-${chosenText}`, !reduceMotion);
  const accent = isCorrect ? theme.colors.lab.greenDeep : theme.colors.lab.oliveDeep;

  return (
    <View style={styles.panel} accessibilityLiveRegion="polite">
      <View style={styles.headingRow}>
        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.iconWrap,
            { backgroundColor: accent + '1A', transform: [{ scale: iconScale }] },
          ]}>
          {isCorrect ? (
            <Check size={22} color={accent} strokeWidth={3} />
          ) : (
            <Info size={22} color={accent} strokeWidth={2.6} />
          )}
        </Animated.View>
        <Text style={[styles.heading, { color: accent }]} accessibilityRole="header">
          {isCorrect ? 'Good thinking!' : "Let's explore"}
        </Text>
      </View>

      <Text style={styles.prompt}>{prompt}</Text>

      {isCorrect ? (
        <Text style={styles.answerStrong}>{`Your answer is correct: ${correctText}`}</Text>
      ) : (
        <View>
          <Text style={styles.answerPlain}>{`Your answer: ${chosenText}`}</Text>
          <Text style={styles.answerStrong}>{`Correct answer: ${correctText}`}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 16,
    ...theme.shadows.card,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    ...theme.typography.cardTitle,
  },
  prompt: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  answerPlain: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
  },
  answerStrong: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
    marginTop: 2,
  },
});

export const FeedbackPanel = memo(FeedbackPanelBase);
