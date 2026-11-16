import React, { memo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Award } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { BADGE_BY_ID } from '../game/badgeRules';
import { usePulse } from '../hooks/useEntryAnimation';

interface Props {
  badgeIds: string[];
  reduceMotion: boolean;
}

/** Non-blocking, at most one announcement per answer, at most two badges. */
function BadgeAnnouncementBase({ badgeIds, reduceMotion }: Props) {
  const scale = usePulse(badgeIds.join('+'), !reduceMotion);

  if (badgeIds.length === 0) {
    return null;
  }

  const names = badgeIds
    .map(id => BADGE_BY_ID[id]?.name)
    .filter(Boolean)
    .join(' and ');

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.card, { transform: [{ scale }] }]}
      accessibilityLiveRegion="polite">
      <View style={styles.iconWrap}>
        <Award size={22} color={theme.colors.lab.oliveDeep} strokeWidth={2.6} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>New lab badge</Text>
        <Text style={styles.names}>{names}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(171, 170, 42, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(171, 170, 42, 0.45)',
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  body: {
    flex: 1,
  },
  title: {
    ...theme.typography.micro,
    color: theme.colors.lab.oliveDeep,
  },
  names: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
});

export const BadgeAnnouncement = memo(BadgeAnnouncementBase);
