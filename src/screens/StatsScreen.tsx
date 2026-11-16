import React, { memo, useCallback } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Flame, Target } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs } from '../components/BottomTabs';
import { EmptyState } from '../components/EmptyState';
import { IconButton } from '../components/IconButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatPair } from '../components/StatCard';
import { TopicAccuracyRow } from '../components/TopicAccuracyRow';
import { assets } from '../assets';
import { CONTENT_W } from '../constants/config';
import { theme } from '../constants/theme';
import { accuracyPercent, sumStats } from '../game/statistics';
import type { ProgressState, SubjectId, TabId } from '../game/types';
import { usePressAnimation } from '../hooks/usePressAnimation';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };
const SUBJECTS: SubjectId[] = ['physics', 'chemistry', 'biology'];

interface Props {
  progress: ProgressState;
  selectedYear: number;
  allYears: boolean;
  onToggleScope: () => void;
  onStartQuiz: () => void;
  onNavigate: (tab: TabId) => void;
  onHome: () => void;
}

function ScopeButton({ label, onPress }: { label: string; onPress: () => void }) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(true);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`Change scope. Showing ${label}`}
      style={styles.scopePressable}>
      <Animated.View pointerEvents="box-none" style={[styles.scope, { transform: [{ scale }] }]}>
        <Text style={styles.scopeText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

function StatsScreenBase({
  progress,
  selectedYear,
  allYears,
  onToggleScope,
  onStartQuiz,
  onNavigate,
  onHome,
}: Props) {
  const yearFilter = allYears ? null : selectedYear;
  const overall = sumStats(progress, null, yearFilter);
  const overallAccuracy = accuracyPercent(overall);

  const handleToggle = useCallback(() => onToggleScope(), [onToggleScope]);

  const hasAnyData = overall.answered > 0;
  const showPair = overallAccuracy !== null && progress.completedRounds > 0;

  return (
    <AppBackground variant="stats">
      <ScreenHeader
        title="Your discoveries"
        subtitle={allYears ? 'All years · this device' : `Year ${selectedYear} · this device`}
        leftSlot={
          <IconButton onPress={onHome} accessibilityLabel="Back to topics" image={assets.iconHome} />
        }
        rightSlot={<View />}
      />

      <View style={styles.body}>
        <View style={styles.scopeRow}>
          <ScopeButton label={allYears ? 'All years' : 'Current year'} onPress={handleToggle} />
          <Text style={styles.scopeHint} numberOfLines={1}>
            Tap to switch
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {hasAnyData ? (
            <View style={styles.rows}>
              {SUBJECTS.map(subject => {
                const stat = sumStats(progress, subject, yearFilter);
                return (
                  <TopicAccuracyRow
                    key={subject}
                    subject={subject}
                    correctCount={stat.correct}
                    answeredCount={stat.answered}
                  />
                );
              })}
            </View>
          ) : (
            <EmptyState
              title="Your first discovery starts here"
              body="Play a round to see your topic accuracy."
              actionLabel="START QUIZ"
              onAction={onStartQuiz}
            />
          )}

          {showPair ? (
            <View style={styles.pairWrap}>
              <StatPair
                left={{
                  Icon: Target,
                  value: `${overallAccuracy}%`,
                  label: 'accuracy',
                  valueColor: theme.colors.lab.action,
                }}
                right={{
                  Icon: Flame,
                  value: String(progress.bestStreakOverall),
                  label: 'best streak',
                  valueColor: theme.colors.lab.oliveDeep,
                }}
              />
            </View>
          ) : null}

          {hasAnyData ? (
            <Text style={styles.totals}>
              {`Answers recorded: ${overall.answered} · Rounds completed: ${progress.completedRounds}`}
            </Text>
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.tabs}>
        <BottomTabs selectedTab="stats" onSelect={onNavigate} />
      </View>
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
  scopeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  scopePressable: {
    width: 160,
    height: 48,
  },
  scope: {
    width: 160,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
  },
  scopeText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
  },
  scopeHint: {
    ...theme.typography.caption,
    color: theme.colors.text.tertiary,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  rows: {
    gap: 12,
  },
  pairWrap: {
    marginTop: 14,
  },
  totals: {
    ...theme.typography.caption,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    marginTop: 14,
    textAlign: 'center',
  },
  tabs: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});

export const StatsScreen = memo(StatsScreenBase);
