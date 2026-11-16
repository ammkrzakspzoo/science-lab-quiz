import React, { memo, useCallback } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CalendarDays, Play, Settings } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BottomTabs } from '../components/BottomTabs';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { TopicCard } from '../components/TopicCard';
import { assets } from '../assets';
import { CONTENT_W, GUTTER, HERO_SIZE, QUESTIONS_PER_ROUND, SUBJECT_LABELS } from '../constants/config';
import { theme } from '../constants/theme';
import { useEntryAnimation } from '../hooks/useEntryAnimation';
import { usePressAnimation } from '../hooks/usePressAnimation';
import type { SubjectId, TabId } from '../game/types';

const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 };

const TOPICS: Array<{ id: SubjectId; title: string; description: string }> = [
  { id: 'physics', title: 'Physics', description: 'Forces, light and energy' },
  { id: 'chemistry', title: 'Chemistry', description: 'Materials and changes' },
  { id: 'biology', title: 'Biology', description: 'Living things and habitats' },
];

interface Props {
  selectedSubject: SubjectId;
  selectedYear: number;
  completedRounds: number;
  bestStreak: number;
  contentUnavailable: boolean;
  reduceMotion: boolean;
  onSelectTopic: (subject: SubjectId) => void;
  onPlay: () => void;
  onOpenYear: () => void;
  onNavigate: (tab: TabId) => void;
}

function YearControl({
  year,
  onPress,
}: {
  year: number;
  onPress: () => void;
}) {
  const { scale, onPressIn, onPressOut } = usePressAnimation(true);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={`School year: Year ${year}. Opens settings to change it.`}
      style={styles.yearPressable}>
      <Animated.View pointerEvents="box-none" style={[styles.yearRow, { transform: [{ scale }] }]}>
        <CalendarDays size={24} color={theme.colors.lab.action} strokeWidth={2.2} />
        <Text style={styles.yearText}>{`School year: Year ${year}`}</Text>
        <Text style={styles.yearChange}>CHANGE</Text>
      </Animated.View>
    </Pressable>
  );
}

function MenuScreenBase({
  selectedSubject,
  selectedYear,
  completedRounds,
  bestStreak,
  contentUnavailable,
  reduceMotion,
  onSelectTopic,
  onPlay,
  onOpenYear,
  onNavigate,
}: Props) {
  const hero = useEntryAnimation(0, 10, reduceMotion);
  const list = useEntryAnimation(60, 10, reduceMotion);

  const openSettings = useCallback(() => onNavigate('settings'), [onNavigate]);

  const hasLearning = completedRounds > 0 && bestStreak > 0;
  const summaryText = hasLearning
    ? `Rounds completed: ${completedRounds}  ·  Best streak: ${bestStreak}`
    : 'Choose a topic, then press PLAY.';

  return (
    <AppBackground variant="topics">
      <ScreenHeader
        title="Your science lab"
        leftSlot={<View />}
        rightSlot={
          <IconButton onPress={openSettings} accessibilityLabel="Settings">
            <Settings size={24} color={theme.colors.text.primary} strokeWidth={2.2} />
          </IconButton>
        }
      />

      <View style={styles.body}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.heroBlock, { opacity: hero.opacity, transform: [{ translateY: hero.translateY }] }]}>
          <Image source={assets.logo} style={styles.hero} accessibilityElementsHidden />
          <Text style={styles.title} accessibilityRole="header">
            What will you discover?
          </Text>
          <Text style={styles.subtitle}>
            {`${QUESTIONS_PER_ROUND} questions. Learn after every answer.`}
          </Text>
        </Animated.View>

        <YearControl year={selectedYear} onPress={onOpenYear} />

        <Animated.View
          pointerEvents="box-none"
          style={[styles.topicList, { opacity: list.opacity, transform: [{ translateY: list.translateY }] }]}>
          {TOPICS.map(topic => (
            <TopicCard
              key={topic.id}
              subject={topic.id}
              title={topic.title}
              description={topic.description}
              selected={topic.id === selectedSubject}
              onSelect={onSelectTopic}
            />
          ))}
        </Animated.View>

        <View style={styles.strip}>
          <Text style={styles.stripText} numberOfLines={2}>
            {contentUnavailable
              ? 'This topic is getting ready for your year. Choose another topic.'
              : summaryText}
          </Text>
        </View>
      </View>

      <View style={styles.dock}>
        <Text style={styles.hint} numberOfLines={1}>
          {`${SUBJECT_LABELS[selectedSubject]} / Year ${selectedYear} / ${QUESTIONS_PER_ROUND} questions`}
        </Text>
        <PrimaryButton
          label="PLAY"
          onPress={onPlay}
          Icon={Play}
          disabled={contentUnavailable}
          accessibilityLabel={`Play ${SUBJECT_LABELS[selectedSubject]} round for year ${selectedYear}`}
        />
      </View>

      <View style={styles.tabs}>
        <BottomTabs selectedTab="topics" onSelect={onNavigate} />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    width: CONTENT_W,
    alignSelf: 'center',
    paddingTop: 10,
  },
  heroBlock: {
    alignItems: 'center',
  },
  hero: {
    width: HERO_SIZE,
    height: HERO_SIZE,
    resizeMode: 'contain',
  },
  title: {
    ...theme.typography.title,
    fontSize: 26,
    lineHeight: 32,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginTop: 6,
  },
  subtitle: {
    ...theme.typography.support,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
  yearPressable: {
    width: '100%',
    height: 48,
    marginTop: 12,
  },
  yearRow: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  yearText: {
    ...theme.typography.bodyStrong,
    color: theme.colors.text.primary,
    flex: 1,
  },
  yearChange: {
    ...theme.typography.micro,
    color: theme.colors.lab.action,
  },
  topicList: {
    marginTop: 12,
    gap: 8,
  },
  strip: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(199, 221, 176, 0.55)',
    borderWidth: 1,
    borderColor: theme.colors.ui.borderStrong,
  },
  stripText: {
    ...theme.typography.caption,
    fontSize: 13,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  dock: {
    width: CONTENT_W,
    alignSelf: 'center',
    paddingTop: 4,
  },
  hint: {
    ...theme.typography.caption,
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 10,
  },
  tabs: {
    paddingTop: 10,
    paddingBottom: 16,
  },
});

export const MenuScreen = memo(MenuScreenBase);
