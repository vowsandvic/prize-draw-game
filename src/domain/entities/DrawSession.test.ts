import { describe, expect, it } from 'vitest';
import { DomainError } from '../DomainError';
import { createNumberRange } from '../valueObjects/NumberRange';
import { pickAvailableNumber } from '../services/pickAvailableNumber';
import type { RandomSource } from '../ports/RandomSource';
import {
  endDrawSession,
  isComplete,
  nextPrizeIndex,
  numberForPrize,
  recordDraw,
  startDrawSession,
  undoLastDraw,
} from './DrawSession';

const prizes = [
  { id: 'a', name: 'Grand' },
  { id: 'b', name: 'Second' },
  { id: 'c', name: 'Third' },
];

/** Returns queued values, then always the minimum. */
const scripted = (...values: number[]): RandomSource => ({
  nextInt: (min) => (values.length ? values.shift()! : min),
});

describe('DrawSession', () => {
  it('draws prizes from last to first', () => {
    let s = startDrawSession(createNumberRange(1, 10), prizes);
    expect(s.mode).toBe('prize');
    expect(nextPrizeIndex(s)).toBe(2);
    s = recordDraw(s, 5);
    expect(nextPrizeIndex(s)).toBe(1);
    s = recordDraw(s, 6);
    s = recordDraw(s, 7);
    expect(isComplete(s)).toBe(true);
    expect(numberForPrize(s, 0)).toBe(7);
    expect(numberForPrize(s, 2)).toBe(5);
  });

  it('rejects duplicates, out-of-range numbers and draws after completion', () => {
    let s = startDrawSession(createNumberRange(1, 3), prizes.slice(0, 1));
    expect(() => recordDraw(s, 4)).toThrow(DomainError);
    s = recordDraw(s, 2);
    expect(() => recordDraw(s, 3)).toThrow(/complete/);
    const free = recordDraw(startDrawSession(createNumberRange(1, 3), []), 2);
    expect(() => recordDraw(free, 2)).toThrow(/already/);
  });

  it('rejects more prizes than numbers', () => {
    expect(() => startDrawSession(createNumberRange(1, 2), prizes)).toThrow(/exceeds/);
  });

  it('undo returns the same prize to the queue', () => {
    let s = startDrawSession(createNumberRange(1, 10), prizes);
    s = recordDraw(s, 4);
    s = undoLastDraw(s);
    expect(s.entries).toHaveLength(0);
    expect(nextPrizeIndex(s)).toBe(2);
  });

  it('free mode completes when the range runs out or is ended early', () => {
    let s = startDrawSession(createNumberRange(1, 2), []);
    expect(s.mode).toBe('free');
    s = recordDraw(recordDraw(s, 1), 2);
    expect(isComplete(s)).toBe(true);
    const ended = endDrawSession(startDrawSession(createNumberRange(1, 5), []));
    expect(isComplete(ended)).toBe(true);
    expect(ended.endedEarly).toBe(true);
  });
});

describe('pickAvailableNumber', () => {
  it('never returns a drawn number (rejection path)', () => {
    const s = recordDraw(startDrawSession(createNumberRange(1, 10), []), 3);
    expect(pickAvailableNumber(s, scripted(3, 3, 8))).toBe(8);
  });

  it('indexes the remaining pool when most numbers are drawn', () => {
    let s = startDrawSession(createNumberRange(1, 5), []);
    for (const n of [1, 2, 4, 5]) s = recordDraw(s, n);
    expect(pickAvailableNumber(s, scripted(0))).toBe(3);
  });

  it('throws when nothing is left', () => {
    const s = recordDraw(startDrawSession(createNumberRange(7, 7), []), 7);
    expect(() => pickAvailableNumber(s, scripted())).toThrow(DomainError);
  });
});
