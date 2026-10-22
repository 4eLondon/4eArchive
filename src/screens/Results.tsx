import { ArrowRight, FlagCheckered, Trophy } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import type { RoomView } from '../../shared/types';
import { Leaderboard, MatchGrid, RoundBreakdown } from '../components/Scoreboard';
import { Button, Keycap } from '../components/ui';
import { useAct } from '../lib/hooks';
import { Burst } from './LetterSelection';

export function Results({ view }: { view: RoomView }) {
  const round = view.round!;
  const summary = view.history.find((h) => h.number === round.number);
  const isHost = view.hostId === view.you;
  const host = view.players.find((p) => p.id === view.hostId);
  const lastRound = view.settings.rounds !== null && round.number >= view.settings.rounds;
  const { act, busy } = useAct();
  const roundPoints = Object.fromEntries(Object.entries(summary?.perPlayer ?? {}).map(([pid, v]) => [pid, v.total]));
  const best = Math.max(0, ...Object.values(roundPoints));
  const roundWinners = view.players.filter((p) => best > 0 && roundPoints[p.id] === best);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-6 pb-36">
      <div className="flex items-center gap-4">
        <Keycap size={60} color="sun">
          {round.letter}
        </Keycap>
        <div>
          <h1 tabIndex={-1} className="font-display text-3xl font-extrabold tracking-tight focus:outline-none">
            Round {round.number} scores
          </h1>
          <p className="text-ink-dim">
            {roundWinners.length
              ? `${roundWinners.map((p) => (p.id === view.you ? 'You' : p.name)).join(' & ')} took the round`
              : 'Nobody scored this round'}
          </p>
        </div>
        {roundWinners.length > 0 && (
          <span className="ml-auto">
            <Burst />
          </span>
        )}
      </div>

      <section className="mt-8" aria-labelledby="lb-h">
        <h2 id="lb-h" className="mb-3 flex items-center gap-2 font-display text-xl font-bold">
          <Trophy size={20} weight="duotone" className="text-sun" aria-hidden /> Leaderboard
        </h2>
        <Leaderboard view={view} roundPoints={roundPoints} />
      </section>

      {summary && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-10" aria-labelledby="bd-h">
          <h2 id="bd-h" className="mb-2 font-display text-xl font-bold">
            Round breakdown
          </h2>
          <RoundBreakdown view={view} summary={summary} categories={round.categories} />
        </motion.section>
      )}

      {view.history.length > 1 && (
        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="mt-10" aria-labelledby="rr-h">
          <h2 id="rr-h" className="mb-2 font-display text-xl font-bold">
            Round by round
          </h2>
          <MatchGrid view={view} />
        </motion.section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/6 bg-night-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          {isHost ? (
            <>
              {!lastRound && (
                <Button variant="ghost" size="lg" aria-label="End match" title="End match" onClick={() => confirm('End the match now and show final results?') && act({ type: 'end_match' })}>
                  <FlagCheckered size={20} weight="bold" aria-hidden />
                  <span className="hidden sm:inline">End match</span>
                </Button>
              )}
              <Button size="xl" className="flex-1" loading={busy === 'next_round'} onClick={() => act({ type: 'next_round' })}>
                {lastRound ? 'Final results' : 'Next round'} <ArrowRight size={22} weight="bold" aria-hidden />
              </Button>
            </>
          ) : (
            <p className="flex-1 text-center text-sm text-ink-dim">Waiting for {host?.name ?? 'the host'} to {lastRound ? 'reveal the final results' : 'start the next round'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
