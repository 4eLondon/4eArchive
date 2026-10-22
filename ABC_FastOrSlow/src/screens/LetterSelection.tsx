import { ArrowsClockwise, HandPalm, Hourglass, Lightning } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { WHEEL_SPIN_MS } from '../../shared/constants';
import { tickAt } from '../../shared/letters';
import type { RoomView, Selection } from '../../shared/types';
import { LetterPool } from '../components/Players';
import { TickerDisplay } from '../components/Ticker';
import { LetterWheel, easeOutWheel, wheelTarget } from '../components/Wheel';
import { Avatar, Button, Keycap } from '../components/ui';
import { announce, useAct, useOnChange, useServerNow } from '../lib/hooks';
import { sfx } from '../lib/sound';
import { useReducedMotionPref } from '../state/prefs';

export function LetterSelection({ view }: { view: RoomView }) {
  const round = view.round!;
  const sel = round.selection;
  const chooser = view.players.find((p) => p.id === round.chooserId);
  const isChooser = view.you === round.chooserId;
  const isHost = view.you === view.hostId;
  const canCall = isChooser || isHost;
  const chooserName = isChooser ? 'You' : (chooser?.name ?? 'The caller');

  useOnChange(sel.status, (s) => {
    if (s === 'locked' && sel.status === 'locked') {
      if (sel.via === 'ticker') {
        sfx.stop();
        setTimeout(sfx.reveal, 250);
        announce(`STOP! The letter is ${sel.letter}.`);
      }
    }
    if (s === 'ticking') announce(`${chooserName} chose ${sel.status === 'ticking' ? sel.speed : ''}. The alphabet is running.`);
  });

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pt-6 pb-10">
      <div className="flex items-center gap-3">
        {chooser && <Avatar player={chooser} size={44} ring />}
        <div>
          <h1 tabIndex={-1} className="font-display text-2xl font-extrabold tracking-tight focus:outline-none sm:text-3xl">
            Round {round.number}
            {view.settings.rounds ? <span className="text-ink-mute"> of {view.settings.rounds}</span> : null}
          </h1>
          <p className="text-ink-dim">
            {isChooser ? "You're the caller this round." : `${chooser?.name ?? 'Someone'} is the caller.`}
            {isHost && !isChooser && sel.status !== 'locked' ? ' As host you can call it if they are away.' : ''}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-8">
        {sel.status === 'choosing' && <ChooseSpeed view={view} canCall={canCall} chooserName={chooserName} />}
        {sel.status === 'exhausted' && <Exhausted isHost={isHost} />}
        {sel.status === 'ticking' && <LiveTicker sel={sel} canCall={canCall} chooserName={chooserName} />}
        {(sel.status === 'ready' || (sel.status === 'locked' && sel.via === 'wheel')) && (
          <WheelStage view={view} sel={sel} canCall={canCall} chooserName={chooserName} />
        )}
        {sel.status === 'locked' && sel.via === 'ticker' && <TickerReveal sel={sel} />}
      </div>

      <div className="surface rounded-3xl p-4">
        <LetterPool used={view.usedLetters} current={round.letter} />
      </div>
    </div>
  );
}

function ChooseSpeed({ view, canCall, chooserName }: { view: RoomView; canCall: boolean; chooserName: string }) {
  const { act, busy } = useAct();
  const wheel = view.settings.letterMode === 'wheel';
  return (
    <div className="w-full text-center">
      <p className="font-display text-xl font-bold text-ink-dim">A, B, C...</p>
      <h2 className="mt-1 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
        Fast <span className="text-ink-mute italic font-semibold">or</span> slow?
      </h2>
      {canCall ? (
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-2 gap-4">
          {(['fast', 'slow'] as const).map((s) => (
            <motion.button
              key={s}
              whileHover={{ y: -3 }}
              whileTap={{ y: 3, scale: 0.98 }}
              disabled={!!busy}
              onClick={() => {
                sfx.unlock();
                act({ type: 'choose_speed', speed: s });
              }}
              className={`group flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-[28px] font-display shadow-[inset_0_2px_0_rgb(255_255_255/0.4),0_8px_0_var(--d),0_24px_40px_-16px_var(--g)] transition-shadow active:shadow-[inset_0_2px_0_rgb(255_255_255/0.4),0_2px_0_var(--d)] sm:aspect-square ${
                s === 'fast' ? 'bg-pink text-white' : 'bg-cyan text-night-950'
              }`}
              style={
                {
                  '--d': s === 'fast' ? 'var(--color-pink-deep)' : 'var(--color-cyan-deep)',
                  '--g': s === 'fast' ? 'rgb(255 61 139 / 0.6)' : 'rgb(46 230 242 / 0.5)',
                } as React.CSSProperties
              }
            >
              {s === 'fast' ? <Lightning size={56} weight="fill" aria-hidden /> : <Hourglass size={56} weight="fill" aria-hidden />}
              <span className="text-3xl font-extrabold sm:text-4xl">{s === 'fast' ? 'FAST' : 'SLOW'}</span>
              <span className="text-sm font-semibold opacity-80">
                {s === 'fast' ? view.settings.fastSeconds : view.settings.slowSeconds} second round
              </span>
            </motion.button>
          ))}
          <p className="col-span-2 text-sm text-ink-mute">
            {wheel ? 'Then spin the wheel for the letter.' : 'Then hit STOP while the alphabet runs.'}
          </p>
        </div>
      ) : (
        <WaitingFor text={`${chooserName} is choosing`} />
      )}
    </div>
  );
}

