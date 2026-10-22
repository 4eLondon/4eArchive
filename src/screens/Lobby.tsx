import { ArrowsClockwise, Check, Copy, Hourglass, Infinity as InfinityIcon, Lightning, Minus, Play, Plus, ShareNetwork } from '@phosphor-icons/react';
import { useState } from 'react';
import { CATEGORIES, MIN_PLAYERS_TO_START, TIMER_LIMITS, type CategoryId } from '../../shared/constants';
import type { RoomView, Settings } from '../../shared/types';
import { LetterPool, PlayerList } from '../components/Players';
import { Button, Keycap, Segmented } from '../components/ui';
import { toast, useAct } from '../lib/hooks';
import { roomUrl } from '../lib/router';

export function Lobby({ view }: { view: RoomView }) {
  const { act, busy } = useAct();
  const isHost = view.hostId === view.you;
  const me = view.players.find((p) => p.id === view.you)!;
  const active = view.players.filter((p) => !p.left);
  const online = active.filter((p) => p.connected);
  const notReady = online.filter((p) => !p.ready && p.id !== view.hostId);
  const canStart = online.length >= MIN_PLAYERS_TO_START;

  function start() {
    if (notReady.length && !confirm(`${notReady.map((p) => p.name).join(', ')} ${notReady.length === 1 ? 'is' : 'are'} not ready. Start anyway?`)) return;
    act({ type: 'start_match' });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-6 pb-36">
      <Invite code={view.code} />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <section aria-labelledby="players-h" className="surface rounded-3xl p-4 sm:p-5">
          <div className="mb-3 flex items-baseline justify-between px-1">
            <h2 id="players-h" tabIndex={-1} className="font-display text-xl font-bold focus:outline-none">
              Players
            </h2>
            <span className="text-sm text-ink-mute tabular">{active.length} / 12</span>
          </div>
          <PlayerList
            view={view}
            showReady
            onKick={
              isHost
                ? (p) => {
                    if (confirm(`Remove ${p.name} from the room?`)) act({ type: 'kick', playerId: p.id });
                  }
                : undefined
            }
          />
          {active.length < 2 && (
            <p className="mt-4 rounded-2xl border border-dashed border-white/12 p-4 text-sm text-ink-dim">
              Waiting for friends. Share the code or link above. You need at least {MIN_PLAYERS_TO_START} players to start.
            </p>
          )}
        </section>

        <section aria-labelledby="settings-h" className="surface rounded-3xl p-4 sm:p-5">
          <div className="mb-4 flex items-baseline justify-between px-1">
            <h2 id="settings-h" className="font-display text-xl font-bold">
              Game settings
            </h2>
            {!isHost && <span className="text-sm text-ink-mute">Host decides</span>}
          </div>
          <SettingsForm view={view} editable={isHost} onChange={(settings) => act({ type: 'update_settings', settings })} />
          <div className="mt-6 border-t border-white/6 pt-5">
            <LetterPool used={view.usedLetters} />
            {isHost && view.usedLetters.length > 0 && (
              <Button variant="quiet" size="sm" className="mt-2 -ml-3" onClick={() => act({ type: 'reset_letters' })}>
                <ArrowsClockwise size={16} weight="bold" aria-hidden /> Reset alphabet
              </Button>
            )}
          </div>
        </section>
      </div>

      {/* Thumb-zone action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/6 bg-night-950/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          {!isHost && (
            <Button
              variant={me.ready ? 'ghost' : 'cyan'}
              size="lg"
              className="flex-1 sm:flex-none"
              aria-pressed={me.ready}
              loading={busy === 'set_ready'}
              onClick={() => act({ type: 'set_ready', ready: !me.ready })}
            >
              {me.ready ? (
                <>
                  <Check size={20} weight="bold" aria-hidden /> Ready
                </>
              ) : (
                "I'm ready"
              )}
            </Button>
          )}
          {isHost ? (
            <>
              <p className="hidden flex-1 text-sm text-ink-dim sm:block">
                {canStart
                  ? notReady.length
                    ? `${notReady.length} not ready yet`
                    : 'Everyone is ready'
                  : `Need ${MIN_PLAYERS_TO_START - online.length} more player${MIN_PLAYERS_TO_START - online.length === 1 ? '' : 's'} online`}
              </p>
              <Button size="xl" className="flex-1 sm:flex-none" disabled={!canStart} loading={busy === 'start_match'} onClick={start}>
                <Play size={22} weight="fill" aria-hidden /> Start match
              </Button>
            </>
          ) : (
            <p className="flex-1 text-sm text-ink-dim">Waiting for the host to start.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Invite({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const url = roomUrl(code);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast(`Copy this link: ${url}`, 'info');
    }
  }
  async function share() {
    try {
      await navigator.share({ title: 'ABC Fast or Slow', text: `Join my ABC Fast or Slow room: ${code}`, url });
    } catch {
      /* dismissed */
    }
  }
  return (
    <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 tabIndex={-1} className="font-display text-3xl font-extrabold tracking-tight focus:outline-none sm:text-4xl">
          Get the crew in
        </h1>
        <p className="mt-1 text-ink-dim">Friends join with this code or the link, from any phone.</p>
        <div className="mt-4 flex gap-2" aria-label={`Room code ${code.split('').join(' ')}`}>
          {code.split('').map((l, i) => (
            <Keycap key={i} color={(['pink', 'sun', 'cyan', 'sun', 'pink', 'cyan'] as const)[i]} size={60}>
              {l}
            </Keycap>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" onClick={copy} aria-live="polite">
          {copied ? <Check size={18} weight="bold" aria-hidden /> : <Copy size={18} weight="bold" aria-hidden />}
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        {typeof navigator.share === 'function' && (
          <Button variant="ghost" onClick={share}>
            <ShareNetwork size={18} weight="bold" aria-hidden /> Share
          </Button>
        )}
      </div>
    </section>
  );
}

function Stepper({ label, value, onChange, disabled, icon }: { label: string; value: number; onChange: (v: number) => void; disabled: boolean; icon: React.ReactNode }) {
  const clamp = (v: number) => Math.min(TIMER_LIMITS.max, Math.max(TIMER_LIMITS.min, v));
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-night-900/70 p-2 pl-4 ring-1 ring-white/6">
      <span className="flex min-w-0 items-center gap-2 truncate text-sm font-semibold">
        {icon}
        {label}
      </span>
      <div className="flex shrink-0 items-center gap-1">
        <button
          aria-label={`Less time for ${label}`}
          disabled={disabled || value <= TIMER_LIMITS.min}
          onClick={() => onChange(clamp(value - 5))}
          className="grid size-10 place-items-center rounded-full bg-white/6 hover:bg-white/10 disabled:opacity-30"
        >
          <Minus size={16} weight="bold" />
        </button>
        <output className="w-14 text-center font-display text-lg font-bold tabular" aria-label={`${label} timer`}>
          {value}s
        </output>
        <button
          aria-label={`More time for ${label}`}
          disabled={disabled || value >= TIMER_LIMITS.max}
          onClick={() => onChange(clamp(value + 5))}
          className="grid size-10 place-items-center rounded-full bg-white/6 hover:bg-white/10 disabled:opacity-30"
        >
          <Plus size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}

export function SettingsForm({ view, editable, onChange }: { view: RoomView; editable: boolean; onChange: (s: Partial<Settings>) => void }) {
  const s = view.settings;
  const toggleCat = (id: CategoryId) => {
    const next = s.categories.includes(id) ? s.categories.filter((c) => c !== id) : [...s.categories, id];
    if (next.length < 3) return toast('Keep at least 3 categories.', 'info');
    // Keep the canonical order so everyone sees the same sheet.
    onChange({ categories: CATEGORIES.map((c) => c.id).filter((c) => next.includes(c)) });
  };
  return (
    <div className="space-y-5">
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold text-ink-dim">Letter picker</legend>
        <Segmented
          label="Letter picker"
          value={s.letterMode}
          disabled={!editable}
          onChange={(v) => onChange({ letterMode: v })}
          options={[
            { value: 'ticker', label: 'Alphabet ticker' },
            { value: 'wheel', label: 'Spin the wheel' },
          ]}
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold text-ink-dim">Round timers</legend>
        <Stepper
          label="Fast"
          icon={<Lightning size={16} weight="fill" className="text-pink" aria-hidden />}
          value={s.fastSeconds}
          disabled={!editable}
          onChange={(v) => onChange({ fastSeconds: v })}
        />
        <Stepper
          label="Slow"
          icon={<Hourglass size={16} weight="fill" className="text-cyan" aria-hidden />}
          value={s.slowSeconds}
          disabled={!editable}
          onChange={(v) => onChange({ slowSeconds: v })}
        />
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink-dim">Match length</legend>
        <Segmented<number | null>
          label="Match length"
          value={s.rounds}
          disabled={!editable}
          onChange={(v) => onChange({ rounds: v })}
          options={[
            { value: 3, label: '3' },
            { value: 5, label: '5' },
            { value: 7, label: '7' },
            { value: 10, label: '10' },
            { value: null, label: <InfinityIcon size={20} weight="bold" />, aria: 'Until we stop' },
          ]}
        />
        <p className="mt-2 text-xs text-ink-mute">{s.rounds ? `${s.rounds} rounds` : 'Play until the host ends the match'}</p>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-ink-dim">Categories, 100 points each</legend>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const on = s.categories.includes(c.id);
            return (
              <button
                key={c.id}
                aria-pressed={on}
                disabled={!editable}
                onClick={() => toggleCat(c.id)}
                className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors disabled:cursor-default ${
                  on ? 'bg-sun/15 text-sun ring-1 ring-sun/40' : 'bg-white/4 text-ink-mute ring-1 ring-white/8 hover:text-ink'
                }`}
              >
                {on && <Check size={14} weight="bold" aria-hidden />}
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
