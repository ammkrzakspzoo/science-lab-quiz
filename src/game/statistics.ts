import type { ProgressState, SubjectId, TopicStat } from './types';

export const EMPTY_STAT: TopicStat = { correct: 0, answered: 0, rounds: 0, bestStreak: 0 };

export const EMPTY_PROGRESS: ProgressState = {
  stats: {},
  badges: {},
  bestStreakOverall: 0,
  completedRounds: 0,
  lastRoundQuestionIds: [],
};

export function statKey(subject: SubjectId, year: number): string {
  return `${subject}:${year}`;
}

export function statFor(progress: ProgressState, subject: SubjectId, year: number): TopicStat {
  return progress.stats[statKey(subject, year)] ?? EMPTY_STAT;
}

/** Raw counts summed before dividing, so filters always agree with each other. */
export function sumStats(
  progress: ProgressState,
  subject: SubjectId | null,
  year: number | null,
): TopicStat {
  return Object.keys(progress.stats).reduce<TopicStat>(
    (acc, key) => {
      const [keySubject, keyYear] = key.split(':');
      if (subject && keySubject !== subject) {
        return acc;
      }
      if (year !== null && Number(keyYear) !== year) {
        return acc;
      }
      const stat = progress.stats[key];
      return {
        correct: acc.correct + stat.correct,
        answered: acc.answered + stat.answered,
        rounds: acc.rounds + stat.rounds,
        bestStreak: Math.max(acc.bestStreak, stat.bestStreak),
      };
    },
    { ...EMPTY_STAT },
  );
}

/** Integer percent, or null when there is nothing to report honestly. */
export function accuracyPercent(stat: TopicStat): number | null {
  if (stat.answered <= 0) {
    return null;
  }
  return Math.round((stat.correct / stat.answered) * 100);
}

export function recordAnswer(
  progress: ProgressState,
  subject: SubjectId,
  year: number,
  correct: boolean,
  streak: number,
): ProgressState {
  const key = statKey(subject, year);
  const previous = progress.stats[key] ?? EMPTY_STAT;

  return {
    ...progress,
    stats: {
      ...progress.stats,
      [key]: {
        correct: previous.correct + (correct ? 1 : 0),
        answered: previous.answered + 1,
        rounds: previous.rounds,
        bestStreak: Math.max(previous.bestStreak, streak),
      },
    },
    bestStreakOverall: Math.max(progress.bestStreakOverall, streak),
  };
}

export function unlockBadges(
  progress: ProgressState,
  badgeIds: readonly string[],
  subject: SubjectId,
  year: number,
): ProgressState {
  if (badgeIds.length === 0) {
    return progress;
  }
  const badges = { ...progress.badges };
  const earnedAt = Date.now();
  badgeIds.forEach(id => {
    if (!badges[id]) {
      badges[id] = { earnedAt, subject, year };
    }
  });
  return { ...progress, badges };
}

export function completeRound(
  progress: ProgressState,
  subject: SubjectId,
  year: number,
  questionIds: readonly string[],
): ProgressState {
  const key = statKey(subject, year);
  const previous = progress.stats[key] ?? EMPTY_STAT;

  return {
    ...progress,
    completedRounds: progress.completedRounds + 1,
    lastRoundQuestionIds: questionIds.slice(),
    stats: {
      ...progress.stats,
      [key]: { ...previous, rounds: previous.rounds + 1 },
    },
  };
}

export function rememberRoundQuestions(
  progress: ProgressState,
  questionIds: readonly string[],
): ProgressState {
  return { ...progress, lastRoundQuestionIds: questionIds.slice() };
}