function WaitingFor({ text }: { text: string }) {
  return (
    <p className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/5 px-5 py-3 text-ink-dim" role="status">
      <span className="flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-2 rounded-full bg-cyan"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </span>
      {text}
    </p>
  );
}

function LiveTicker({ sel, canCall, chooserName }: { sel: Extract<Selection, { status: 'ticking' }>; canCall: boolean; chooserName: string }) {
  const { act, busy } = useAct();
  const now = useServerNow(0);
  const tick = tickAt(sel.startedAt, sel.intervalMs, now);
  const lastTick = useRef(tick);
  useEffect(() => {
    if (tick !== lastTick.current) {
      lastTick.current = tick;
      if (sel.speed === 'slow' || tick % 2 === 0) sfx.tick();
    }
  }, [tick, sel.speed]);

  const stop = () => act({ type: 'stop_ticker', atTick: tick });

  // Space / Enter shout STOP for keyboard players.
  useEffect(() => {
    if (!canCall) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        stop();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="flex w-full flex-col items-center">
      <span className={`mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${sel.speed === 'fast' ? 'bg-pink/15 text-pink' : 'bg-cyan/15 text-cyan'}`}>
        {sel.speed === 'fast' ? <Lightning size={14} weight="fill" aria-hidden /> : <Hourglass size={14} weight="fill" aria-hidden />}
        {sel.speed === 'fast' ? 'Fast' : 'Slow'}
      </span>
      <TickerDisplay sequence={sel.sequence} tick={tick} size={200} fast={sel.speed === 'fast'} />
      <span className="sr-only">The alphabet is running.</span>
      {canCall ? (
        <Button variant="stop" size="xl" className="mt-10 h-20 w-full max-w-sm animate-pulse-ring text-3xl" onClick={stop} disabled={!!busy}>
          <HandPalm size={30} weight="fill" aria-hidden /> STOP!
        </Button>
      ) : (
        <WaitingFor text={`Waiting for ${chooserName} to shout STOP`} />
      )}
      {canCall && <p className="mt-3 text-sm text-ink-mute">Tap STOP or press Space</p>}
    </div>
  );
}

function TickerReveal({ sel }: { sel: Extract<Selection, { status: 'locked' }> }) {
  const now = useServerNow(200);
  const left = Math.max(0, Math.ceil((sel.revealUntil - now) / 1000));
  return (
    <div className="flex flex-col items-center">
      <motion.p
        initial={{ scale: 2.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
        className="mb-6 font-display text-5xl font-extrabold text-pink sm:text-6xl"
      >
        STOP!
      </motion.p>
      <TickerDisplay sequence={sel.sequence ?? [sel.letter]} tick={sel.stopIndex ?? 0} frozen size={200} />
      <Reveal letter={sel.letter} secondsLeft={left} auto={sel.autoStopped} />
    </div>
  );
}

function Reveal({ letter, secondsLeft, auto }: { letter: string; secondsLeft: number; auto?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-8 text-center" role="status">
      <p className="font-display text-2xl font-bold">
        {auto ? 'Time ran out, the alphabet picked ' : 'The letter is '}
        <span className="text-sun">{letter}</span>
      </p>
      <p className="mt-1 text-ink-dim tabular">Answers open in {secondsLeft}...</p>
    </motion.div>
  );
}

function WheelStage({
  view,
  sel,
  canCall,
  chooserName,
}: {
  view: RoomView;
  sel: Extract<Selection, { status: 'ready' } | { status: 'locked' }>;
  canCall: boolean;
  chooserName: string;
}) {
  const { act, busy } = useAct();
  const reduced = useReducedMotionPref();
  const spinning = sel.status === 'locked';
  const now = useServerNow(0, spinning);
  const p = spinning ? Math.min(1, Math.max(0, (now - sel.lockedAt) / WHEEL_SPIN_MS)) : 0;
  const landed = spinning && (p >= 1 || reduced);
  const rotation = spinning ? wheelTarget(sel.letter) * (reduced ? 1 : easeOutWheel(p)) : 0;

  // Peg clicks as segments pass the pointer, and a fanfare on landing.
  const lastSeg = useRef(0);
  const announced = useRef(false);
  useEffect(() => {
    const seg = Math.floor(rotation / (360 / 26));
    if (seg !== lastSeg.current && !landed) sfx.tick();
    lastSeg.current = seg;
    if (landed && spinning && !announced.current) {
      announced.current = true;
      sfx.reveal();
      announce(`The wheel landed on ${sel.letter}.`);
    }
  }, [rotation, landed, spinning, sel]);

  const size = Math.min(340, typeof window !== 'undefined' ? window.innerWidth - 48 : 320);
  return (
    <div className="flex w-full flex-col items-center">
      <span className={`mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-bold ${sel.speed === 'fast' ? 'bg-pink/15 text-pink' : 'bg-cyan/15 text-cyan'}`}>
        {sel.speed === 'fast' ? <Lightning size={14} weight="fill" aria-hidden /> : <Hourglass size={14} weight="fill" aria-hidden />}
        {sel.speed === 'fast' ? 'Fast round' : 'Slow round'}
      </span>
      <LetterWheel rotation={rotation} used={view.usedLetters} target={spinning ? sel.letter : null} landed={landed} size={size} />
      <div className="mt-8 min-h-28">
        <AnimatePresence mode="wait">
          {!spinning ? (
            canCall ? (
              <motion.div key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  size="xl"
                  className="w-64"
                  loading={busy === 'spin_wheel'}
                  onClick={() => {
                    sfx.unlock();
                    act({ type: 'spin_wheel' });
                  }}
                >
                  <ArrowsClockwise size={24} weight="bold" aria-hidden /> Spin it
                </Button>
              </motion.div>
            ) : (
              <WaitingFor key="wait" text={`Waiting for ${chooserName} to spin`} />
            )
          ) : landed ? (
            <motion.div key="landed" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 360, damping: 16 }} className="flex flex-col items-center">
              <Burst />
              <Reveal letter={sel.letter} secondsLeft={Math.max(0, Math.ceil((sel.revealUntil - now) / 1000))} />
            </motion.div>
          ) : (
            <motion.p key="spinning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-display text-xl font-bold text-ink-dim" role="status">
              Spinning...
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Small celebratory spark burst, a handful of particles, no confetti wall. */
export function Burst({ color = 'var(--color-sun)' }: { color?: string }) {
  return (
    <span className="pointer-events-none relative block h-0 w-0" aria-hidden>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute size-2 rounded-full"
            style={{ background: i % 3 === 0 ? 'var(--color-pink)' : i % 3 === 1 ? 'var(--color-cyan)' : color }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(a) * 90, y: Math.sin(a) * 60, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          />
        );
      })}
    </span>
  );
}

function Exhausted({ isHost }: { isHost: boolean }) {
  const { act, busy } = useAct();
  return (
    <div className="max-w-md text-center">
      <div className="flex justify-center gap-1" aria-hidden>
        {['A', 'Z'].map((l) => (
          <Keycap key={l} color="ghost" size={56}>
            {l}
          </Keycap>
        ))}
      </div>
      <h2 className="mt-6 font-display text-3xl font-extrabold">All 26 letters used</h2>
      <p className="mt-2 text-ink-dim">You have played the whole alphabet. Start a fresh cycle to keep going.</p>
      {isHost ? (
        <Button size="lg" className="mt-6" loading={busy === 'reset_letters'} onClick={() => act({ type: 'reset_letters' })}>
          <ArrowsClockwise size={20} weight="bold" aria-hidden /> Reset the alphabet
        </Button>
      ) : (
        <p className="mt-6 text-sm text-ink-mute">Waiting for the host to reset the alphabet.</p>
      )}
    </div>
  );
}

