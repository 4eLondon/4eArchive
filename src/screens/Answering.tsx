import { Check, HandPalm, Hourglass, Lightning, Prohibit, WarningCircle } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ANSWER_MAX, CATEGORY_BY_ID, type CategoryId } from '../../shared/constants';
import { checkAnswer } from '../../shared/normalize';
import type { RoomView } from '../../shared/types';
import { CATEGORY_ICON } from '../components/categoryIcons';
import { Avatar, Button, Keycap } from '../components/ui';
import { announce, useAct, useOnChange, useServerNow } from '../lib/hooks';
import { sfx } from '../lib/sound';
import { game } from '../state/game';

type Sheet = Partial<Record<CategoryId, string>>;

export function Answering({ view }: { view: RoomView }) {
  const round = view.round!;
  const letter = round.letter!;
  const me = view.you;
  const isHost = view.hostId === me;
  const playing = round.participants.includes(me);
  const now = useServerNow(100);
  const remainingMs = Math.max(0, round.deadline! - now);
  const stopped = round.stoppedAt !== null || remainingMs <= 0;
  const { act, busy } = useAct();

  // ── local sheet + debounced draft sync ──
  const [sheet, setSheet] = useState<Sheet>(() => ({ ...(round.answers[me] ?? {}) }));
  const dirty = useRef<Sheet>({});
  const timer = useRef<number>(0);
  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    const answers = dirty.current;
    if (!Object.keys(answers).length) return;
    dirty.current = {};
    void game.act({ type: 'save_draft', answers }).catch(() => {
      /* late drafts after STOP are expected to bounce */
    });
  }, []);
  const update = (cat: CategoryId, value: string) => {
    if (stopped) return;
    const v = value.slice(0, ANSWER_MAX);
    setSheet((s) => ({ ...s, [cat]: v }));
    dirty.current[cat] = v;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, 250);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const checks = round.categories.map((c) => checkAnswer(sheet[c], letter));
  const validCount = checks.filter((c) => c === 'ok').length;
  const allValid = validCount === round.categories.length;
  const submitted = round.submitted.includes(me);

  async function submit() {
    if (!allValid || stopped) return;
    window.clearTimeout(timer.current);
    dirty.current = {};
    sfx.unlock();
    await act({ type: 'submit_answers', answers: sheet });
  }

  // STOP moment: flush whatever was typed (it may still land inside the grace window).
  useOnChange(round.stoppedAt, (s) => {
    if (s === null) return;
    flush();
    sfx.stop();
    const who = view.players.find((p) => p.id === round.stoppedBy);
    announce(
      round.endReason === 'first_finished'
        ? `STOP! ${who?.id === me ? 'You' : who?.name} finished first. Pencils down.`
        : round.endReason === 'host'
          ? 'The host stopped the round.'
          : "Time's up!",
    );
  });

  // Countdown beeps in the final seconds.
  const secs = Math.ceil(remainingMs / 1000);
  const lastBeep = useRef(secs);
  useEffect(() => {
    if (secs !== lastBeep.current && !stopped) {
      lastBeep.current = secs;
      if (secs <= 5 && secs > 0) sfx.countdown(true);
      else if (secs === 10) {
        sfx.countdown(false);
        announce('10 seconds left');
      }
    }
  }, [secs, stopped]);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  // Phones get a slimmer pinned header so more of the sheet is visible.
  const compact = typeof window !== 'undefined' && window.innerWidth < 480;

  return (
    <div className="relative mx-auto flex w-full max-w-3xl flex-1 flex-col pb-32">
      {/* Status header stays pinned so the letter and clock are always visible */}
      <div className="sticky top-16 z-10 bg-night-950/85 px-4 pt-2.5 pb-2.5 backdrop-blur-md sm:pt-3 sm:pb-3">
        <div className="flex items-center gap-3 sm:gap-4">
          <Keycap size={compact ? 58 : 76} color="sun">
            {letter}
          </Keycap>
          <div className="min-w-0 flex-1">
            <h1 tabIndex={-1} className="font-display text-xl font-extrabold leading-tight focus:outline-none sm:text-2xl">
              Starts with <span className="text-sun">{letter}</span>
            </h1>
            <div className="mt-1 flex items-center gap-2 text-sm text-ink-dim">
              {round.speed === 'fast' ? <Lightning size={14} weight="fill" className="text-pink" aria-hidden /> : <Hourglass size={14} weight="fill" className="text-cyan" aria-hidden />}
              <span>
                {round.speed === 'fast' ? 'Fast' : 'Slow'} · {validCount}/{round.categories.length} done
              </span>
            </div>
            <Progress total={round.categories.length} checks={checks} />
          </div>
          <Countdown remainingMs={remainingMs} totalMs={round.deadline! - round.startedAt!} stopped={stopped} />
        </div>
        <Opponents view={view} />
      </div>

      {!playing ? (
        <div className="mx-4 mt-6 rounded-3xl border border-dashed border-white/15 p-6 text-center">
          <p className="font-display text-xl font-bold">You'll jump in next round</p>
          <p className="mt-1 text-ink-dim">This round started before you joined. Watch the race above.</p>
        </div>
      ) : (
        <form
          className="mt-2 space-y-2.5 px-4 sm:mt-3 sm:space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {round.categories.map((cat, i) => (
            <CategoryInput
              key={cat}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              cat={cat}
              letter={letter}
              value={sheet[cat] ?? ''}
              check={checks[i]}
              disabled={stopped}
              autoFocus={i === 0}
              last={i === round.categories.length - 1}
              onChange={(v) => update(cat, v)}
              onBlur={flush}
              onEnter={() => {
                const next = inputs.current.slice(i + 1).find((el, j) => el && checks[i + 1 + j] !== 'ok') ?? inputs.current[i + 1];
                if (next) next.focus();
                else if (allValid) submit();
              }}
            />
          ))}
          <button type="submit" hidden />
        </form>
      )}

      {/* Thumb-zone STOP button */}
      {playing && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/6 bg-night-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            {isHost && !stopped && (
              <Button
                variant="ghost"
                size="lg"
                className="px-4"
                aria-label="End round for everyone"
                title="End round for everyone"
                onClick={() => confirm('End this round for everyone now?') && act({ type: 'host_end_round' })}
              >
                <Prohibit size={20} weight="bold" aria-hidden />
                <span className="hidden sm:inline">End round</span>
              </Button>
            )}
            <Button variant="stop" size="xl" className="flex-1" disabled={!allValid || stopped || submitted} loading={busy === 'submit_answers'} onClick={submit}>
              <HandPalm size={26} weight="fill" aria-hidden />
              {submitted ? 'Submitted' : allValid ? 'STOP! I’m done' : `Fill ${round.categories.length - validCount} more`}
            </Button>
          </div>
        </div>
      )}

      <AnimatePresence>{round.stoppedAt !== null && <StopOverlay view={view} />}</AnimatePresence>
    </div>
  );
}

