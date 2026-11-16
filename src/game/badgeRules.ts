import {
  BADGE_STREAK_CURIOUS,
  BADGE_STREAK_STEADY,
  PERFECT_ROUND_SCORE,
} from '../constants/config';
import type { BadgeDefinition, RoundState } from './types';

export const BADGES: BadgeDefinition[] = [
  {
    id: 'curious_mind',
    name: 'Curious Mind',
    rule: 'Reach a streak of 3 correct answers in one round.',
    iconKey: 'spark',
    streak: BADGE_STREAK_CURIOUS,
  },
  {
    id: 'steady_scientist',
    name: 'Steady Scientist',
    rule: 'Reach a streak of 5 correct answers in one round.',
    iconKey: 'flask',
    streak: BADGE_STREAK_STEADY,
  },
  {
    id: 'perfect_lab',
    name: 'Perfect Lab',
    rule: 'Answer all 10 questions correctly in one round.',
    iconKey: 'medal',
    perfect: true,
  },
  {
    id: 'physics_pro',
    name: 'Physics Pro',
    rule: 'Reach a streak of 5 in a Physics round.',
    iconKey: 'atom',
    subject: 'physics',
    streak: BADGE_STREAK_STEADY,
  },
  {
    id: 'chemistry_spark',
    name: 'Chemistry Spark',
    rule: 'Reach a streak of 5 in a Chemistry round.',
    iconKey: 'bubbles',
    subject: 'chemistry',
    streak: BADGE_STREAK_STEADY,
  },
  {
    id: 'biology_explorer',
    name: 'Biology Explorer',
    rule: 'Reach a streak of 5 in a Biology round.',
    iconKey: 'leaf',
    subject: 'biology',
    streak: BADGE_STREAK_STEADY,
  },
];

export const BADGE_BY_ID: Record<string, BadgeDefinition> = BADGES.reduce(
  (acc, badge) => {
    acc[badge.id] = badge;
    return acc;
  },
  {} as Record<string, BadgeDefinition>,
);

/**
 * Evaluated after every accepted answer. Returns at most two new ids: a generic
 * streak badge and the matching subject badge can unlock on the same answer.
 */
export function evaluateBadges(round: RoundState, unlockedIds: readonly string[]): string[] {
  const unlocked = new Set(unlockedIds);
  const perfect =
    round.answers.length === PERFECT_ROUND_SCORE && round.correctCount === PERFECT_ROUND_SCORE;

  return BADGES.filter(badge => {
    if (unlocked.has(badge.id)) {
      return false;
    }
    if (badge.subject && badge.subject !== round.subject) {
      return false;
    }
    if (badge.perfect) {
      return perfect;
    }
    return typeof badge.streak === 'number' && round.currentStreak >= badge.streak;
  }).map(badge => badge.id);
}

/** Best streak recorded so far toward a locked streak badge. */
export function badgeProgress(badge: BadgeDefinition, bestStreak: number): string {
  if (badge.perfect) {
    return 'Needs a perfect round of 10.';
  }
  const target = badge.streak ?? 0;
  return `Best streak so far: ${Math.min(bestStreak, target)} of ${target}.`;
}
