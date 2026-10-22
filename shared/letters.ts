import { ALPHABET } from './constants';

/** Letters not yet used this cycle, in alphabetical order. */
export function availableLetters(used: string[]): string[] {
  const usedSet = new Set(used);
  return ALPHABET.filter((l) => !usedSet.has(l));
}

/** Absolute ticker step at a moment in time (not wrapped to the sequence length). */
export function tickAt(startedAt: number, intervalMs: number, now: number): number {
  return Math.max(0, Math.floor((now - startedAt) / intervalMs));
}

export function letterAtTick(sequence: string[], tick: number): string {
  return sequence[((tick % sequence.length) + sequence.length) % sequence.length];
}
