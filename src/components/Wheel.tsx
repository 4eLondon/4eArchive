import { ALPHABET } from '../../shared/constants';

const SEG = 360 / 26;
const R = 150; // svg units

/** Rotation (deg) that puts `letter` under the top pointer after `spins` full turns. */
export function wheelTarget(letter: string, spins = 6): number {
  const i = ALPHABET.indexOf(letter);
  return spins * 360 + (360 - (i * SEG + SEG / 2));
}

/** Realistic deceleration: fast start, long friction tail. */
export const easeOutWheel = (p: number) => 1 - Math.pow(1 - p, 4);

export function LetterWheel({
  rotation,
  used,
  target,
  landed,
  size = 320,
}: {
  rotation: number;
  used: string[];
  target?: string | null;
  landed: boolean;
  size?: number;
}) {
  const usedSet = new Set(used);
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* pointer */}
      <svg viewBox="0 0 40 44" className="absolute left-1/2 z-10 -translate-x-1/2" style={{ top: -10, width: size * 0.11 }} aria-hidden>
        <path d="M20 42 L4 8 Q20 -4 36 8 Z" fill="var(--color-pink)" stroke="var(--color-night-950)" strokeWidth="3" />
      </svg>
      <svg
        viewBox={`${-R - 12} ${-R - 12} ${2 * R + 24} ${2 * R + 24}`}
        width={size}
        height={size}
        role="img"
        aria-label={landed && target ? `Wheel landed on ${target}` : 'Alphabet wheel'}
        style={{ filter: 'drop-shadow(0 24px 40px rgb(0 0 0 / 0.5))' }}
      >
        <circle r={R + 10} fill="var(--color-sun-deep)" />
        <circle r={R + 7} fill="var(--color-sun)" />
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '0 0', willChange: 'transform' }}>
          {ALPHABET.map((l, i) => {
            const a0 = ((i * SEG - 90) * Math.PI) / 180;
            const a1 = (((i + 1) * SEG - 90) * Math.PI) / 180;
            const mid = i * SEG + SEG / 2;
            const isUsed = usedSet.has(l) && l !== target;
            const isTarget = landed && l === target;
            const fill = isTarget ? 'var(--color-sun)' : i % 2 ? '#1b2050' : '#262c66';
            return (
              <g key={l}>
                <path
                  d={`M0 0 L${R * Math.cos(a0)} ${R * Math.sin(a0)} A${R} ${R} 0 0 1 ${R * Math.cos(a1)} ${R * Math.sin(a1)} Z`}
                  fill={fill}
                  stroke="#0b0d24"
                  strokeWidth="1.5"
                />
                <text
                  transform={`rotate(${mid}) translate(0 ${-R + 24})`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-display)"
                  fontWeight="800"
                  fontSize="19"
                  fill={isTarget ? '#07081a' : isUsed ? 'rgb(132 135 179 / 0.35)' : '#f4f2ff'}
                  textDecoration={isUsed ? 'line-through' : undefined}
                >
                  {l}
                </text>
              </g>
            );
          })}
          {ALPHABET.map((_, i) => {
            const a = ((i * SEG - 90) * Math.PI) / 180;
            return <circle key={i} cx={(R + 3.5) * Math.cos(a)} cy={(R + 3.5) * Math.sin(a)} r="2.6" fill="#7a5a00" />;
          })}
        </g>
        <circle r="46" fill="#0b0d24" />
        <circle r="40" fill="url(#hub)" />
        <defs>
          <radialGradient id="hub" cx="35%" cy="30%">
            <stop offset="0" stopColor="#ff7ab6" />
            <stop offset="1" stopColor="var(--color-pink)" />
          </radialGradient>
        </defs>
        <text textAnchor="middle" dominantBaseline="central" fontFamily="var(--font-display)" fontWeight="800" fontSize={landed && target ? 44 : 22} fill="#fff">
          {landed && target ? target : 'ABC'}
        </text>
      </svg>
    </div>
  );
}