const CategoryInput = ({
  ref,
  cat,
  letter,
  value,
  check,
  disabled,
  autoFocus,
  last,
  onChange,
  onBlur,
  onEnter,
}: {
  ref: React.Ref<HTMLInputElement>;
  cat: CategoryId;
  letter: string;
  value: string;
  check: ReturnType<typeof checkAnswer>;
  disabled: boolean;
  autoFocus: boolean;
  last: boolean;
  onChange: (v: string) => void;
  onBlur: () => void;
  onEnter: () => void;
}) => {
  const def = CATEGORY_BY_ID[cat];
  const Icon = CATEGORY_ICON[cat];
  const id = `ans-${cat}`;
  const ok = check === 'ok';
  const wrong = check === 'wrong_letter';
  return (
    <motion.div
      animate={ok ? { scale: [1, 1.015, 1] } : { scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`rounded-[20px] border px-3.5 py-2.5 transition-colors sm:p-3 sm:pl-4 ${
        ok ? 'border-mint/40 bg-mint/[0.06]' : wrong ? 'border-pink/50 bg-pink/[0.06]' : 'border-white/8 bg-night-850/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="flex items-center gap-2 font-display text-base font-bold">
          <Icon size={18} weight="duotone" className={ok ? 'text-mint' : 'text-ink-dim'} aria-hidden />
          {def.label}
          <span className="font-sans text-sm font-normal text-ink-mute">{def.hint}</span>
        </label>
        <span aria-hidden className={`grid size-7 place-items-center rounded-full transition-colors ${ok ? 'bg-mint text-night-950' : wrong ? 'bg-pink text-white' : 'bg-white/6 text-transparent'}`}>
          {wrong ? <WarningCircle size={16} weight="bold" /> : <Check size={15} weight="bold" />}
        </span>
      </div>
      <input
        id={id}
        ref={ref}
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onEnter();
          }
        }}
        enterKeyHint={last ? 'done' : 'next'}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="words"
        spellCheck={false}
        maxLength={ANSWER_MAX}
        placeholder={`${letter}...`}
        aria-invalid={wrong || undefined}
        aria-describedby={wrong ? `${id}-err` : undefined}
        className="mt-0.5 h-11 w-full bg-transparent font-display text-[22px] sm:h-12 sm:text-2xl font-semibold text-ink placeholder:text-ink-mute/60 focus:outline-none disabled:opacity-60"
      />
      {wrong && (
        <p id={`${id}-err`} className="text-sm text-[#ff9cc2]">
          Must start with {letter}
        </p>
      )}
    </motion.div>
  );
};

function Progress({ total, checks }: { total: number; checks: string[] }) {
  return (
    <div className="mt-2 flex gap-1" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
          <motion.span
            className="block h-full rounded-full bg-mint"
            initial={false}
            animate={{ width: checks[i] === 'ok' ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </span>
      ))}
    </div>
  );
}

function Countdown({ remainingMs, totalMs, stopped }: { remainingMs: number; totalMs: number; stopped: boolean }) {
  const secs = Math.ceil(remainingMs / 1000);
  const frac = totalMs > 0 ? remainingMs / totalMs : 0;
  const urgent = secs <= 10 && !stopped;
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <motion.div
      className="relative grid size-16 shrink-0 place-items-center sm:size-[76px]"
      animate={urgent && secs <= 5 ? { scale: [1, 1.08, 1] } : { scale: 1 }}
      transition={urgent ? { duration: 1, repeat: Infinity } : undefined}
      role="timer"
      aria-label={`${secs} seconds left`}
    >
      <svg viewBox="0 0 76 76" className="absolute inset-0 size-full -rotate-90" aria-hidden>
        <circle cx="38" cy="38" r={r} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="7" />
        <circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke={urgent ? 'var(--color-pink)' : 'var(--color-cyan)'}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
          style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`font-display text-2xl font-extrabold tabular ${urgent ? 'text-pink' : 'text-ink'}`} aria-hidden>
        {stopped ? 0 : secs}
      </span>
    </motion.div>
  );
}

function Opponents({ view }: { view: RoomView }) {
  const round = view.round!;
  const others = view.players.filter((p) => round.participants.includes(p.id) && p.id !== view.you);
  if (!others.length) return null;
  return (
    <ul className="mt-2.5 flex flex-wrap gap-2" aria-label="Other players' progress">
      {others.map((p) => {
        const filled = round.progress[p.id] ?? 0;
        const done = round.submitted.includes(p.id);
        return (
          <li key={p.id} className="flex shrink-0 items-center gap-2 rounded-full bg-white/5 py-1 pr-3 pl-1" aria-label={`${p.name}: ${done ? 'finished' : `${filled} of ${round.categories.length} filled`}${p.connected ? '' : ', offline'}`}>
            <Avatar player={p} size={26} />
            <span className="max-w-20 truncate text-sm font-medium">{p.name}</span>
            <span className="flex gap-0.5" aria-hidden>
              {round.categories.map((_, i) => (
                <span key={i} className={`size-1.5 rounded-full ${i < filled ? (done ? 'bg-mint' : 'bg-cyan') : 'bg-white/15'}`} />
              ))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function StopOverlay({ view }: { view: RoomView }) {
  const round = view.round!;
  const who = view.players.find((p) => p.id === round.stoppedBy);
  const text =
    round.endReason === 'first_finished'
      ? `${who?.id === view.you ? 'You' : (who?.name ?? 'Someone')} finished first`
      : round.endReason === 'host'
        ? 'The host ended the round'
        : "Time's up";
  return (
    <motion.div
      className="fixed inset-0 z-40 grid place-items-center bg-night-950/75 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="alertdialog"
      aria-label={`STOP. ${text}`}
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 3, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: -4, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 17 }}
          className="inline-block rounded-[32px] bg-pink px-10 py-6 font-display text-7xl font-extrabold text-white shadow-[0_10px_0_var(--color-pink-deep),0_40px_80px_-20px_rgb(255_61_139/0.7)] sm:text-8xl"
        >
          STOP!
        </motion.div>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mt-8 font-display text-2xl font-bold">
          {text}
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-1 text-ink-dim">
          Pencils down. Review is next.
        </motion.p>
      </div>
    </motion.div>
  );
}
