import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export { SCREEN_W, SCREEN_H };

/** Splash duration. Exactly 8000 ms — shorter values race the screenshot gate. */
export const LOADER_DURATION_MS = 8000;

/** Progress bar tick while the loader runs. */
export const LOADER_TICK_MS = 80;

export const QUESTIONS_PER_ROUND = 10;

export const SCHOOL_YEARS = [2, 3, 4, 5, 6, 7, 8, 9] as const;
export const INITIAL_YEAR = 2;
export const INITIAL_SUBJECT = 'physics' as const;

/** Streak thresholds used by the badge rules. */
export const BADGE_STREAK_CURIOUS = 3;
export const BADGE_STREAK_STEADY = 5;
export const PERFECT_ROUND_SCORE = QUESTIONS_PER_ROUND;

/** Shared geometry (dp). */
export const TOP_INSET = 44;
export const HEADER_HEIGHT = 56;
export const GAME_HEADER_HEIGHT = 72;
export const CONTENT_W = Math.min(SCREEN_W - 32, 380);
export const GUTTER = 16;
export const TAB_BAR_HEIGHT = 64;
export const PRIMARY_BUTTON_H = 56;
export const SECONDARY_BUTTON_H = 48;
export const ANSWER_ROW_MIN_H = 48;
export const ICON_BUTTON = 48;

/** Compact phones lose decorative height first. */
export const IS_COMPACT = SCREEN_H < 700;
export const LOADER_MARK = IS_COMPACT ? 96 : 112;

/**
 * Topics is the tallest screen, so its hero and cards are sized from the space
 * that is actually left after the header, the action dock and the tab bar.
 * This keeps the layout inside the viewport instead of overflowing on short
 * phones, without ever wrapping the screen in a ScrollView.
 */
const MENU_FIXED_CHROME =
  TOP_INSET + HEADER_HEIGHT + 11 + TAB_BAR_HEIGHT + 10 + PRIMARY_BUTTON_H + 40 + 16;
export const MENU_AVAILABLE = SCREEN_H - MENU_FIXED_CHROME;
export const HERO_SIZE = MENU_AVAILABLE >= 540 ? 88 : MENU_AVAILABLE >= 500 ? 72 : 56;
export const TOPIC_CARD_H = MENU_AVAILABLE >= 540 ? 84 : MENU_AVAILABLE >= 500 ? 76 : 68;

/** Motion timings (ms). */
export const PRESS_IN_MS = 90;
export const FEEDBACK_MS = 180;
export const SCREEN_FADE_MS = 200;
export const ENTRY_FADE_MS = 180;
export const STAGGER_MS = 30;
export const BOUNCE_MS = 220;

export const SUBJECT_LABELS: Record<string, string> = {
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
};

export const TONE_MESSAGES = [
  { min: 0, max: 3, text: 'Every answer helps you learn.' },
  { min: 4, max: 7, text: 'Your science skills are growing.' },
  { min: 8, max: 10, text: 'Great discoveries today!' },
];
