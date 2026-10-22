import { ArrowRight, Hourglass, Lightning, HandPalm, UsersThree } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ALPHABET, DEFAULT_CATEGORIES, CATEGORY_BY_ID, TICK_INTERVAL } from '../../shared/constants';
import { TickerDisplay } from '../components/Ticker';
import { Button, Keycap, Logo, Watermark } from '../components/ui';
import { toast } from '../lib/hooks';
import { navigate } from '../lib/router';
import { normalizeCode } from '../lib/code';
import { game } from '../state/game';
import { savedName } from '../state/identity';
import { GameError } from '../net/transport';
import { sfx } from '../lib/sound';

export function Landing() {
  useEffect(() => {
    document.title = 'ABC Fast or Slow';
    game.warm();
  }, []);

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-6xl flex-col px-4 sm:px-6">
      <header className="flex h-18 items-center justify-between">
        <Logo size={30} />
        <div className="flex items-center gap-2">
          <Watermark />
          <a href="#how" className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink-dim hover:text-ink sm:inline-flex">
            How to play
          </a>
        </div>
      </header>

      <main>
        <Hero />
        <HowToPlay />
      </main>

      <footer className="mt-auto flex flex-col items-start justify-between gap-2 border-t border-white/6 py-8 text-sm text-ink-mute sm:flex-row sm:items-center">
        <span>Made for game night by <span className="font-display font-bold text-ink-dim">CawayneDaley</span>. Any phone, no app, no sign-up.</span>
        <span>2 to 12 players</span>
      </footer>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="grid grid-cols-1 items-center gap-10 pt-4 pb-14 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-12 md:pt-14 md:pb-24">
      <div>
        <h1 className="font-display font-extrabold tracking-tight">
          <span className="sr-only">ABC Fast or Slow</span>
          <span aria-hidden className="flex items-end gap-2 sm:gap-3">
            {(['pink', 'sun', 'cyan'] as const).map((c, i) => (
              <motion.span
                key={c}
                initial={{ y: -60, rotate: 0 }}
                animate={{ y: 0, rotate: [-7, 0, 6][i] }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.08 * i }}
              >
                <Keycap color={c} size={86} className="max-sm:!size-[68px] max-sm:!text-[40px]">
                  {'ABC'[i]}
                </Keycap>
              </motion.span>
            ))}
          </span>
          <motion.span
            aria-hidden
            className="mt-6 block text-[clamp(3rem,9vw,5.6rem)] leading-[0.92]"
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Fast <span className="font-semibold text-ink-mute italic">or</span> Slow
          </motion.span>
        </h1>
        <p className="mt-5 max-w-[34ch] text-lg leading-relaxed text-ink-dim sm:text-xl">
          <span className="font-display font-bold text-sun">Think quick. Name it. Score it.</span> One letter, five categories,
          and the first friend to finish shouts STOP.
        </p>
        <StartActions />
      </div>
      <TickerToy />
    </section>
  );
}

function StartActions() {
  const [mode, setMode] = useState<'idle' | 'create'>('idle');
  const [name, setName] = useState(savedName.get());
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  async function create(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return nameRef.current?.focus();
    setBusy(true);
    try {
      savedName.set(name.trim());
      const seat = await game.create(name.trim());
      navigate(`/room/${seat.code}`);
    } catch (err) {
      toast(err instanceof GameError ? err.message : 'Could not create a room. Is the game server running?');
      setBusy(false);
    }
  }

  function join(e: FormEvent) {
    e.preventDefault();
    const c = normalizeCode(code);
    if (c.length < 4) return toast('Room codes are 4 letters.', 'info');
    navigate(`/room/${c}`);
  }

  return (
    <div className="mt-9 max-w-md space-y-4">
      {/* Swaps instantly (no exit wait) so the name field is usable right away. */}
        {mode === 'idle' ? (
          <motion.div key="idle" initial={{ y: 6 }} animate={{ y: 0 }}>
            <Button size="lg" className="w-full sm:w-auto" onClick={() => setMode('create')}>
              Create a room <ArrowRight size={20} weight="bold" aria-hidden />
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="create"
            onSubmit={create}
            initial={{ y: 6 }}
            animate={{ y: 0 }}
            className="space-y-2"
          >
            <label htmlFor="host-name" className="block text-sm font-semibold text-ink-dim">
              Your display name
            </label>
            <div className="flex gap-2">
              <input
                id="host-name"
                ref={nameRef}
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={20}
                autoComplete="nickname"
                placeholder="e.g. Tash"
                className="h-14 min-w-0 flex-1 rounded-2xl border border-white/10 bg-night-900/80 px-4 text-lg text-ink placeholder:text-ink-mute focus:border-cyan focus:outline-none"
              />
              <Button size="lg" type="submit" loading={busy} disabled={!name.trim()}>
                Create
              </Button>
            </div>
            <button type="button" onClick={() => setMode('idle')} className="text-sm text-ink-mute underline-offset-4 hover:text-ink hover:underline">
              Cancel
            </button>
          </motion.form>
        )}

      <form onSubmit={join} className="space-y-2">
        <label htmlFor="join-code" className="block text-sm font-semibold text-ink-dim">
          Got a code from a friend?
        </label>
        <div className="flex gap-2">
          <input
            id="join-code"
            value={code}
            onChange={(e) => setCode(normalizeCode(e.target.value))}
            maxLength={6}
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            placeholder="ROOM CODE"
            className="h-14 w-full min-w-0 flex-1 rounded-2xl border border-white/10 bg-night-900/80 px-4 font-display text-xl font-bold tracking-[0.3em] text-ink uppercase placeholder:text-base placeholder:font-semibold placeholder:tracking-[0.2em] placeholder:text-ink-mute focus:border-cyan focus:outline-none"
          />
          <Button size="lg" variant="ghost" type="submit" disabled={code.length < 4}>
            Join
          </Button>
        </div>
      </form>
    </div>
  );
}

