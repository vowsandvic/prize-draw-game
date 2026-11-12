import { DomainError } from '../DomainError';
import type { DrawSession } from '../entities/DrawSession';
import { drawnNumbers } from '../entities/DrawSession';
import type { RandomSource } from '../ports/RandomSource';
import { rangeSize } from '../valueObjects/NumberRange';

/**
 * Picks a uniformly random number from the range that has not been drawn yet.
 * Uses rejection sampling while most of the range is free (O(1) expected, works
 * for huge ranges) and falls back to indexing the remaining pool otherwise.
 */
export function pickAvailableNumber(session: DrawSession, random: RandomSource): number {
  const { start, end } = session.range;
  const drawn = drawnNumbers(session);
  const size = rangeSize(session.range);
  const remaining = size - drawn.size;
  if (remaining <= 0) throw new DomainError('All numbers in the range have been drawn');

  if (drawn.size <= size / 2) {
    for (;;) {
      const candidate = random.nextInt(start, end);
      if (!drawn.has(candidate)) return candidate;
    }
  }

  let target = random.nextInt(0, remaining - 1);
  for (let n = start; n <= end; n++) {
    if (drawn.has(n)) continue;
    if (target === 0) return n;
    target--;
  }
  throw new DomainError('Unable to pick a number');
}
