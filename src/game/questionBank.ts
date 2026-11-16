import { PHYSICS_RAW } from './physicsQuestions';
import { CHEMISTRY_RAW } from './chemistryQuestions';
import { BIOLOGY_RAW } from './biologyQuestions';
import type { OptionId, Question, RawQuestion, SubjectId } from './types';

const OPTION_IDS: OptionId[] = ['a', 'b', 'c', 'd'];

const SUBJECT_PREFIX: Record<SubjectId, string> = {
  physics: 'PHY',
  chemistry: 'CHE',
  biology: 'BIO',
};

function build(subject: SubjectId, raw: RawQuestion[]): Question[] {
  const counters: Record<number, number> = {};

  return raw.map(([year, prompt, options, correctIndex, explanation, takeaway]) => {
    counters[year] = (counters[year] ?? 0) + 1;
    const ordinal = String(counters[year]).padStart(2, '0');

    return {
      id: `${SUBJECT_PREFIX[subject]}-Y${year}-${ordinal}`,
      subject,
      year,
      prompt,
      options: options.map((text, i) => ({ id: OPTION_IDS[i], text })),
      correctOptionId: OPTION_IDS[correctIndex],
      explanation,
      takeaway,
    };
  });
}

export const QUESTION_BANK: Question[] = [
  ...build('physics', PHYSICS_RAW),
  ...build('chemistry', CHEMISTRY_RAW),
  ...build('biology', BIOLOGY_RAW),
];

/** Pre-grouped lookup so selecting a round never scans the whole bank. */
const BY_SUBJECT_YEAR = QUESTION_BANK.reduce<Record<string, Question[]>>((acc, q) => {
  const key = `${q.subject}:${q.year}`;
  (acc[key] ??= []).push(q);
  return acc;
}, {});

export function questionsFor(subject: SubjectId, year: number): Question[] {
  return BY_SUBJECT_YEAR[`${subject}:${year}`] ?? [];
}

export function hasEnoughQuestions(subject: SubjectId, year: number, needed: number): boolean {
  return questionsFor(subject, year).length >= needed;
}
