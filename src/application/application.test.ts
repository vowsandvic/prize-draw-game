import { describe, expect, it } from 'vitest';
import {
  commitDraw,
  finishGame,
  getDrawProgress,
  getLastResult,
  getLedger,
  getSummary,
  retryLastDraw,
  startGame,
  stepDuration,
  validateSetup,
  type GameConfig,
} from './index';

const prizes = [
  { id: 'a', name: ' Trip ' },
  { id: 'b', name: '' },
];

describe('validateSetup', () => {
  it('requires whole-number bounds', () => {
    const r = validateSetup({ start: '', end: '1.5', durationSeconds: '3', prizes: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.start).toBe('Please enter Start');
      expect(r.errors.end).toBe('End must be a whole number');
    }
  });

  it('flags start > end on both fields with the message on End', () => {
    const r = validateSetup({ start: '9', end: '1', durationSeconds: '3', prizes: [] });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.start).toBe('');
      expect(r.errors.end).toMatch(/greater than or equal/);
    }
  });

  it('rejects more prizes than numbers', () => {
    const r = validateSetup({ start: '1', end: '1', durationSeconds: '3', prizes });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.prizes).toMatch(/exceeds/);
  });

  it('builds a config, trimming names and defaulting bad durations', () => {
    const r = validateSetup({ start: '1', end: '50', durationSeconds: 'abc', prizes });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.config.range).toEqual({ start: 1, end: 50 });
      expect(r.config.drawDurationMs).toBe(3000);
      expect(r.config.prizes[0].name).toBe('Trip');
    }
  });
});

describe('stepDuration', () => {
  it('steps by 0.5s with a 0.5s floor', () => {
    expect(stepDuration('3', 0.5)).toBe('3.5');
    expect(stepDuration('0.5', -0.5)).toBe('0.5');
    expect(stepDuration('', 0.5)).toBe('3.5');
  });
});

describe('draw use cases', () => {
  const config: GameConfig = { range: { start: 1, end: 10 }, prizes, drawDurationMs: 1000 };

  it('reports progress, last result, ledger and summary', () => {
    let s = startGame(config);
    expect(getDrawProgress(s).currentPrize?.order).toBe(2);
    s = commitDraw(s, 7);
    expect(getLastResult(s)).toEqual({ number: 7, prize: { index: 1, order: 2, name: '' } });
    expect(getDrawProgress(s)).toMatchObject({ drawn: 1, total: 2, complete: false });
    expect(getLedger(s).map((l) => [l.short, l.number, l.current])).toEqual([
      ['P2', 7, false],
      ['P1', null, true],
    ]);
    s = commitDraw(s, 3);
    expect(getDrawProgress(s).complete).toBe(true);
    expect(getSummary(s).map((r) => r.number)).toEqual([3, 7]);
  });

  it('retry undoes only the last draw', () => {
    const s = retryLastDraw(commitDraw(commitDraw(startGame(config), 1), 2));
    expect(s.entries.map((e) => e.number)).toEqual([1]);
  });

  it('free mode summary lists draws in order and can be finished early', () => {
    let s = startGame({ ...config, prizes: [] });
    s = commitDraw(commitDraw(s, 4), 9);
    s = finishGame(s);
    expect(getDrawProgress(s)).toMatchObject({ mode: 'free', complete: true, endedEarly: true });
    expect(getSummary(s).map((r) => [r.label, r.number])).toEqual([
      ['Draw #1', 4],
      ['Draw #2', 9],
    ]);
  });
});
