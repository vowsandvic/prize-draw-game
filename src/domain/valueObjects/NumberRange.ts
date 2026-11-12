import { DomainError } from '../DomainError';

/** Inclusive range of whole numbers that can be drawn. */
export interface NumberRange {
  readonly start: number;
  readonly end: number;
}

export function createNumberRange(start: number, end: number): NumberRange {
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) {
    throw new DomainError('Range bounds must be whole numbers');
  }
  if (start > end) {
    throw new DomainError('End must be greater than or equal to Start');
  }
  return { start, end };
}

export function rangeSize(range: NumberRange): number {
  return range.end - range.start + 1;
}

export function rangeContains(range: NumberRange, value: number): boolean {
  return Number.isInteger(value) && value >= range.start && value <= range.end;
}
