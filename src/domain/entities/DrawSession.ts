import { DomainError } from '../DomainError';
import type { NumberRange } from '../valueObjects/NumberRange';
import { rangeContains, rangeSize } from '../valueObjects/NumberRange';
import type { Prize } from './Prize';

/**
 * - `prize`: each draw is tied to a prize, drawn from the last prize up to Prize #1.
 * - `free`:  no prizes configured; draw non-repeating numbers until the range runs out
 *            or the host ends the session.
 */
export type DrawMode = 'prize' | 'free';

export interface DrawEntry {
  readonly number: number;
  /** Index into `prizes`, or null in free mode. */
  readonly prizeIndex: number | null;
}

/** Immutable snapshot of a draw game. Every operation returns a new session. */
export interface DrawSession {
  readonly range: NumberRange;
  readonly prizes: readonly Prize[];
  readonly mode: DrawMode;
  readonly entries: readonly DrawEntry[];
  readonly endedEarly: boolean;
}

export function startDrawSession(range: NumberRange, prizes: readonly Prize[]): DrawSession {
  if (prizes.length > rangeSize(range)) {
    throw new DomainError(
      `Number of prizes (${prizes.length}) exceeds the numbers available in the range (${rangeSize(range)})`,
    );
  }
  return {
    range,
    prizes: [...prizes],
    mode: prizes.length === 0 ? 'free' : 'prize',
    entries: [],
    endedEarly: false,
  };
}

export function totalDraws(session: DrawSession): number {
  return session.mode === 'prize' ? session.prizes.length : rangeSize(session.range);
}

export function isComplete(session: DrawSession): boolean {
  return session.endedEarly || session.entries.length >= totalDraws(session);
}

/** The prize the next draw is for (last prize first, grand prize last), or null. */
export function nextPrizeIndex(session: DrawSession): number | null {
  if (session.mode === 'free' || isComplete(session)) return null;
  return session.prizes.length - 1 - session.entries.length;
}

export function drawnNumbers(session: DrawSession): ReadonlySet<number> {
  return new Set(session.entries.map((e) => e.number));
}

export function lastEntry(session: DrawSession): DrawEntry | null {
  return session.entries.length ? session.entries[session.entries.length - 1] : null;
}

export function numberForPrize(session: DrawSession, prizeIndex: number): number | null {
  return session.entries.find((e) => e.prizeIndex === prizeIndex)?.number ?? null;
}

export function recordDraw(session: DrawSession, value: number): DrawSession {
  if (isComplete(session)) throw new DomainError('The draw session is already complete');
  if (!rangeContains(session.range, value)) throw new DomainError(`${value} is outside the range`);
  if (drawnNumbers(session).has(value)) throw new DomainError(`${value} has already been drawn`);
  const entry: DrawEntry = { number: value, prizeIndex: nextPrizeIndex(session) };
  return { ...session, entries: [...session.entries, entry] };
}

/** Removes the most recent draw so the same round can be drawn again. */
export function undoLastDraw(session: DrawSession): DrawSession {
  if (session.entries.length === 0) return session;
  return { ...session, entries: session.entries.slice(0, -1), endedEarly: false };
}

export function endDrawSession(session: DrawSession): DrawSession {
  return isComplete(session) ? session : { ...session, endedEarly: true };
}
