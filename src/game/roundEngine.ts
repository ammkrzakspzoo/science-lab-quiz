import { QUESTIONS_PER_ROUND } from '../constants/config';
import { questionsFor } from './questionBank';
import type {
  AcceptedAnswer,
  OptionId,
  Question,
  RoundQuestion,
  RoundState,
  RoundSummaryData,
  SubjectId,
} from './types';

/** Fisher-Yates shuffle on a copy of the input. */
export function shuffle<T>(input: readonly T[]): T[] {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = out[i];
    out[i] = out[j];
    out[j] = tmp;
  }
  return out;
}

let roundCounter = 0;

/**
 * Picks ten questions without replacement, preferring questions that were not
 * used in the previous round. Answer order is randomised once and then frozen.
 */
export function createRound(
  subject: SubjectId,
  year: number,
  previousQuestionIds: readonly string[] = [],
): RoundState | null {
  const pool = questionsFor(subject, year);
  if (pool.length < QUESTIONS_PER_ROUND) {
    return null;
  }

  const used = new Set(previousQuestionIds);
  const fresh = pool.filter(q => !used.has(q.id));
  const recycled = pool.filter(q => used.has(q.id));

  const picked: Question[] = shuffle(fresh).slice(0, QUESTIONS_PER_ROUND);
  if (picked.length < QUESTIONS_PER_ROUND) {
    const taken = new Set(picked.map(q => q.id));
    for (const q of shuffle(recycled)) {
      if (picked.length >= QUESTIONS_PER_ROUND) {
        break;
      }
      if (!taken.has(q.id)) {
        picked.push(q);
        taken.add(q.id);
      }
    }
  }

  const questions: RoundQuestion[] = picked.map(q => ({
    ...q,
    shuffledOptions: shuffle(q.options),
  }));

  roundCounter += 1;

  return {
    id: `r${roundCounter}-${Date.now()}`,
    subject,
    year,
    questions,
    index: 0,
    phase: 'question',
    correctCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    answers: [],
    newBadgeIds: [],
    endedEarly: false,
  };
}

export function currentQuestion(round: RoundState): RoundQuestion {
  return round.questions[Math.min(round.index, round.questions.length - 1)];
}

export function isLastQuestion(round: RoundState): boolean {
  return round.index >= round.questions.length - 1;
}

function answerIdFor(round: RoundState, questionId: string): string {
  return `${round.id}:${questionId}`;
}

export function alreadyAnswered(round: RoundState, questionId: string): boolean {
  const answerId = answerIdFor(round, questionId);
  return round.answers.some(a => a.answerId === answerId);
}

/**
 * Accepts exactly one answer for the current question. Repeated calls for the
 * same question are ignored, so a double tap can never count twice.
 */
export function acceptAnswer(round: RoundState, chosenOptionId: OptionId): RoundState {
  const question = currentQuestion(round);
  if (round.phase !== 'question' || alreadyAnswered(round, question.id)) {
    return round;
  }

  const correct = chosenOptionId === question.correctOptionId;
  const currentStreak = correct ? round.currentStreak + 1 : 0;

  const accepted: AcceptedAnswer = {
    answerId: answerIdFor(round, question.id),
    questionId: question.id,
    chosenOptionId,
    correct,
  };

  return {
    ...round,
    phase: 'explanation',
    correctCount: round.correctCount + (correct ? 1 : 0),
    currentStreak,
    bestStreak: Math.max(round.bestStreak, currentStreak),
    answers: [...round.answers, accepted],
  };
}

export function advance(round: RoundState): RoundState {
  if (round.phase !== 'explanation') {
    return round;
  }
  if (isLastQuestion(round)) {
    return { ...round, phase: 'finished' };
  }
  return { ...round, index: round.index + 1, phase: 'question' };
}

export function endEarly(round: RoundState): RoundState {
  return { ...round, phase: 'finished', endedEarly: true, currentStreak: 0 };
}

export function lastAnswer(round: RoundState): AcceptedAnswer | null {
  return round.answers.length > 0 ? round.answers[round.answers.length - 1] : null;
}

export function optionText(question: RoundQuestion, optionId: OptionId | null): string {
  if (!optionId) {
    return '';
  }
  const found = question.options.find(o => o.id === optionId);
  return found ? found.text : '';
}

export function summarise(round: RoundState): RoundSummaryData {
  const answered = round.answers.length;
  const accuracy = answered > 0 ? Math.round((round.correctCount / answered) * 100) : 0;
  return {
    subject: round.subject,
    year: round.year,
    score: round.correctCount,
    answered,
    accuracy,
    bestStreak: round.bestStreak,
    newBadgeIds: round.newBadgeIds,
    endedEarly: round.endedEarly,
  };
}
