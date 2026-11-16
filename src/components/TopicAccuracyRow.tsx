import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { subjectSprite } from '../assets';
import { SUBJECT_LABELS } from '../constants/config';
import { theme } from '../constants/theme';
import type { SubjectId } from '../game/types';

interface Props {
  subject: SubjectId;
  correctCount: number;
  answeredCount: number;
}

/** No fabricated percentage: with no attempts the row says so in words. */
function TopicAccuracyRowBase({ subject, correctCount, answeredCount }: Props) {
  const hasData = answeredCount > 0;
  const accuracy = hasData ? Math.round((correctCount / answeredCount) * 100) : 0;

  return (
    <View style={styles.row}>
      <View style={styles.plate}>
        <Image source={subjectSprite[subject]} style={styles.sprite} accessibilityElementsHidden />
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.name}>{SUBJECT_LABELS[subject]}</Text>
          {hasData ? (
            <Text style={styles.accuracy}>{`${accuracy}%`}</Text>
          ) : (
            <Text style={styles.empty}>No answers yet</Text>
          )}
        </View>

        <Text style={styles.detail}>
          {hasData
            ? `${correctCount} correct from ${answeredCount} answers`
            : 'Play a round in this topic to start your record'}
        </Text>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${hasData ? accuracy : 0}%` }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    ...theme.shadows.card,
  },
  plate: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(171, 170, 42, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(171, 170, 42, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  body: {
    flex: 1,
    paddingLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    ...theme.typography.subtitle,
    color: theme.colors.text.primary,
  },
  accuracy: {
    ...theme.typography.question,
    color: theme.colors.lab.action,
  },
  empty: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
  },
  detail: {
    ...theme.typography.caption,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.lab.green,
    marginTop: 10,
    overflow: 'hidden',
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.lab.action,
  },
});

export const TopicAccuracyRow = memo(TopicAccuracyRowBase);
