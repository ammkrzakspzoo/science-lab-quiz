export type SubjectId = 'physics' | 'chemistry' | 'biology';

export type OptionId = 'a' | 'b' | 'c' | 'd';

export interface AnswerOptionData {
  id: OptionId;
  text: string;
}

export interface Question {
  id: string;
  subject: SubjectId;
  year: number;
  prompt: string;
  options: AnswerOptionData[];
  correctOptionId: OptionId;
  explanation: string;
  takeaway: string;
}

/** Authoring tuple: [year, prompt, four options, correct index, explanation, takeaway]. */
export type RawQuestion = [
  number,
  string,
  [string, string, string, string],
  0 | 1 | 2 | 3,
  string,
  string,
];

/** A question with its answer order fixed for one round. */
export interface RoundQuestion extends Question {
  shuffledOptions: AnswerOptionData[];
}

export type RoundPhase = 'question' | 'answerLocked' | 'explanation' | 'finished';

export interface AcceptedAnswer {
  answerId: string;
  questionId: string;
  chosenOptionId: OptionId;
  correct: boolean;
}

export interface RoundState {
  id: string;
  subject: SubjectId;
  year: number;
  questions: RoundQuestion[];
  index: number;
  phase: RoundPhase;
  correctCount: number;
  currentStreak: number;
  bestStreak: number;
  answers: AcceptedAnswer[];
  newBadgeIds: string[];
  endedEarly: boolean;
}

export interface RoundSummaryData {
  subject: SubjectId;
  year: number;
  score: number;
  answered: number;
  accuracy: number;
  bestStreak: number;
  newBadgeIds: string[];
  endedEarly: boolean;
}

export interface TopicStat {
  correct: number;
  answered: number;
  rounds: number;
  bestStreak: number;
}

export interface BadgeRecord {
  earnedAt: number;
  subject: SubjectId;
  year: number;
}

export interface ProgressState {
  /** key is `${subject}:${year}` */
  stats: Record<string, TopicStat>;
  badges: Record<string, BadgeRecord>;
  bestStreakOverall: number;
  completedRounds: number;
  lastRoundQuestionIds: string[];
}

export interface BadgeDefinition {
  id: string;
  name: string;
  rule: string;
  iconKey: 'spark' | 'flask' | 'medal' | 'atom' | 'bubbles' | 'leaf';
  subject?: SubjectId;
  streak?: number;
  perfect?: boolean;
}

export type TabId = 'topics' | 'badges' | 'stats' | 'settings';
