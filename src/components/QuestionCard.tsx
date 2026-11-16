import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { assets } from '../assets';
import { IS_COMPACT } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  subjectLabel: string;
  prompt: string;
  questionNumber: number;
  total: number;
}

/**
 * The raised question surface. The decorative sprite sits inside the rounded
 * corner with a positive inset, so it can never poke out of the card.
 */
function QuestionCardBase({ subjectLabel, prompt, questionNumber, total }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.topicChip}>
          <Text style={styles.topicText}>{subjectLabel.toUpperCase()}</Text>
        </View>
        <Text style={styles.counter}>{`Q ${questionNumber} of ${total}`}</Text>
      </View>

      <Text style={styles.prompt} accessibilityRole="header">
        {prompt}
      </Text>

      {IS_COMPACT ? null : (
        <Image source={assets.sprite4} style={styles.decor} accessibilityElementsHidden />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    padding: 20,
    ...theme.shadows.raised,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  topicChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(171, 170, 42, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(171, 170, 42, 0.4)',
  },
  topicText: {
    ...theme.typography.micro,
    color: theme.colors.lab.oliveDeep,
  },
  counter: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  prompt: {
    ...theme.typography.question,
    color: theme.colors.text.primary,
    paddingRight: 56,
  },
  decor: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 44,
    height: 44,
    resizeMode: 'contain',
    opacity: 0.9,
  },
});

export const QuestionCard = memo(QuestionCardBase);
