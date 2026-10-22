import { Crown } from '@phosphor-icons/react';
import { animate, motion, useMotionValue, useMotionValueEvent } from 'motion/react';
import { useEffect, useState } from 'react';
import { CATEGORY_BY_ID, type CategoryId } from '../../shared/constants';
import { formatPoints } from '../../shared/scoring';
import type { Player, RoomView, RoundSummary } from '../../shared/types';
import { useReducedMotionPref } from '../state/prefs';
import { Avatar } from './ui';

/** Animated count-up for integer score units. */
export function CountUp({ from = 0, to, delay = 0, duration = 1.1, className = '' }: { from?: number; to: number; delay?: number; duration?: number; className?: string }) {
  const reduced = useReducedMotionPref();
  const mv = useMotionValue(reduced ? to : from);
  const [shown, setShown] = useState(reduced ? to : from);
  useMotionValueEvent(mv, 'change', (v) => setShown(Math.round(v)));
  useEffect(() => {
    if (reduced) {
      mv.set(to);
      return;
    }
    const c = animate(mv, to, { duration, delay, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [to, delay, duration, reduced, mv]);
  return <span className={`tabular ${className}`}>{formatPoints(shown)}</span>;
}

export function rankOf(players: Player[], total: (p: Player) => number) {
  const sorted = [...players].sort((a, b) => total(b) - total(a) || a.joinedAt - b.joinedAt);
  const ranks = new Map<string, number>();
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    ranks.set(p.id, prev && total(prev) === total(p) ? ranks.get(prev.id)! : i + 1);
  });
  return { sorted, ranks };
}

/**
 * Leaderboard that starts in the previous order and slides into the new one
 * after the round's points count up.
 */
export function Leaderboard({ view, roundPoints, settleDelay = 1.3 }: { view: RoomView; roundPoints: Record<string, number>; settleDelay?: number }) {
  const players = view.players.filter((p) => !p.left || p.totalUnits > 0);
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), settleDelay * 1000);
    return () => clearTimeout(t);
  }, [settleDelay]);
  const before = (p: Player) => p.totalUnits - (roundPoints[p.id] ?? 0);
  const { sorted, ranks } = rankOf(players, settled ? (p) => p.totalUnits : before);
  const top = Math.max(...players.map((p) => p.totalUnits));

  return (
    <ol className="space-y-2" aria-label="Leaderboard">
      {sorted.map((p) => {
        const leader = settled && p.totalUnits === top && top > 0;
        const gained = roundPoints[p.id] ?? 0;
        return (
          <motion.li
            layout
            key={p.id}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className={`relative flex items-center gap-3 rounded-[22px] p-3 pr-4 ${leader ? 'bg-sun/10 ring-2 ring-sun/60' : 'bg-night-850/80 ring-1 ring-white/7'}`}
          >
            <span className={`w-7 text-center font-display text-xl font-extrabold tabular ${leader ? 'text-sun' : 'text-ink-mute'}`}>{ranks.get(p.id)}</span>
            <Avatar player={p} size={44} ring={leader} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold">{p.id === view.you ? `${p.name} (you)` : p.name}</span>
                {leader && <Crown size={18} weight="fill" className="shrink-0 text-sun" aria-label="Leader" />}
              </div>
              {gained > 0 ? (
                <span className="text-sm font-semibold text-sun">
                  +<CountUp to={gained} delay={0.2} /> this round
                </span>
              ) : (
                <span className="text-sm text-ink-mute">{roundPoints[p.id] === undefined ? 'Sat this one out' : 'No points this round'}</span>
              )}
            </div>
            <span className="font-display text-3xl font-extrabold">
              <CountUp from={before(p)} to={p.totalUnits} delay={0.35} duration={1.2} />
            </span>
          </motion.li>
        );
      })}
    </ol>
  );
}

