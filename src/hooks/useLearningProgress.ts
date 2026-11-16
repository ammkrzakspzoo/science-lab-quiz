import { useCallback, useState } from 'react';
import {
  EMPTY_PROGRESS,
  completeRound,
  recordAnswer,
  rememberRoundQuestions,
  unlockBadges,
} from '../game/statistics';
import type { ProgressState, SubjectId } from '../game/types';

/**
 * Learning progress for this device session. Every action returns a brand new
 * object, so screens that read a single slice re-render only when it changes.
 */
export function useLearningProgress() {
  const [progress, setProgress] = useState<ProgressState>(EMPTY_PROGRESS);

  const saveAnswer = useCallback(
    (subject: SubjectId, year: number, correct: boolean, streak: number, badgeIds: string[]) => {
      setProgress(current => {
        const withAnswer = recordAnswer(current, subject, year, correct, streak);
        return unlockBadges(withAnswer, badgeIds, subject, year);
      });
    },
    [],
  );

  const finishRound = useCallback(
    (subject: SubjectId, year: number, questionIds: string[]) => {
      setProgress(current => completeRound(current, subject, year, questionIds));
    },
    [],
  );

  const noteRoundQuestions = useCallback((questionIds: string[]) => {
    setProgress(current => rememberRoundQuestions(current, questionIds));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(EMPTY_PROGRESS);
  }, []);

  return { progress, saveAnswer, finishRound, noteRoundQuestions, resetProgress };
}
