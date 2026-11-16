import { useCallback, useEffect, useRef, useState } from 'react';
import { evaluateBadges } from '../game/badgeRules';
import {
  acceptAnswer,
  advance,
  createRound,
  endEarly,
  isLastQuestion,
} from '../game/roundEngine';
import type { OptionId, RoundState, SubjectId } from '../game/types';

interface Options {
  /** Badge ids already unlocked, read through a ref so callbacks stay fresh. */
  unlockedBadgeIds: string[];
  onAnswerAccepted: (
    subject: SubjectId,
    year: number,
    correct: boolean,
    streak: number,
    newBadgeIds: string[],
  ) => void;
  onRoundFinished: (round: RoundState) => void;
}

/**
 * Round controller: selection, answer locking, scoring, badges and phase.
 * It owns no navigation — App.tsx reacts to the phase it reports.
 *
 * The live round is mirrored in a ref so every callback reads ground truth
 * without re-creating itself, and no side effect ever runs inside a state
 * updater.
 */
export function useQuizRound({ unlockedBadgeIds, onAnswerAccepted, onRoundFinished }: Options) {
  const [round, setRound] = useState<RoundState | null>(null);
  const [pendingBadgeIds, setPendingBadgeIds] = useState<string[]>([]);

  const roundRef = useRef<RoundState | null>(null);
  const unlockedRef = useRef(unlockedBadgeIds);
  const answerRef = useRef(onAnswerAccepted);
  const finishRef = useRef(onRoundFinished);
  const busyRef = useRef(false);

  useEffect(() => {
    unlockedRef.current = unlockedBadgeIds;
  }, [unlockedBadgeIds]);
  useEffect(() => {
    answerRef.current = onAnswerAccepted;
  }, [onAnswerAccepted]);
  useEffect(() => {
    finishRef.current = onRoundFinished;
  }, [onRoundFinished]);

  const apply = useCallback((next: RoundState | null) => {
    roundRef.current = next;
    setRound(next);
  }, []);

  const start = useCallback(
    (subject: SubjectId, year: number, previousIds: string[]) => {
      const next = createRound(subject, year, previousIds);
      if (!next) {
        return false;
      }
      busyRef.current = false;
      setPendingBadgeIds([]);
      apply(next);
      return true;
    },
    [apply],
  );

  const answer = useCallback(
    (optionId: OptionId) => {
      const current = roundRef.current;
      if (busyRef.current || !current || current.phase !== 'question') {
        return;
      }
      busyRef.current = true;

      const answered = acceptAnswer(current, optionId);
      if (answered === current) {
        busyRef.current = false;
        return;
      }

      const earned = evaluateBadges(answered, unlockedRef.current);
      const accepted = answered.answers[answered.answers.length - 1];
      const next: RoundState = {
        ...answered,
        newBadgeIds: [...answered.newBadgeIds, ...earned],
      };

      apply(next);
      setPendingBadgeIds(earned);
      answerRef.current(next.subject, next.year, accepted.correct, next.currentStreak, earned);
      busyRef.current = false;
    },
    [apply],
  );

  const proceed = useCallback(() => {
    const current = roundRef.current;
    if (busyRef.current || !current || current.phase !== 'explanation') {
      return;
    }
    busyRef.current = true;

    const next = advance(current);
    apply(next);
    setPendingBadgeIds([]);
    if (next.phase === 'finished') {
      finishRef.current(next);
    }
    busyRef.current = false;
  }, [apply]);

  const stopRound = useCallback(() => {
    const current = roundRef.current;
    if (!current || current.phase === 'finished') {
      return;
    }
    const next = endEarly(current);
    apply(next);
    setPendingBadgeIds([]);
    finishRef.current(next);
  }, [apply]);

  const clearRound = useCallback(() => {
    busyRef.current = false;
    setPendingBadgeIds([]);
    apply(null);
  }, [apply]);

  const lastQuestion = round ? isLastQuestion(round) : false;

  return { round, pendingBadgeIds, lastQuestion, start, answer, proceed, stopRound, clearRound };
}
