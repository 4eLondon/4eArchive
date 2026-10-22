import { CircleNotch } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import type { Player } from '../../shared/types';

// ─── Colours ──────────────────────────────────────────────────────────────

export const PLAYER_COLORS = [
  '#ff7ab6',
  '#2ee6f2',
  '#ffd23f',
  '#45f0a6',
  '#a98bff',
  '#ff9f45',
  '#5aa9ff',
  '#f2665f',
  '#b6f25c',
  '#ff6be1',
  '#4fd1c5',
  '#ffc2a1',
];
export const playerColor = (p: Pick<Player, 'hue'>) => PLAYER_COLORS[p.hue % PLAYER_COLORS.length];

const CAPS = {
  sun: ['var(--color-sun)', 'var(--color-sun-deep)'],
  pink: ['var(--color-pink)', 'var(--color-pink-deep)'],
  cyan: ['var(--color-cyan)', 'var(--color-cyan-deep)'],
  night: ['#2a2f6b', '#141838'],
  ghost: ['#20244f', '#11143a'],
} as const;
export type CapColor = keyof typeof CAPS;

// ─── Keycap: the brand's core shape ──────────────────────────────────────

export function Keycap({
  children,
  color = 'sun',
  size = 64,
  className = '',
  style,
  dim = false,
}: {
  children: ReactNode;
  color?: CapColor;
  size?: number;
  className?: string;
  style?: CSSProperties;
  dim?: boolean;
}) {
  const [cap, deep] = CAPS[color];
  return (
    <span
      className={`keycap select-none ${className}`}
      style={
        {
          '--cap': cap,
          '--cap-deep': deep,
          '--depth': `${Math.max(3, Math.round(size / 11))}px`,
          width: size,
          height: size,
          fontSize: size * 0.58,
          borderRadius: Math.max(10, size * 0.24),
          color: color === 'night' || color === 'ghost' ? 'var(--color-ink)' : undefined,
          opacity: dim ? 0.35 : 1,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </span>
  );
}

export function Logo({ size = 40, wordmark = true }: { size?: number; wordmark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3" aria-label="ABC Fast or Slow">
      <span className="inline-flex items-end gap-1" aria-hidden>
        <Keycap color="pink" size={size} style={{ transform: 'rotate(-6deg)' }}>
          A
        </Keycap>
        <Keycap color="sun" size={size} style={{ transform: 'translateY(-3px)' }}>
          B
        </Keycap>
        <Keycap color="cyan" size={size} style={{ transform: 'rotate(5deg)' }}>
          C
        </Keycap>
      </span>
      {wordmark && (
        <span className="font-display font-extrabold leading-[0.9] tracking-tight" style={{ fontSize: size * 0.42 }} aria-hidden>
          Fast
          <span className="text-ink-mute font-semibold"> or </span>
          <br />
          Slow
        </span>
      )}
    </span>
  );
}

// ─── Buttons ──────────────────────────────────────────────────────────────

type Variant = 'primary' | 'stop' | 'cyan' | 'ghost' | 'quiet';
const VARIANT: Record<Variant, string> = {
  primary:
    'bg-sun text-night-950 shadow-[inset_0_2px_0_rgb(255_255_255/0.5),0_5px_0_var(--color-sun-deep),0_14px_28px_-10px_rgb(255_210_63/0.45)] hover:brightness-105 active:translate-y-[4px] active:shadow-[inset_0_2px_0_rgb(255_255_255/0.5),0_1px_0_var(--color-sun-deep)]',
  stop: 'bg-pink text-white shadow-[inset_0_2px_0_rgb(255_255_255/0.35),0_5px_0_var(--color-pink-deep),0_14px_28px_-10px_rgb(255_61_139/0.5)] hover:brightness-105 active:translate-y-[4px] active:shadow-[inset_0_2px_0_rgb(255_255_255/0.35),0_1px_0_var(--color-pink-deep)]',
  cyan: 'bg-cyan text-night-950 shadow-[inset_0_2px_0_rgb(255_255_255/0.45),0_5px_0_var(--color-cyan-deep),0_14px_28px_-10px_rgb(46_230_242/0.4)] hover:brightness-105 active:translate-y-[4px] active:shadow-[inset_0_2px_0_rgb(255_255_255/0.45),0_1px_0_var(--color-cyan-deep)]',
  ghost:
    'bg-night-700/70 text-ink border border-white/10 hover:bg-night-600/80 active:translate-y-[1px] active:bg-night-600',
  quiet: 'text-ink-dim hover:text-ink hover:bg-white/5 active:bg-white/10',
};
const SIZE = {
  sm: 'min-h-10 px-4 text-sm gap-2',
  md: 'min-h-12 px-5 sm:px-6 text-base gap-2',
  lg: 'min-h-14 px-5 sm:px-7 text-lg gap-2 sm:gap-3',
  xl: 'min-h-16 px-5 sm:px-9 text-lg sm:text-xl gap-2 sm:gap-3',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: keyof typeof SIZE; loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex min-w-0 max-w-full select-none items-center justify-center text-center leading-tight rounded-full font-display font-bold tracking-tight transition-[transform,box-shadow,filter,background-color,color] duration-150 ease-[var(--ease-snap)] disabled:cursor-not-allowed disabled:opacity-45 disabled:translate-y-0 disabled:shadow-none disabled:saturate-50 ${VARIANT[variant]} ${SIZE[size]} ${className}`}
    >
      {loading ? <CircleNotch className="animate-spin" size={20} weight="bold" aria-hidden /> : children}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      {...rest}
      aria-label={label}
      title={label}
      className={`grid size-10 shrink-0 place-items-center rounded-full text-ink-dim sm:size-11 transition-colors hover:bg-white/8 hover:text-ink active:bg-white/12 ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Avatars ──────────────────────────────────────────────────────────────

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '?') + (parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? ''))).toUpperCase();
}

