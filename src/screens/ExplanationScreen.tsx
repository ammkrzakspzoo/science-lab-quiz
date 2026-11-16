import React, { memo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, Trophy } from 'lucide-react-native';
import { AppBackground } from '../components/AppBackground';
import { BadgeAnnouncement } from '../components/BadgeAnnouncement';
import { ExplanationCard } from '../components/ExplanationCard';
import { FeedbackPanel } from '../components/FeedbackPanel';
import { IconButton } from '../components/IconButton';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { assets } from '../assets';
import { CONTENT_W } from '../constants/config';
import { theme } from '../constants/theme';

interface Props {
  index: number;
  total: number;
  isCorrect: boolean;
  prompt: string;
  chosenText: string;
  correctText: string;
  explanation: string;
  takeaway: string;
  streak: number;
  newBadgeIds: string[];
  isLastQuestion: boolean;
  reduceMotion: boolean;
  onContinue: () => void;
  onPause: () => void;
}

/** Learn-why step. Only the content region scrolls; the action stays put. */
function ExplanationScreenBase({
  index,
  total,
  isCorrect,
  prompt,
  chosenText,
  correctText,
  explanation,
  takeaway,
  streak,
  newBadgeIds,
  isLastQuestion,
  reduceMotion,
  onContinue,
  onPause,
}: Props) {
  return (
    <AppBackground variant="explanation">
      <ScreenHeader
        size="tall"
        title="Answer explanation"
        leftSlot={
          <IconButton onPress={onPause} accessibilityLabel="Pause round" image={assets.iconPause} />
        }
        rightSlot={
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{`${index + 1}/${total}`}</Text>
          </View>
        }
      />

      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <FeedbackPanel
            isCorrect={isCorrect}
            prompt={prompt}
            chosenText={chosenText}
            correctText={correctText}
            reduceMotion={reduceMotion}
          />

          <View style={styles.spacer} />

          <ExplanationCard explanation={explanation} takeaway={takeaway} streak={streak} />

          {newBadgeIds.length > 0 ? (
            <View style={styles.spacer}>
              <BadgeAnnouncement badgeIds={newBadgeIds} reduceMotion={reduceMotion} />
            </View>
          ) : null}
        </ScrollView>
      </View>

      <View style={styles.dock}>
        <Text style={styles.hint} numberOfLines={1}>
          Take your time. Continue when you are ready.
        </Text>
        <PrimaryButton
          label={isLastQuestion ? 'VIEW RESULTS' : 'NEXT QUESTION'}
          onPress={onContinue}
          Icon={isLastQuestion ? Trophy : ArrowRight}
        />
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  counterBadge: {
    minWidth: 48,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  body: {
    flex: 1,
    width: CONTENT_W,
    alignSelf: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 14,
    paddingBottom: 14,
  },
  spacer: {
    marginTop: 12,
  },
  dock: {
    width: CONTENT_W,
    alignSelf: 'center',
    paddingTop: 4,
    paddingBottom: 20,
  },
  hint: {
    ...theme.typography.caption,
    fontSize: 14,
    fontWeight: '400',
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export const ExplanationScreen = memo(ExplanationScreenBase);
