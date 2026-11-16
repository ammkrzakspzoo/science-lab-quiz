import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, BackHandler, StyleSheet, Vibration, View } from 'react-native';
import { ConfirmSheet } from './src/components/ConfirmSheet';
import { PauseSheet } from './src/components/PauseSheet';
import { BadgesScreen } from './src/screens/BadgesScreen';
import { ExplanationScreen } from './src/screens/ExplanationScreen';
import { GameOverScreen } from './src/screens/GameOverScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LoaderScreen } from './src/screens/LoaderScreen';
import { MenuScreen } from './src/screens/MenuScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { INITIAL_SUBJECT, INITIAL_YEAR, QUESTIONS_PER_ROUND, SUBJECT_LABELS } from './src/constants/config';
import { theme } from './src/constants/theme';
import { hasEnoughQuestions } from './src/game/questionBank';
import {
  currentQuestion,
  lastAnswer,
  optionText,
  summarise,
} from './src/game/roundEngine';
import { statFor } from './src/game/statistics';
import type { OptionId, RoundState, RoundSummaryData, SubjectId, TabId } from './src/game/types';
import { useLearningProgress } from './src/hooks/useLearningProgress';
import { useQuizRound } from './src/hooks/useQuizRound';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'explanation'
  | 'gameover'
  | 'badges'
  | 'stats'
  | 'settings';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [subject, setSubject] = useState<SubjectId>(INITIAL_SUBJECT);
  const [year, setYear] = useState<number>(INITIAL_YEAR);
  const [hapticsOn, setHapticsOn] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [allYears, setAllYears] = useState(false);
  const [pauseVisible, setPauseVisible] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [summary, setSummary] = useState<RoundSummaryData | null>(null);

  const { progress, saveAnswer, finishRound, resetProgress } = useLearningProgress();

  const hapticsRef = useRef(hapticsOn);
  useEffect(() => {
    hapticsRef.current = hapticsOn;
  }, [hapticsOn]);

  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => {
        if (active) {
          setReduceMotion(enabled);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const handleAnswerAccepted = useCallback(
    (
      answerSubject: SubjectId,
      answerYear: number,
      correct: boolean,
      streak: number,
      badgeIds: string[],
    ) => {
      saveAnswer(answerSubject, answerYear, correct, streak, badgeIds);
      if (correct && hapticsRef.current) {
        Vibration.vibrate(badgeIds.length > 0 ? 40 : 18);
      }
      setScreen('explanation');
    },
    [saveAnswer],
  );

  const handleRoundFinished = useCallback(
    (finished: RoundState) => {
      if (!finished.endedEarly) {
        finishRound(
          finished.subject,
          finished.year,
          finished.questions.map(q => q.id),
        );
      }
      setSummary(summarise(finished));
      setPauseVisible(false);
      setConfirmEnd(false);
      setScreen('gameover');
    },
    [finishRound],
  );

  const unlockedBadgeIds = Object.keys(progress.badges);

  const { round, pendingBadgeIds, lastQuestion, start, answer, proceed, stopRound, clearRound } =
    useQuizRound({
      unlockedBadgeIds,
      onAnswerAccepted: handleAnswerAccepted,
      onRoundFinished: handleRoundFinished,
    });

  const roundActive = round !== null && round.phase !== 'finished';
  const contentUnavailable = !hasEnoughQuestions(subject, year, QUESTIONS_PER_ROUND);

  const startRound = useCallback(
    (nextSubject: SubjectId, nextYear: number) => {
      const ok = start(nextSubject, nextYear, progress.lastRoundQuestionIds);
      if (ok) {
        setSummary(null);
        setScreen('game');
      }
      return ok;
    },
    [progress.lastRoundQuestionIds, start],
  );

  const handlePlay = useCallback(() => {
    if (roundActive && round) {
      setScreen(round.phase === 'explanation' ? 'explanation' : 'game');
      return;
    }
    startRound(subject, year);
  }, [round, roundActive, startRound, subject, year]);

  const handleAnswer = useCallback((optionId: OptionId) => answer(optionId), [answer]);

  const handleContinue = useCallback(() => {
    if (!lastQuestion) {
      setScreen('game');
    }
    proceed();
  }, [lastQuestion, proceed]);

  const handlePlayAgain = useCallback(() => {
    clearRound();
    startRound(summary ? summary.subject : subject, summary ? summary.year : year);
  }, [clearRound, startRound, subject, summary, year]);

  const goMenu = useCallback(() => {
    clearRound();
    setPauseVisible(false);
    setConfirmEnd(false);
    setScreen('menu');
  }, [clearRound]);

  const handleNavigate = useCallback((tab: TabId) => {
    setScreen(tab === 'topics' ? 'menu' : tab);
  }, []);

  const openPause = useCallback(() => setPauseVisible(true), []);
  const closePause = useCallback(() => setPauseVisible(false), []);
  const askEndRound = useCallback(() => {
    setPauseVisible(false);
    setConfirmEnd(true);
  }, []);
  const cancelEndRound = useCallback(() => {
    setConfirmEnd(false);
    setPauseVisible(true);
  }, []);
  const confirmEndRound = useCallback(() => {
    setConfirmEnd(false);
    stopRound();
  }, [stopRound]);

  const handleYearChange = useCallback(
    (nextYear: number) => {
      if (!roundActive) {
        setYear(nextYear);
      }
    },
    [roundActive],
  );

  const handleSelectTopic = useCallback(
    (nextSubject: SubjectId) => {
      if (!roundActive) {
        setSubject(nextSubject);
      }
    },
    [roundActive],
  );

  const handleResetProgress = useCallback(() => {
    clearRound();
    resetProgress();
    setSummary(null);
  }, [clearRound, resetProgress]);

  const resumeRound = useCallback(() => {
    if (round) {
      setScreen(round.phase === 'explanation' ? 'explanation' : 'game');
    }
  }, [round]);

  const toggleScope = useCallback(() => setAllYears(current => !current), []);

  // Android back: sheets first, then secondary tabs, then the pause flow.
  useEffect(() => {
    const onBack = () => {
      if (confirmEnd) {
        cancelEndRound();
        return true;
      }
      if (pauseVisible) {
        closePause();
        return true;
      }
      if (screen === 'badges' || screen === 'stats' || screen === 'settings') {
        setScreen('menu');
        return true;
      }
      if (screen === 'gameover') {
        goMenu();
        return true;
      }
      if (screen === 'game' || screen === 'explanation') {
        setPauseVisible(true);
        return true;
      }
      if (screen === 'loader') {
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => subscription.remove();
  }, [cancelEndRound, closePause, confirmEnd, goMenu, pauseVisible, screen]);

  const yearStat = statFor(progress, subject, year);

  const renderScreen = () => {
    if (screen === 'loader') {
      return <LoaderScreen onComplete={() => setScreen('menu')} />;
    }

    if (screen === 'game' && round) {
      const question = currentQuestion(round);
      return (
        <GameScreen
          subjectLabel={SUBJECT_LABELS[round.subject]}
          year={round.year}
          index={round.index}
          total={round.questions.length}
          prompt={question.prompt}
          options={question.shuffledOptions}
          correctCount={round.correctCount}
          currentStreak={round.currentStreak}
          phase={round.phase}
          reduceMotion={reduceMotion}
          onAnswer={handleAnswer}
          onPause={openPause}
          onGameOver={goMenu}
        />
      );
    }

    if (screen === 'explanation' && round) {
      const question = currentQuestion(round);
      const accepted = lastAnswer(round);
      return (
        <ExplanationScreen
          index={round.index}
          total={round.questions.length}
          isCorrect={Boolean(accepted?.correct)}
          prompt={question.prompt}
          chosenText={optionText(question, accepted ? accepted.chosenOptionId : null)}
          correctText={optionText(question, question.correctOptionId)}
          explanation={question.explanation}
          takeaway={question.takeaway}
          streak={round.currentStreak}
          newBadgeIds={pendingBadgeIds}
          isLastQuestion={lastQuestion}
          reduceMotion={reduceMotion}
          onContinue={handleContinue}
          onPause={openPause}
        />
      );
    }

    if (screen === 'gameover' && summary) {
      return (
        <GameOverScreen
          summary={summary}
          reduceMotion={reduceMotion}
          onPlayAgain={handlePlayAgain}
          onMenu={goMenu}
          onViewBadges={() => {
            clearRound();
            setScreen('badges');
          }}
        />
      );
    }

    if (screen === 'badges') {
      return (
        <BadgesScreen
          badges={progress.badges}
          bestStreak={progress.bestStreakOverall}
          reduceMotion={reduceMotion}
          onNavigate={handleNavigate}
          onHome={() => setScreen('menu')}
        />
      );
    }

    if (screen === 'stats') {
      return (
        <StatsScreen
          progress={progress}
          selectedYear={year}
          allYears={allYears}
          onToggleScope={toggleScope}
          onStartQuiz={() => setScreen('menu')}
          onNavigate={handleNavigate}
          onHome={() => setScreen('menu')}
        />
      );
    }

    if (screen === 'settings') {
      return (
        <SettingsScreen
          selectedYear={year}
          roundActive={roundActive}
          hapticsOn={hapticsOn}
          reduceMotion={reduceMotion}
          onYearChange={handleYearChange}
          onHapticsChange={setHapticsOn}
          onMotionChange={setReduceMotion}
          onResetProgress={handleResetProgress}
          onResume={resumeRound}
          onNavigate={handleNavigate}
          onHome={() => setScreen('menu')}
        />
      );
    }

    return (
      <MenuScreen
        selectedSubject={subject}
        selectedYear={year}
        completedRounds={progress.completedRounds}
        bestStreak={yearStat.bestStreak || progress.bestStreakOverall}
        contentUnavailable={contentUnavailable}
        reduceMotion={reduceMotion}
        onSelectTopic={handleSelectTopic}
        onPlay={handlePlay}
        onOpenYear={() => setScreen('settings')}
        onNavigate={handleNavigate}
      />
    );
  };

  const sheetsAllowed = screen === 'game' || screen === 'explanation';

  return (
    <View style={styles.root}>
      {renderScreen()}

      {sheetsAllowed && pauseVisible ? (
        <PauseSheet
          visible
          onResume={closePause}
          onEndRound={askEndRound}
          reduceMotion={reduceMotion}
        />
      ) : null}

      {sheetsAllowed && confirmEnd ? (
        <ConfirmSheet
          visible
          title="End this round?"
          message="Your answers so far are kept in your statistics, but the round will not count as completed."
          cancelLabel="KEEP PLAYING"
          confirmLabel="END ROUND"
          onCancel={cancelEndRound}
          onConfirm={confirmEndRound}
          reduceMotion={reduceMotion}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
});
