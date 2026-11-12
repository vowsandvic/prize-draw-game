import type { NumberRange } from '../../domain';
import { paletteAt } from '../theme/themes';

interface NumberTileProps {
  display: string;
  range: NumberRange;
  rolling: boolean;
  pop: boolean;
  tick: number;
}

function fontSizeFor(range: NumberRange): string {
  const digits = Math.max(String(range.start).length, String(range.end).length);
  if (digits <= 2) return 'clamp(140px, 24vw, 340px)';
  if (digits === 3) return 'clamp(110px, 18vw, 250px)';
  if (digits === 4) return 'clamp(84px, 14vw, 190px)';
  return 'clamp(64px, 10vw, 140px)';
}

/** The big square that spins through numbers, with two playful shapes around it. */
export function NumberTile({ display, range, rolling, pop, tick }: NumberTileProps) {
  const idle = display === '?';
  const wobble = tick % 2 ? -2.5 : 2.5;

  const tileTransform = rolling ? `rotate(${wobble}deg) scale(0.98)` : pop ? 'rotate(0deg) scale(1.06)' : 'rotate(0deg) scale(1)';
  const tileBg = idle ? 'var(--color-surface)' : rolling ? paletteAt(tick) : 'var(--color-accent)';
  const tileFg = idle ? 'color-mix(in srgb, var(--color-text) 30%, transparent)' : rolling ? 'var(--c-ink)' : 'var(--color-bg)';
  const circleTransform = rolling ? 'translate(-6%, 6%) scale(0.92)' : pop ? 'translate(4%, -4%) scale(1.08)' : 'none';
  const squareTransform = rolling ? `rotate(${tick * 18}deg)` : pop ? 'rotate(45deg) scale(1.15)' : 'rotate(-8deg)';

  return (
    <div className="tile-wrap">
      <span className="tile-shape circle" style={{ transform: circleTransform }} aria-hidden="true" />
      <span className="tile-shape square" style={{ transform: squareTransform }} aria-hidden="true" />
      <div className="tile" style={{ background: tileBg, color: tileFg, transform: tileTransform }}>
        <div className="tile-number" style={{ fontSize: fontSizeFor(range) }} aria-live={rolling ? 'off' : 'polite'}>
          {display}
        </div>
      </div>
    </div>
  );
}
