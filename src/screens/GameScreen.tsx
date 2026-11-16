import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AnswerOption } from '../components/AnswerOption';
import type { AnswerState } from '../components/AnswerOption';
import { AppBackground } from '../components/AppBackground';
import { IconButton } from '../components/IconButton';
import { QuestionCard } from '../components/QuestionCard';
import { QuestionProgress } from '../components/QuestionProgress';
import { RoundCounters } from '../components/RoundCounters';
import { ScreenHeader } from '../components/ScreenHeader';
import { assets } from '../assets';
import { CONTENT_W, FEEDBACK_MS } from '../constants/config';
import { theme } from '../constants/theme';
import type { AnswerOptionData, OptionId, RoundPhase } from '../game/types';

const LETTERS = ['A', 'B', 'C', 'D'];

interface Props {
  subjectLabel: string;
  year: number;
  index: number;
  total: number;
  prompt: string;
  options: AnswerOptionData[];
  correctCount: number;
  currentStreak: number;
  phase: RoundPhase;
  reduceMotion: boolean;
  onAnswer: (optionId: OptionId) => void;
  onPause: () => void;
  onGameOver: () => void;
}

/**
 * Quiz round. Tapping an answer locks every choice immediately; the parent
 * opens the explanation once the short feedback transition has run.
 */
function GameScreenBase({
  subjectLabel,
  year,
  index,
  total,
  prompt,
  options,
  correctCount,
  currentStreak,
  phase,
  reduceMotion,
  onAnswer,
  onPause,
  onGameOver,
}: Props) {
  const [chosen, setChosen] = useState<OptionId | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answerRef = useRef(onAnswer);
  const gameOverRef = useRef(onGameOver);

  useEffect(() => {
    answerRef.current = onAnswer;
  }, [onAnswer]);
  useEffect(() => {
    gameOverRef.current = onGameOver;
  }, [onGameOver]);

  // A new question clears the local lock.
  useEffect(() => {
    setChosen(null);
  }, [index]);

  // Safety net: a finished round can never stay on the quiz screen.
  useEffect(() => {
    if (phase === 'finished') {
      gameOverRef.current();
    }
  }, [phase]);

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  const handleAnswer = useCallback((optionId: OptionId) => {
    if (timerRef.current) {
      return;
    }
    setChosen(optionId);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      answerRef.current(optionId);
    }, FEEDBACK_MS);
  }, []);

  const locked = chosen !== null || phase !== 'question';

  return (
    <AppBackground variant="quiz">
      <ScreenHeader
        size="tall"
        title={subjectLabel}
        subtitle={`Year ${year}`}
        leftSlot={
          <IconButton
            onPress={onPause}
            accessibilityLabel="Pause round"
            image={assets.iconPause}
          />
        }
        rightSlot={
          <View style={styles.counterBadge}>
            <Text style={styles.counterText}>{`${index + 1}/${total}`}</Text>
          </View>
        }
      />

      <View style={styles.progressWrap}>
        <QuestionProgress index={index} total={total} />
      </View>

      <View style={styles.questionArea}>
        <QuestionCard
          subjectLabel={subjectLabel}
          prompt={prompt}
          questionNumber={index + 1}
          total={total}
        />
        <View style={styles.countersWrap}>
          <RoundCounters
            correctCount={correctCount}
            currentStreak={currentStreak}
            reduceMotion={reduceMotion}
          />
        </View>
      </View>

      <LinearGradient
        colors={[...theme.gradients.controls]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.controls}>
        <View style={styles.answerList} accessibilityRole="radiogroup">
          {options.map((option, i) => {
            const state: AnswerState = chosen === option.id ? 'chosen' : 'idle';
            return (
              <AnswerOption
                key={option.id}
                optionId={option.id}
                letter={LETTERS[i]}
                text={option.text}
                state={state}
                disabled={locked}
                onPress={handleAnswer}
              />
            );
          })}
        </View>
      </LinearGradient>
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
  progressWrap: {
    width: CONTENT_W,
    alignSelf: 'center',
    marginTop: 12,
  },
  questionArea: {
    flex: 1,
    width: CONTENT_W,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  countersWrap: {
    marginTop: 16,
  },
  controls: {
    width: '100%',
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    paddingTop: 16,
    paddingBottom: 16,
    ...theme.shadows.panelUp,
  },
  answerList: {
    width: CONTENT_W,
    alignSelf: 'center',
    gap: 8,
  },
});

export const GameScreen = memo(GameScreenBase);
