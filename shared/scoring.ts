import { SCORE_UNIT, type CategoryId } from './constants';
import { checkAnswer, normalizeAnswer } from './normalize';
import type { AnswerOutcome, AnswerStatus, RoundResults, Vote } from './types';

export const answerKey = (playerId: string, category: CategoryId) => `${playerId}:${category}`;

/** Convert integer units to display points, e.g. 9240 -> 33.3 */
export function unitsToPoints(units: number): number {
  return Math.round((units * 100 * 10) / SCORE_UNIT) / 10;
}

export function formatPoints(units: number): string {
  const p = unitsToPoints(units);
  return Number.isInteger(p) ? String(p) : p.toFixed(1);
}

/**
 * Social verdict for one answer: rejected only if strictly more players voted
 * reject than accept. Ties and no votes give the benefit of the doubt.
 */
export function verdictFromVotes(votes: Record<string, Vote> | undefined): 'accepted' | 'rejected' {
  let accept = 0;
  let reject = 0;
  for (const v of Object.values(votes ?? {})) {
    if (v === 'accept') accept++;
    else if (v === 'reject') reject++;
  }
  return reject > accept ? 'rejected' : 'accepted';
}

export interface ScoreInput {
  letter: string;
  categories: CategoryId[];
  participants: string[];
  answers: Record<string, Partial<Record<CategoryId, string>>>;
  votes: Record<string, Record<string, Vote>>;
}

/**
 * Score one round. Each category is independent:
 *  - blank / wrong-letter / rejected answers score 0
 *  - accepted answers are grouped by normalised text within the category
 *  - each member of a group of size n gets SCORE_UNIT / n (exact, see SCORE_UNIT)
 */
export function scoreRound(input: ScoreInput): RoundResults {
  const outcomes: Record<string, AnswerOutcome> = {};
  const perPlayer: RoundResults['perPlayer'] = {};
  for (const pid of input.participants) perPlayer[pid] = { total: 0, byCategory: {} };

  for (const cat of input.categories) {
    const groups = new Map<string, string[]>();
    for (const pid of input.participants) {
      const raw = input.answers[pid]?.[cat] ?? '';
      const key = answerKey(pid, cat);
      const tech = checkAnswer(raw, input.letter);
      let status: AnswerStatus = tech === 'ok' ? verdictFromVotes(input.votes[key]) : tech;
      outcomes[key] = { status, units: 0, duplicates: 1 };
      if (status === 'accepted') {
        const norm = normalizeAnswer(raw);
        const g = groups.get(norm) ?? [];
        g.push(pid);
        groups.set(norm, g);
      }
    }
    for (const members of groups.values()) {
      const share = SCORE_UNIT / members.length;
      for (const pid of members) {
        const key = answerKey(pid, cat);
        outcomes[key] = { status: 'accepted', units: share, duplicates: members.length };
        perPlayer[pid].byCategory[cat] = share;
        perPlayer[pid].total += share;
      }
    }
  }
  return { outcomes, perPlayer };
}

/** Duplicate groups by category, used to highlight matches during review. */
export function duplicateGroups(
  categories: CategoryId[],
  participants: string[],
  answers: Record<string, Partial<Record<CategoryId, string>>>,
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of categories) {
    const byNorm = new Map<string, string[]>();
    for (const pid of participants) {
      const n = normalizeAnswer(answers[pid]?.[cat] ?? '');
      if (!n) continue;
      byNorm.set(n, [...(byNorm.get(n) ?? []), pid]);
    }
    for (const pids of byNorm.values()) for (const pid of pids) counts[answerKey(pid, cat)] = pids.length;
  }
  return counts;
}
