import type { DrawMode, DrawSession, RandomSource } from '../../domain';
import {
  endDrawSession,
  isComplete,
  nextPrizeIndex,
  numberForPrize,
  pickAvailableNumber,
  recordDraw,
  startDrawSession,
  totalDraws,
  undoLastDraw,
} from '../../domain';
import type { GameConfig } from '../setup/validateSetup';

export function startGame(config: GameConfig): DrawSession {
  return startDrawSession(config.range, config.prizes);
}

/** Decides the winning number for the next draw (before the animation runs). */
export function pickNextNumber(session: DrawSession, random: RandomSource): number {
  return pickAvailableNumber(session, random);
}

export function commitDraw(session: DrawSession, value: number): DrawSession {
  return recordDraw(session, value);
}

/** Undo the last draw so the same round can be drawn again. */
export function retryLastDraw(session: DrawSession): DrawSession {
  return undoLastDraw(session);
}

export function finishGame(session: DrawSession): DrawSession {
  return endDrawSession(session);
}

export interface PrizeRef {
  readonly index: number;
  /** 1-based order shown to users ("Prize #1"). */
  readonly order: number;
  readonly name: string;
}

export interface DrawProgress {
  readonly mode: DrawMode;
  readonly drawn: number;
  readonly total: number;
  readonly complete: boolean;
  readonly endedEarly: boolean;
  readonly currentPrize: PrizeRef | null;
}

function prizeRef(session: DrawSession, index: number): PrizeRef {
  return { index, order: index + 1, name: session.prizes[index]?.name ?? '' };
}

export function getDrawProgress(session: DrawSession): DrawProgress {
  const idx = nextPrizeIndex(session);
  return {
    mode: session.mode,
    drawn: session.entries.length,
    total: totalDraws(session),
    complete: isComplete(session),
    endedEarly: session.endedEarly,
    currentPrize: idx === null ? null : prizeRef(session, idx),
  };
}

export interface DrawResultView {
  readonly number: number;
  readonly prize: PrizeRef | null;
}

export function getLastResult(session: DrawSession): DrawResultView | null {
  const entry = session.entries[session.entries.length - 1];
  if (!entry) return null;
  return {
    number: entry.number,
    prize: entry.prizeIndex === null ? null : prizeRef(session, entry.prizeIndex),
  };
}

export interface SummaryRow {
  readonly label: string;
  readonly prizeName: string | null;
  readonly number: number | null;
}

export function getSummary(session: DrawSession): SummaryRow[] {
  if (session.mode === 'free') {
    return session.entries.map((e, i) => ({ label: `Draw #${i + 1}`, prizeName: null, number: e.number }));
  }
  return session.prizes.map((p, i) => ({
    label: `Prize #${i + 1}`,
    prizeName: p.name,
    number: numberForPrize(session, i),
  }));
}

export interface LedgerItem {
  readonly key: string;
  readonly label: string;
  readonly short: string;
  readonly number: number | null;
  /** Prize index (prize mode) or draw index (free mode); used for colouring. */
  readonly index: number;
  readonly current: boolean;
}

/** Prize mode: every prize in draw order (last prize first). Free mode: numbers drawn so far. */
export function getLedger(session: DrawSession): LedgerItem[] {
  if (session.mode === 'free') {
    return session.entries.map((e, i) => ({
      key: `d${i}`,
      label: `Draw #${i + 1}`,
      short: `#${i + 1}`,
      number: e.number,
      index: i,
      current: false,
    }));
  }
  const current = nextPrizeIndex(session);
  const items: LedgerItem[] = [];
  for (let idx = session.prizes.length - 1; idx >= 0; idx--) {
    items.push({
      key: session.prizes[idx].id,
      label: `Prize #${idx + 1}`,
      short: `P${idx + 1}`,
      number: numberForPrize(session, idx),
      index: idx,
      current: idx === current,
    });
  }
  return items;
}