export function Avatar({ player, size = 40, ring = false }: { player: Player; size?: number; ring?: boolean }) {
  const c = playerColor(player);
  return (
    <span
      aria-hidden
      className="relative grid shrink-0 place-items-center rounded-full font-display font-extrabold text-night-950"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `radial-gradient(circle at 30% 25%, color-mix(in oklab, ${c} 75%, white), ${c} 70%)`,
        boxShadow: ring ? `0 0 0 3px var(--color-night-900), 0 0 0 5px ${c}` : 'inset 0 -2px 0 rgb(0 0 0 / 0.15)',
        opacity: player.connected ? 1 : 0.45,
      }}
    >
      {initials(player.name)}
    </span>
  );
}

// ─── Misc ─────────────────────────────────────────────────────────────────

export function Segmented<T extends string | number | null>({
  value,
  options,
  onChange,
  label,
  disabled,
}: {
  value: T;
  options: { value: T; label: ReactNode; aria?: string }[];
  onChange: (v: T) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="relative flex rounded-full bg-night-900/80 p-1 ring-1 ring-white/8">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            role="radio"
            aria-checked={active}
            aria-label={o.aria}
            disabled={disabled}
            onClick={() => onChange(o.value)}
            className={`relative z-0 flex min-h-10 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-1 text-center text-sm leading-tight font-semibold transition-colors disabled:cursor-not-allowed ${active ? 'text-night-950' : 'text-ink-dim hover:text-ink'}`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 -z-10 rounded-full bg-cyan"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-night-800/80 ${className}`} />;
}

/** Creator signature shown on every screen. */
export function Watermark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none select-none font-display text-[10px] font-extrabold uppercase tracking-[0.06em] text-ink-mute/80 sm:text-[11px] sm:tracking-[0.2em] ${className}`}
      aria-label="Made by CawayneDaley"
    >
      Cawayne<span className="text-sun/90">Daley</span>
    </span>
  );
}
