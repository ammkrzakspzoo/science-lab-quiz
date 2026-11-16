import React, { memo } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { Award, Flame, RotateCcw, Target } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { SecondaryButton } from '../components/SecondaryButton';
import { StatPair } from '../components/StatCard';
import { assets } from '../assets';
import { CONTENT_W, QUESTIONS_PER_ROUND, SUBJECT_LABELS, TONE_MESSAGES } from '../constants/config';
import { theme } from '../constants/theme';
import { BADGE_BY_ID } from '../game/badgeRules';
import type { RoundSummaryData } from '../game/types';
import { useEntryAnimation, usePulse } from '../hooks/useEntryAnimation';

interface Props {
  summary: RoundSummaryData;
  reduceMotion: boolean;
  onPlayAgain: () => void;
  onMenu: () => void;
  onViewBadges: () => void;
}

function toneFor(score: number): string {
  const match = TONE_MESSAGES.find(t => score >= t.min && score <= t.max);
  return match ? match.text : TONE_MESSAGES[0].text;
}

/** The distinct results screen: big score, badge art, no bottom navigation. */
function GameOverScreenBase({ summary, reduceMotion, onPlayAgain, onMenu, onViewBadges }: Props) {
  const entry = useEntryAnimation(0, 12, reduceMotion);
  const heroScale = usePulse(summary.newBadgeIds.join('+') || 'none', !reduceMotion);

  const newBadgeNames = summary.newBadgeIds
    .map(id => BADGE_BY_ID[id]?.name)
    .filter(Boolean)
    .join(' and ');

  const showStats = summary.bestStreak > 0 && summary.score > 0;
  const scoreText = summary.endedEarly
    ? `${summary.score}/${summary.answered}`
    : `${summary.score}/${QUESTIONS_PER_ROUND}`;

  return (
    <AppBackground variant="results">
      <ScreenHeader
        title="Round complete"
        leftSlot={<View />}
        rightSlot={
          <IconButton onPress={onMenu} accessibilityLabel="Back to topics" image={assets.iconHome} />
        }
      />

      <View style={styles.body}>
        <View style={styles.arc} pointerEvents="none">
          {[0, 1, 2, 3, 4].map(i => (
            <View key={`arc-${i}`} style={[styles.arcDot, { marginTop: i === 2 ? 0 : i % 2 ? 8 : 14 }]} />
          ))}
        </View>

        <Animated.View
          pointerEvents="box-none"
          style={[
            styles.hero,
            { opacity: entry.opacity, transform: [{ translateY: entry.translateY }, { scale: heroScale }] },
          ]}>
          <Image source={assets.sprite4} style={styles.heroArt} accessibilityElementsHidden />
          <Text style={styles.score} accessibilityRole="header">
            {scoreText}
          </Text>
          <Text style={styles.accuracy}>{`${summary.accuracy}% accuracy`}</Text>
          <Text style={styles.context}>
            {summary.endedEarly
              ? `${SUBJECT_LABELS[summary.subject]} · Year ${summary.year} · Round ended early`
              : `${SUBJECT_LABELS[summary.subject]} · Year ${summary.year}`}
          </Text>
          <Text style={styles.tone}>{toneFor(summary.score)}</Text>
        </Animated.View>

        {showStats ? (
          <View style={styles.statsWrap}>
            <StatPair
              left={{
                Icon: Target,
                value: scoreText,
                label: 'correct',
                valueColor: theme.colors.lab.oliveDeep,
              }}
              right={{
                Icon: Flame,
                value: String(summary.bestStreak),
                label: 'best streak',
                valueColor: theme.colors.lab.action,
              }}
            />
          </View>
        ) : (
          <View style={styles.plainNote}>
            <Text style={styles.plainText}>Keep exploring to build a streak.</Text>
          </View>
        )}

        {summary.newBadgeIds.length > 0 ? (
          <View style={styles.badgeCard}>
            <View style={styles.badgeIcon}>
              <Award size={22} color={theme.colors.lab.oliveDeep} strokeWidth={2.6} />
            </View>
            <View style={styles.badgeBody}>
              <Text style={styles.badgeLabel}>New lab badge</Text>
              <Text style={styles.badgeName}>{newBadgeNames}</Text>
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.dock}>
        <PrimaryButton label="PLAY AGAIN" onPress={onPlayAgain} Icon={RotateCcw} />
        <View style={styles.secondaryRow}>
          <SecondaryButton label="BACK TO TOPICS" onPress={onMenu} />
        </View>
        <View style={styles.secondaryRow}>
          <SecondaryButton label="VIEW BADGES" onPress={onViewBadges} Icon={Award} />
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: CONTENT_W,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  arc: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  arcDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(40, 41, 224, 0.25)',
  },
  hero: {
    alignItems: 'center',
  },
  heroArt: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  score: {
    ...theme.typography.score,
    color: theme.colors.text.primary,
  },
  accuracy: {
    ...theme.typography.subtitle,
    color: theme.colors.lab.action,
    marginTop: 2,
  },
  context: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
  tone: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
    marginTop: 10,
    textAlign: 'center',
  },
  statsWrap: {
    marginTop: 20,
  },
  plainNote: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  plainText: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  badgeCard: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(171, 170, 42, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(171, 170, 42, 0.45)',
  },
  badgeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  badgeBody: {
    flex: 1,
  },
  badgeLabel: {
    ...theme.typography.micro,
    color: theme.colors.lab.oliveDeep,
  },
  badgeName: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  dock: {
    width: CONTENT_W,
    alignSelf: 'center',
    paddingBottom: 20,
  },
  secondaryRow: {
    marginTop: 12,
  },
});

export const GameOverScreen = memo(GameOverScreenBase);
