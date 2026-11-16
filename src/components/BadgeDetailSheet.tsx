import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { badgeProgress } from '../game/badgeRules';
import type { BadgeDefinition, BadgeRecord } from '../game/types';
import { PrimaryButton } from './PrimaryButton';
import { SheetFrame } from './SheetFrame';

interface Props {
  visible: boolean;
  badge: BadgeDefinition;
  record: BadgeRecord | undefined;
  bestStreak: number;
  onClose: () => void;
  reduceMotion?: boolean;
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function BadgeDetailSheetBase({
  visible,
  badge,
  record,
  bestStreak,
  onClose,
  reduceMotion,
}: Props) {
  return (
    <SheetFrame
      visible={visible}
      title={badge.name}
      message={badge.rule}
      onRequestClose={onClose}
      reduceMotion={reduceMotion}>
      <View style={styles.info}>
        {record ? (
          <Text style={styles.line}>{`Earned on ${formatDate(record.earnedAt)}`}</Text>
        ) : (
          <Text style={styles.line}>{badgeProgress(badge, bestStreak)}</Text>
        )}
        <Text style={styles.note}>
          Badges stay on this device and are never relocked when you change school year.
        </Text>
      </View>
      <PrimaryButton label="CLOSE" onPress={onClose} />
    </SheetFrame>
  );
}

const styles = StyleSheet.create({
  info: {
    paddingBottom: 4,
  },
  line: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  note: {
    ...theme.typography.caption,
    fontWeight: '400',
    color: theme.colors.text.tertiary,
    marginTop: 6,
  },
});

export const BadgeDetailSheet = memo(BadgeDetailSheetBase);
