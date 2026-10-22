import { Check, Crown, X } from '@phosphor-icons/react';
import { AnimatePresence, motion } from 'motion/react';
import type { Player, RoomView } from '../../shared/types';
import { ALPHABET } from '../../shared/constants';
import { Avatar, playerColor } from './ui';

export function PlayerRow({
  player,
  view,
  right,
  showReady = false,
  onKick,
}: {
  player: Player;
  view: RoomView;
  right?: React.ReactNode;
  showReady?: boolean;
  onKick?: () => void;
}) {
  const isHost = view.hostId === player.id;
  const isYou = view.you === player.id;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      className="flex min-h-16 items-center gap-3 rounded-2xl px-3 py-2"
      style={isYou ? { background: 'rgb(46 230 242 / 0.07)', boxShadow: 'inset 0 0 0 1px rgb(46 230 242 / 0.25)' } : undefined}
    >
      <Avatar player={player} size={42} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold">{player.name}</span>
          {isYou && <span className="shrink-0 rounded-full bg-cyan/15 px-2 py-0.5 text-xs font-semibold text-cyan">You</span>}
          {isHost && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-sun" title="Host">
              <Crown size={14} weight="fill" aria-hidden /> Host
            </span>
          )}
        </div>
        <div className="text-xs text-ink-mute">
          {!player.connected ? 'Offline, seat saved' : showReady ? (isHost ? 'Sets up the game' : player.ready ? 'Ready' : 'Not ready yet') : 'Online'}
        </div>
      </div>
      {showReady && player.connected && !isHost && (
        <span
          className={`grid size-8 place-items-center rounded-full transition-colors ${player.ready ? 'bg-mint text-night-950' : 'bg-white/6 text-ink-mute'}`}
          aria-hidden
        >
          <Check size={16} weight="bold" />
        </span>
      )}
      {right}
      {onKick && (
        <button
          onClick={onKick}
          aria-label={`Remove ${player.name}`}
          className="grid size-9 place-items-center rounded-full text-ink-mute hover:bg-pink/15 hover:text-pink"
        >
          <X size={16} weight="bold" />
        </button>
      )}
    </motion.li>
  );
}

export function PlayerList({ view, showReady, onKick }: { view: RoomView; showReady?: boolean; onKick?: (p: Player) => void }) {
  const players = view.players.filter((p) => !p.left).sort((a, b) => a.joinedAt - b.joinedAt);
  return (
    <ul className="space-y-1.5">
      <AnimatePresence initial={false}>
        {players.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            view={view}
            showReady={showReady}
            onKick={onKick && p.id !== view.you ? () => onKick(p) : undefined}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}

/** Small overlapping avatar stack. */
export function AvatarStack({ players, max = 6 }: { players: Player[]; max?: number }) {
  return (
    <div className="flex -space-x-2">
      {players.slice(0, max).map((p) => (
        <span key={p.id} className="rounded-full ring-2 ring-night-950" title={p.name}>
          <Avatar player={p} size={30} />
        </span>
      ))}
      {players.length > max && (
        <span className="grid size-[30px] place-items-center rounded-full bg-night-700 text-xs font-bold ring-2 ring-night-950">
          +{players.length - max}
        </span>
      )}
    </div>
  );
}

export function LetterPool({ used, current }: { used: string[]; current?: string | null }) {
  const usedSet = new Set(used);
  const left = 26 - usedSet.size;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between text-sm">
        <span className="font-semibold text-ink-dim">Letter pool</span>
        <span className="text-ink-mute tabular">{left} of 26 left</span>
      </div>
      <div className="grid grid-cols-13 gap-1" aria-label={`Letters used: ${used.join(', ') || 'none'}`}>
        {ALPHABET.map((l) => {
          const isCurrent = l === current;
          const isUsed = usedSet.has(l);
          return (
            <span
              key={l}
              aria-hidden
              className={`grid aspect-square place-items-center rounded-md font-display text-xs font-bold sm:text-sm ${
                isCurrent ? 'bg-sun text-night-950' : isUsed ? 'bg-white/3 text-ink-mute/50 line-through' : 'bg-white/8 text-ink'
              }`}
            >
              {l}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function NameTag({ player, you }: { player: Player; you?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: playerColor(player) }}>
      {you ? 'You' : player.name}
    </span>
  );
}
