import { ArrowLeft, WarningCircle } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { RoomView } from '../../shared/types';
import { TopBar } from '../components/TopBar';
import { Button, Keycap, Logo, Skeleton, Watermark } from '../components/ui';
import { announce, toast, useOnChange } from '../lib/hooks';
import { navigate } from '../lib/router';
import { game, useGame } from '../state/game';
import { savedName } from '../state/identity';
import { GameError } from '../net/transport';
import { Lobby } from './Lobby';
import { LetterSelection } from './LetterSelection';
import { Answering } from './Answering';
import { Review } from './Review';
import { Results } from './Results';
import { MatchSummary } from './MatchSummary';
import { sfx } from '../lib/sound';

type Gate = 'checking' | 'need-name' | 'not-found' | 'in' | 'error';

export function RoomScreen({ code }: { code: string }) {
  const { seat, view, seatLost } = useGame();
  const [gate, setGate] = useState<Gate>(seat?.code === code ? 'in' : 'checking');
  const [peek, setPeek] = useState<{ phase?: string; players?: number; full?: boolean }>({});
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    document.title = `${code} · ABC Fast or Slow`;
  }, [code]);

  useEffect(() => {
    if (gate !== 'checking') return;
    let cancelled = false;
    (async () => {
      try {
        const r = await game.resumeRoom(code);
        if (cancelled) return;
        if (r === 'resumed') return setGate('in');
        const p = await game.peek(code);
        if (cancelled) return;
        setPeek(p);
        setGate(p.exists ? 'need-name' : 'not-found');
      } catch {
        if (!cancelled) setGate('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gate, code, attempt]);

  // Lost the seat (kicked, other tab, room expired): fall back to the join card.
  useEffect(() => {
    if (seatLost && gate === 'in') {
      toast(seatLost, 'info');
      game.clearSeatLost();
      setGate('checking');
    }
  }, [seatLost, gate]);

  if (gate === 'in' && seat?.code === code) {
    return view ? <Room view={view} /> : <RoomSkeleton />;
  }

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col px-4">
      <header className="flex h-18 items-center">
        <button onClick={() => navigate('/')} className="rounded-xl" aria-label="Back to home">
          <Logo size={28} />
        </button>
        <Watermark className="ml-auto" />
      </header>
      <main className="flex flex-1 flex-col justify-center pb-20">
        {gate === 'checking' && <Skeleton className="h-72" />}
        {gate === 'need-name' && <JoinCard code={code} peek={peek} onJoined={() => setGate('in')} />}
        {gate === 'not-found' && (
          <Notice
            title="No room with that code"
            body={`We could not find room ${code}. It may have expired, or the code has a typo.`}
            onBack={() => navigate('/')}
          />
        )}
        {gate === 'error' && (
          <Notice
            title="Cannot reach the game server"
            body="Check your connection. If you are running locally, start the server with npm run dev."
            retry={() => {
              setGate('checking');
              setAttempt((a) => a + 1);
            }}
            onBack={() => navigate('/')}
          />
        )}
      </main>
    </div>
  );
}

function JoinCard({ code, peek, onJoined }: { code: string; peek: { phase?: string; players?: number; full?: boolean }; onJoined: () => void }) {
  const [name, setName] = useState(savedName.get());
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => ref.current?.focus(), []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    try {
      savedName.set(name.trim());
      await game.join(code, name.trim());
      onJoined();
    } catch (err) {
      toast(err instanceof GameError ? err.message : 'Could not join. Try again.');
      setBusy(false);
    }
  }

  const midMatch = peek.phase && peek.phase !== 'LOBBY';
  return (
    <motion.form
      onSubmit={submit}
      initial={{ y: 12 }}
      animate={{ y: 0 }}
      className="surface rounded-[28px] p-6 sm:p-8"
    >
      <p className="text-sm font-semibold text-ink-dim">You're joining room</p>
      <div className="mt-3 flex gap-1.5" aria-label={`Room ${code}`}>
        {code.split('').map((l, i) => (
          <Keycap key={i} color="ghost" size={52}>
            {l}
          </Keycap>
        ))}
      </div>
      <p className="mt-5 text-ink-dim">
        {peek.players ?? 0} {peek.players === 1 ? 'player' : 'players'} here.
        {midMatch && ' A match is in progress, so you will jump in from the next round.'}
      </p>
      {peek.full ? (
        <p className="mt-5 rounded-2xl bg-pink/12 p-4 text-[#ffd0e2]">This room is full.</p>
      ) : (
        <div className="mt-6 space-y-2">
          <label htmlFor="join-name" className="block text-sm font-semibold text-ink-dim">
            Your display name
          </label>
          <input
            id="join-name"
            ref={ref}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            autoComplete="nickname"
            placeholder="e.g. Kemar"
            className="h-14 w-full rounded-2xl border border-white/10 bg-night-900/80 px-4 text-lg text-ink placeholder:text-ink-mute focus:border-cyan focus:outline-none"
          />
          <Button type="submit" size="lg" className="mt-3 w-full" loading={busy} disabled={!name.trim()}>
            Join the room
          </Button>
        </div>
      )}
    </motion.form>
  );
}

function Notice({ title, body, onBack, retry }: { title: string; body: string; onBack: () => void; retry?: () => void }) {
  return (
    <div className="surface rounded-[28px] p-6 sm:p-8">
      <WarningCircle size={40} weight="duotone" className="text-pink" aria-hidden />
      <h1 className="mt-4 font-display text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-ink-dim">{body}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        {retry && <Button onClick={retry}>Try again</Button>}
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft size={18} weight="bold" aria-hidden /> Home
        </Button>
      </div>
    </div>
  );
}

function RoomSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-4 pt-20" aria-busy="true" aria-label="Loading room">
      <Skeleton className="h-28" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

// ─── In the room ──────────────────────────────────────────────────────────

const PHASE_LABEL: Record<RoomView['phase'], string> = {
  LOBBY: 'Lobby',
  LETTER_SELECTION: 'Choosing the letter',
  ANSWERING: 'Answering',
  REVIEW: 'Review',
  RESULTS: 'Results',
  MATCH_OVER: 'Final results',
};

function Room({ view }: { view: RoomView }) {
  const mainRef = useRef<HTMLElement>(null);
  const round = view.round;

  useOnChange(view.phase, (phase) => {
    const r = view.round;
    if (phase === 'ANSWERING' && r?.letter)
      announce(`Round ${r.number}. The letter is ${r.letter}. ${Math.round((r.deadline! - r.startedAt!) / 1000)} seconds.`);
    else if (phase === 'REVIEW') announce('Time to review the answers.');
    else if (phase === 'RESULTS') announce(`Round ${r?.number} scores are in.`);
    else announce(PHASE_LABEL[phase]);
    if (phase === 'RESULTS' || phase === 'MATCH_OVER') sfx.results();
    // Move focus to the new screen's heading for keyboard and screen reader users.
    requestAnimationFrame(() => mainRef.current?.querySelector<HTMLElement>('h1, h2')?.focus({ preventScroll: true }));
    window.scrollTo({ top: 0 });
  });

  const screenKey = `${view.phase}-${round?.number ?? 0}`;
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <TopBar view={view} />
      <main ref={mainRef} className="flex flex-1 flex-col">
        {/* Content never starts invisible: if a phone backgrounds the tab mid-transition,
            the new screen is still readable the moment it comes back. */}
        <motion.div
            key={screenKey}
            className="flex flex-1 flex-col"
            initial={{ y: 18 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            {view.phase === 'LOBBY' && <Lobby view={view} />}
            {view.phase === 'LETTER_SELECTION' && <LetterSelection view={view} />}
            {view.phase === 'ANSWERING' && <Answering view={view} />}
            {view.phase === 'REVIEW' && <Review view={view} />}
            {view.phase === 'RESULTS' && <Results view={view} />}
            {view.phase === 'MATCH_OVER' && <MatchSummary view={view} />}
        </motion.div>
      </main>
    </div>
  );
}