/** Category-by-player points for one round. */
export function RoundBreakdown({ view, summary, categories }: { view: RoomView; summary: RoundSummary; categories: CategoryId[] }) {
  const players = view.players.filter((p) => summary.perPlayer[p.id]);
  return (
    <>
      {/* Phones: one card per player, categories wrap as chips (no sideways scrolling). */}
      <ul className="space-y-2 sm:hidden" aria-label={`Points per category for round ${summary.number}`}>
        {players.map((p) => (
          <li key={p.id} className="rounded-2xl bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate font-semibold">{p.name}</span>
              <span className="shrink-0 font-display font-bold text-sun tabular">{formatPoints(summary.perPlayer[p.id]?.total ?? 0)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.map((c) => {
                const v = summary.perPlayer[p.id]?.byCategory[c] ?? 0;
                return (
                  <span key={c} className={`rounded-full px-2.5 py-1 text-xs tabular ${v ? 'bg-sun/12 text-sun' : 'bg-white/5 text-ink-mute'}`}>
                    {CATEGORY_BY_ID[c].label} {formatPoints(v)}
                  </span>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    <div className="no-scrollbar -mx-4 hidden overflow-x-auto px-4 sm:block">
      <table className="w-full min-w-[480px] border-separate border-spacing-y-1 text-sm">
        <caption className="sr-only">Points per category for round {summary.number}</caption>
        <thead>
          <tr className="text-left text-ink-mute">
            <th scope="col" className="py-2 pr-3 font-semibold">Player</th>
            {categories.map((c) => (
              <th key={c} scope="col" className="px-2 py-2 text-right font-semibold">
                {CATEGORY_BY_ID[c].label}
              </th>
            ))}
            <th scope="col" className="py-2 pl-2 text-right font-semibold">Round</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} className="bg-white/[0.03]">
              <th scope="row" className="rounded-l-xl py-2.5 pr-3 pl-3 text-left font-semibold">
                {p.name}
              </th>
              {categories.map((c) => {
                const v = summary.perPlayer[p.id]?.byCategory[c] ?? 0;
                return (
                  <td key={c} className={`px-2 py-2.5 text-right tabular ${v ? 'text-ink' : 'text-ink-mute/60'}`}>
                    {formatPoints(v)}
                  </td>
                );
              })}
              <td className="rounded-r-xl py-2.5 pr-3 pl-2 text-right font-display font-bold text-sun tabular">{formatPoints(summary.perPlayer[p.id]?.total ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

/** Rounds-by-player grid for the whole match. */
export function MatchGrid({ view }: { view: RoomView }) {
  const players = view.players.filter((p) => !p.left || p.totalUnits > 0);
  return (
    <>
      <ul className="space-y-2 sm:hidden" aria-label="Points per round">
        {players.map((p) => (
          <li key={p.id} className="rounded-2xl bg-white/[0.03] p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="min-w-0 truncate font-semibold">{p.name}</span>
              <span className="shrink-0 font-display font-bold tabular">{formatPoints(p.totalUnits)}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {view.history.map((h) => (
                <span key={h.number} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-ink-dim tabular">
                  <span className="font-display font-bold text-sun">{h.letter}</span> {h.perPlayer[p.id] ? formatPoints(h.perPlayer[p.id].total) : '-'}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    <div className="no-scrollbar -mx-4 hidden overflow-x-auto px-4 sm:block">
      <table className="w-full border-separate border-spacing-y-1 text-sm" style={{ minWidth: 160 + view.history.length * 56 }}>
        <caption className="sr-only">Points per round</caption>
        <thead>
          <tr className="text-ink-mute">
            <th scope="col" className="py-2 pr-3 text-left font-semibold">Player</th>
            {view.history.map((h) => (
              <th key={h.number} scope="col" className="px-2 py-2 text-right font-display font-bold">
                <span className="text-sun">{h.letter}</span>
              </th>
            ))}
            <th scope="col" className="py-2 pl-2 text-right font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} className="bg-white/[0.03]">
              <th scope="row" className="rounded-l-xl py-2.5 pr-3 pl-3 text-left font-semibold">
                {p.name}
              </th>
              {view.history.map((h) => (
                <td key={h.number} className="px-2 py-2.5 text-right tabular text-ink-dim">
                  {h.perPlayer[p.id] ? formatPoints(h.perPlayer[p.id].total) : '-'}
                </td>
              ))}
              <td className="rounded-r-xl py-2.5 pr-3 pl-2 text-right font-display font-bold tabular">{formatPoints(p.totalUnits)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}
