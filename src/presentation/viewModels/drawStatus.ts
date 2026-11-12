import type { DrawProgress } from '../../application';
import type { NumberRange } from '../../domain';

export interface DrawStatusView {
  kicker: string;
  title: string;
  sub: string;
  progress: string;
}

/** Turns use-case progress into the copy shown on the Draw screen. */
export function toDrawStatus(p: DrawProgress, range: NumberRange): DrawStatusView {
  if (p.mode === 'free') {
    return {
      kicker: p.complete ? 'All done' : 'Free draw',
      title: p.endedEarly ? 'Free draw finished!' : p.complete ? 'Every number is out!' : `Draw #${p.drawn + 1}`,
      sub: p.complete ? '' : `${range.start} to ${range.end}, no repeats`,
      progress: `${p.drawn} / ${p.total} numbers`,
    };
  }
  return {
    kicker: p.complete ? 'All done' : 'Up next',
    title: p.complete || !p.currentPrize ? 'All prizes drawn!' : `Prize #${p.currentPrize.order}`,
    sub: p.currentPrize?.name ?? '',
    progress: `${p.drawn} / ${p.total} prizes`,
  };
}
