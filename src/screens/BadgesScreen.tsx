import React, { memo, useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppBackground } from '../components/AppBackground';
import { BadgeDetailSheet } from '../components/BadgeDetailSheet';
import { BadgeTile } from '../components/BadgeTile';
import { BottomTabs } from '../components/BottomTabs';
import { IconButton } from '../components/IconButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { assets } from '../assets';
import { CONTENT_W } from '../constants/config';
import { theme } from '../constants/theme';
import { BADGES } from '../game/badgeRules';
import type { BadgeRecord, TabId } from '../game/types';

const GRID_GAP = 12;
const TILE_W = Math.floor((CONTENT_W - GRID_GAP) / 2);

interface Props {
  badges: Record<string, BadgeRecord>;
  bestStreak: number;
  reduceMotion: boolean;
  onNavigate: (tab: TabId) => void;
  onHome: () => void;
}

function BadgesScreenBase({ badges, bestStreak, reduceMotion, onNavigate, onHome }: Props) {
  const [openBadgeId, setOpenBadgeId] = useState<string | null>(null);

  const handleOpen = useCallback((badgeId: string) => setOpenBadgeId(badgeId), []);
  const handleClose = useCallback(() => setOpenBadgeId(null), []);

  const unlockedCount = BADGES.filter(badge => badges[badge.id]).length;
  const openBadge = BADGES.find(badge => badge.id === openBadgeId) ?? null;

  return (
    <AppBackground variant="badges">
      <ScreenHeader
        title="Lab badges"
        subtitle="Good streaks make great discoveries."
        leftSlot={
          <IconButton onPress={onHome} accessibilityLabel="Back to topics" image={assets.iconHome} />
        }
        rightSlot={<View />}
      />

      <View style={styles.body}>
        <Text style={styles.progress}>{`${unlockedCount} of ${BADGES.length} unlocked`}</Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}>
          {BADGES.map(badge => (
            <BadgeTile
              key={badge.id}
              badge={badge}
              unlocked={Boolean(badges[badge.id])}
              width={TILE_W}
              onPress={handleOpen}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.tabs}>
        <BottomTabs selectedTab="badges" onSelect={onNavigate} />
      </View>

      {openBadge ? (
        <BadgeDetailSheet
          visible
          badge={openBadge}
          record={badges[openBadge.id]}
          bestStreak={bestStreak}
          onClose={handleClose}
          reduceMotion={reduceMotion}
        />
      ) : null}
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: CONTENT_W,
    alignSelf: 'center',
    paddingTop: 12,
  },
  progress: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.secondary,
    marginBottom: 12,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    paddingBottom: 12,
  },
  tabs: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});

export const BadgesScreen = memo(BadgesScreenBase);
