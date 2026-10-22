// Answer normalisation and the hard technical rules every answer must pass
// before players even get to vote on it.

/** Trim, collapse inner whitespace. This is what we store and display. */
export function cleanAnswer(raw: string): string {
  return raw.replace(/\s+/g, ' ').trim();
}

/**
 * Comparison key: case-insensitive, whitespace-insensitive, accent-insensitive.
 * "  new   York " and "New York" and "NEW YÖRK" all compare equal.
 */
export function normalizeAnswer(raw: string): string {
  return cleanAnswer(raw)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export type TechnicalCheck = 'ok' | 'blank' | 'wrong_letter';

export function checkAnswer(raw: string | undefined, letter: string): TechnicalCheck {
  const norm = normalizeAnswer(raw ?? '');
  if (!norm) return 'blank';
  // The first letter character must match; leading quotes/punctuation are ignored.
  const first = norm.match(/\p{L}/u)?.[0];
  if (!first || first !== letter.toLowerCase()) return 'wrong_letter';
  return 'ok';
}
