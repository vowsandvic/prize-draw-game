import { useMemo } from 'react';
import { PALETTE } from '../theme/themes';

const COLORS = [...PALETTE, 'var(--color-accent)'];
const PIECES = 36;

/** One-shot confetti burst; change `burstKey` to fire a new one. */
export function Confetti({ burstKey }: { burstKey: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: PIECES }, (_, i) => {
        const size = `${7 + Math.floor(Math.random() * 9)}px`;
        return {
          key: `${burstKey}-${i}`,
          style: {
            left: `${Math.random() * 100}%`,
            width: size,
            height: size,
            background: COLORS[Math.floor(Math.random() * COLORS.length)],
            borderRadius: Math.random() < 0.5 ? '50%' : 0,
            transform: `rotate(${Math.floor(Math.random() * 360)}deg)`,
            animation: `pdConfetti 1.8s ease-in ${Math.random() * 0.4}s forwards`,
          },
        };
      }),
    [burstKey],
  );
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span key={p.key} style={p.style} />
      ))}
    </div>
  );
}