/** A playable miniature of the letter caller, so the landing page shows the real mechanic. */
function TickerToy() {
  const [speed, setSpeed] = useState<'fast' | 'slow'>('slow');
  const [tick, setTick] = useState(0);
  const [stopped, setStopped] = useState<string | null>(null);

  useEffect(() => {
    if (stopped) return;
    const id = window.setInterval(() => setTick((t) => t + 1), TICK_INTERVAL[speed]);
    return () => window.clearInterval(id);
  }, [speed, stopped]);

  const letter = ALPHABET[tick % 26];

  return (
    <div className="surface relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-bold">ABC... fast or slow?</p>
        <div className="flex gap-1.5" role="radiogroup" aria-label="Demo speed">
          {(['fast', 'slow'] as const).map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={speed === s}
              onClick={() => {
                setSpeed(s);
                setStopped(null);
              }}
              className={`flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold transition-colors ${
                speed === s ? (s === 'fast' ? 'bg-pink text-white' : 'bg-cyan text-night-950') : 'bg-white/6 text-ink-dim hover:text-ink'
              }`}
            >
              {s === 'fast' ? <Lightning size={16} weight="fill" aria-hidden /> : <Hourglass size={16} weight="fill" aria-hidden />}
              {s === 'fast' ? 'Fast' : 'Slow'}
            </button>
          ))}
        </div>
      </div>

      <div className="my-8">
        <TickerDisplay sequence={ALPHABET} tick={tick} frozen={!!stopped} size={150} fast={speed === 'fast'} />
      </div>

      <AnimatePresence mode="wait">
        {stopped ? (
          <motion.div key="sheet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <div className="flex flex-wrap gap-2" aria-label={`Categories for ${stopped}`}>
              {DEFAULT_CATEGORIES.map((c) => (
                <span key={c} className="rounded-full bg-white/6 px-3 py-1.5 text-sm text-ink-dim">
                  {CATEGORY_BY_ID[c].label} <span className="font-display font-bold text-sun">{stopped}…</span>
                </span>
              ))}
            </div>
            <Button variant="ghost" size="md" className="w-full" onClick={() => setStopped(null)}>
              Go again
            </Button>
          </motion.div>
        ) : (
          <motion.div key="stop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Button
              variant="stop"
              size="lg"
              className="w-full"
              onClick={() => {
                sfx.stop();
                setStopped(letter);
              }}
            >
              <HandPalm size={22} weight="fill" aria-hidden /> STOP
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        {stopped ? `Stopped on ${stopped}` : ''}
      </p>
    </div>
  );
}

// ─── How to play ──────────────────────────────────────────────────────────

function HowToPlay() {
  return (
    <section id="how" className="scroll-mt-6 pb-20">
      <h2 className="max-w-[18ch] font-display text-4xl font-extrabold tracking-tight sm:text-5xl">One letter. Five categories. One STOP.</h2>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-6">
        <article className="surface rounded-3xl p-6 md:col-span-4">
          <div className="flex gap-2" aria-hidden>
            <span className="flex h-10 items-center gap-1.5 rounded-full bg-pink px-4 text-sm font-bold text-white">
              <Lightning size={16} weight="fill" /> Fast
            </span>
            <span className="flex h-10 items-center gap-1.5 rounded-full bg-cyan px-4 text-sm font-bold text-night-950">
              <Hourglass size={16} weight="fill" /> Slow
            </span>
          </div>
          <h3 className="mt-5 font-display text-2xl font-bold">Call the letter</h3>
          <p className="mt-2 max-w-[52ch] text-ink-dim">
            The caller picks a pace. Fast gives 30 seconds, slow gives 90. Then they stop the alphabet or spin the wheel. Letters
            never repeat until all 26 are used.
          </p>
        </article>

        <article className="rounded-3xl bg-sun p-6 text-night-950 md:col-span-2">
          <Keycap color="night" size={52}>
            M
          </Keycap>
          <h3 className="mt-5 font-display text-2xl font-bold">Fill the sheet</h3>
          <p className="mt-2 text-night-950/80">Boy, girl, animal, place, food. All starting with the letter.</p>
        </article>

        <article className="rounded-3xl bg-pink p-6 text-white md:col-span-2">
          <HandPalm size={44} weight="fill" aria-hidden />
          <h3 className="mt-5 font-display text-2xl font-bold">First done shouts STOP</h3>
          <p className="mt-2 text-white/85">The moment one player fills all five, everyone's pencils go down.</p>
        </article>

        <article className="surface rounded-3xl p-6 md:col-span-4">
          <div className="flex items-center gap-2 text-ink-dim">
            <UsersThree size={22} weight="duotone" aria-hidden />
            <h3 className="font-display text-2xl font-bold text-ink">Vote, then score</h3>
          </div>
          <p className="mt-2 max-w-[52ch] text-ink-dim">Everyone reviews the answers together. Majority decides what counts.</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['100', 'unique answer'],
              ['50', 'each, if two match'],
              ['33.3', 'each, if three match'],
              ['0', 'rejected or blank'],
            ].map(([pts, label]) => (
              <div key={label} className="rounded-2xl bg-night-950/50 p-4">
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl font-extrabold text-sun tabular">{pts}</dd>
                <dd className="mt-1 text-sm text-ink-dim">{label}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </section>
  );
}
