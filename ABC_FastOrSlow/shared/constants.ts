// Game-wide constants shared by the client, the Node server and the tests.
// The Supabase SQL migration mirrors these values; keep them in sync.

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export type CategoryId =
  | 'boy'
  | 'girl'
  | 'animal'
  | 'place'
  | 'food'
  | 'thing'
  | 'brand'
  | 'job'
  | 'movie';

export interface CategoryDef {
  id: CategoryId;
  label: string;
  hint: string;
  /** Optional categories the host can switch on in the lobby. */
  extra: boolean;
}

export const CATEGORIES: CategoryDef[] = [
  { id: 'boy', label: 'Boy', hint: "A boy's name", extra: false },
  { id: 'girl', label: 'Girl', hint: "A girl's name", extra: false },
  { id: 'animal', label: 'Animal', hint: 'Any creature', extra: false },
  { id: 'place', label: 'Place', hint: 'City, country, town', extra: false },
  { id: 'food', label: 'Food', hint: 'Dish, fruit, snack', extra: false },
  { id: 'thing', label: 'Thing', hint: 'Any object', extra: true },
  { id: 'brand', label: 'Brand', hint: 'Company or label', extra: true },
  { id: 'job', label: 'Job', hint: 'Profession', extra: true },
  { id: 'movie', label: 'Movie', hint: 'Film title', extra: true },
];

export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  CategoryDef
>;

export const DEFAULT_CATEGORIES: CategoryId[] = ['boy', 'girl', 'animal', 'place', 'food'];

/**
 * Scores are stored as integers. 100 points == SCORE_UNIT units.
 * 27720 is the least common multiple of 1..12, so splitting a category's
 * 100 points between any number of duplicate answers (up to MAX_PLAYERS)
 * is always an exact integer. No floating point ever touches a total.
 */
export const SCORE_UNIT = 27720;
export const MAX_PLAYERS = 12;
export const MIN_PLAYERS_TO_START = 2;

export const NAME_MAX = 20;
export const ANSWER_MAX = 40;

/** Ticker step per speed, in ms. */
export const TICK_INTERVAL = { fast: 110, slow: 420 } as const;
/** If nobody presses STOP, the ticker stops itself after this long. */
export const TICKER_AUTO_STOP_MS = 15000;
/** A STOP press may claim a letter the player saw up to this long ago (network latency). */
export const TICKER_LATENCY_TOLERANCE_MS = 450;
/** Wheel spin animation length. */
export const WHEEL_SPIN_MS = 4600;
/** How long the locked letter is celebrated before answering opens. */
export const REVEAL_MS = { ticker: 2200, wheel: 1600 } as const;

/** In-flight drafts are accepted this long after STOP (they were typed before STOP arrived). */
export const LATE_DRAFT_MS = 600;
/** Everyone watches the STOP transition for this long, then review opens. */
export const STOP_TO_REVIEW_MS = 1800;

/** A disconnected host hands over to the next player after this long. */
export const HOST_HANDOFF_MS = 20000;

export const TIMER_LIMITS = { min: 15, max: 300 } as const;
export const DEFAULT_SETTINGS_SECONDS = { fast: 30, slow: 90 } as const;
export const ROUND_OPTIONS = [3, 5, 7, 10] as const;

export const ROOM_CODE_ALPHABET = 'BCDFGHJKLMNPQRSTVWXZ'; // consonants only: no accidental words, no 0/O 1/I
export const ROOM_CODE_LENGTH = 4;
