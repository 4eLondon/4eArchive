import { ArrowCounterClockwise, Crown, House, Trophy } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { CATEGORIES, CATEGORY_BY_ID, type CategoryId } from '../../shared/constants';
import { formatPoints } from '../../shared/scoring';
import type { Player, RoomView } from '../../shared/types';
import { CountUp, MatchGrid, rankOf } from '../components/Scoreboard';
import { CATEGORY_ICON } from '../components/categoryIcons';
import { Avatar, Button } from '../components/ui';
import { useAct } from '../lib/hooks';
import { Burst } from './LetterSelection';

export function MatchSummary({ view }: { view: RoomView }) {
  const players = view.players.filter((p) => !p.left || p.totalUnits > 0);
  const { sorted, ranks } = rankOf(players, (p) => p.totalUnits);
  const winners = sorted.filter((p) => ranks.get(p.id) === 1 && p.totalUnits > 0);
  const isHost = view.hostId === view.you;
  const host = view.players.find((p) => p.id === view.hostId);
  const { act, busy } = useAct();

  // Category totals across the match.
  const played = new Set(view.history.flatMap((h) => Object.values(h.perPlayer).flatMap((v) => Object.keys(v.byCategory))));
  const categories = CATEGORIES.map((c) => c.id).filter((c) => played.has(c));
  const catTotal = (pid: string, c: CategoryId) => view.history.reduce((s, h) => s + (h.perPlayer[pid]?.byCategory[c] ?? 0), 0);

  const podium = sorted.slice(0, 3);
  const order = podium.length === 3 ? [podium[1], podium[0], podium[2]] : podium;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-36">
      <div className="text-center">
        <Trophy size={44} weight="duotone" className="mx-auto text-sun" aria-hidden />
        <h1 tabIndex={-1} className="mt-3 font-display text-4xl font-extrabold tracking-tight focus:outline-none sm:text-5xl">
          {winners.length === 0
            ? 'Match over'
            : winners.length > 1
              ? `It's a tie!`
              : winners[0].id === view.you
                ? 'You win!'
                : `${winners[0].name} wins!`}
        </h1>
        <p className="mt-2 text-ink-dim">
          {view.history.length} round{view.history.length === 1 ? '' : 's'} · letters {view.history.map((h) => h.letter).join(' ')}
        </p>
      </div>

      {/* Podium */}
      <div className="mt-10 flex items-end justify-center gap-3" aria-hidden>
        {order.map((p) => (
          <PodiumStep key={p.id} player={p} rank={ranks.get(p.id)!} you={p.id === view.you} />
        ))}
      </div>

      <section className="mt-10" aria-labelledby="final-h">
        <h2 id="final-h" className="mb-3 font-display text-xl font-bold">
          Final rankings
        </h2>
        <ol className="space-y-2">
          {sorted.map((p) => (
            <li key={p.id} className={`flex items-center gap-3 rounded-[22px] p-3 pr-4 ${ranks.get(p.id) === 1 && p.totalUnits > 0 ? 'bg-sun/10 ring-2 ring-sun/60' : 'bg-night-850/80 ring-1 ring-white/7'}`}>
              <span className="w-7 text-center font-display text-xl font-extrabold tabular text-ink-mute">{ranks.get(p.id)}</span>
              <Avatar player={p} size={40} />
              <span className="min-w-0 flex-1 truncate font-semibold">{p.id === view.you ? `${p.name} (you)` : p.name}</span>
              <span className="font-display text-2xl font-extrabold tabular">{formatPoints(p.totalUnits)}</span>
            </li>
          ))}
        </ol>
      </section>

      {categories.length > 0 && (
        <section className="mt-10" aria-labelledby="cat-h">
          <h2 id="cat-h" className="mb-3 font-display text-xl font-bold">
            Category kings
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categories.map((c) => {
              const Icon = CATEGORY_ICON[c];
              const score = Math.max(0, ...players.map((p) => catTotal(p.id, c)));
              const kings = players.filter((p) => score > 0 && catTotal(p.id, c) === score);
              return (
                <div key={c} className="flex items-center gap-3 rounded-2xl bg-night-850/80 p-3 ring-1 ring-white/7">
                  <span className="grid size-10 place-items-center rounded-xl bg-white/6">
                    <Icon size={20} weight="duotone" className="text-sun" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-ink-mute">{CATEGORY_BY_ID[c].label}</div>
                    <div className="truncate font-semibold">{kings.length ? kings.map((p) => (p.id === view.you ? 'You' : p.name)).join(' & ') : 'Nobody scored'}</div>
                  </div>
                  <span className="font-display font-bold tabular text-sun">{formatPoints(score)}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {view.history.length > 0 && (
        <section className="mt-10" aria-labelledby="mg-h">
          <h2 id="mg-h" className="mb-2 font-display text-xl font-bold">
            Round by round
          </h2>
          <MatchGrid view={view} />
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/6 bg-night-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          {isHost ? (
            <>
              <Button variant="ghost" size="lg" loading={busy === 'back_to_lobby'} onClick={() => act({ type: 'back_to_lobby' })}>
                <House size={20} weight="bold" aria-hidden /> Lobby
              </Button>
              <Button size="xl" className="flex-1" loading={busy === 'rematch'} onClick={() => act({ type: 'rematch' })}>
                <ArrowCounterClockwise size={22} weight="bold" aria-hidden /> Rematch
              </Button>
            </>
          ) : (
            <p className="flex-1 text-center text-sm text-ink-dim">Waiting for {host?.name ?? 'the host'} to start a rematch</p>
          )}
        </div>
      </div>
    </div>
  );
}

function PodiumStep({ player, rank, you }: { player: Player; rank: number; you: boolean }) {
  const h = rank === 1 ? 132 : rank === 2 ? 96 : 72;
  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20, delay: rank === 1 ? 0.5 : rank === 2 ? 0.25 : 0.1 }}
      className="flex w-[30%] max-w-36 flex-col items-center"
    >
      {rank === 1 && (
        <>
          <Burst />
          <Crown size={30} weight="fill" className="mb-1 text-sun" />
        </>
      )}
      <Avatar player={player} size={rank === 1 ? 64 : 50} ring={rank === 1} />
      <span className="mt-2 max-w-full truncate text-sm font-semibold">{you ? 'You' : player.name}</span>
      <span className="font-display text-lg font-extrabold">
        <CountUp to={player.totalUnits} delay={0.6} />
      </span>
      <div
        className={`mt-2 grid w-full place-items-center rounded-t-2xl font-display text-3xl font-extrabold ${rank === 1 ? 'bg-sun text-night-950' : rank === 2 ? 'bg-cyan/80 text-night-950' : 'bg-pink/80 text-white'}`}
        style={{ height: h }}
      >
        {rank}
      </div>
    </motion.div>
  );
}
