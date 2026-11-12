import type { NumberRange, Prize } from '../../domain';
import { createNumberRange, rangeSize } from '../../domain';

export const DEFAULT_DRAW_DURATION_MS = 3000;

/** Raw values as typed by the user. */
export interface SetupInput {
  readonly start: string;
  readonly end: string;
  readonly durationSeconds: string;
  readonly prizes: readonly Prize[];
}

export interface GameConfig {
  readonly range: NumberRange;
  readonly prizes: readonly Prize[];
  readonly drawDurationMs: number;
}

/**
 * Field errors. A key that is present marks the field invalid; an empty string
 * means "highlight the field but show the message elsewhere".
 */
export interface SetupErrors {
  start?: string;
  end?: string;
  prizes?: string;
}

export type SetupResult =
  | { readonly ok: true; readonly config: GameConfig }
  | { readonly ok: false; readonly errors: SetupErrors };

function parseWholeNumber(raw: string, label: string): { value?: number; error?: string } {
  if (raw.trim() === '') return { error: `Please enter ${label}` };
  const value = Number(raw);
  if (!Number.isSafeInteger(value)) return { error: `${label} must be a whole number` };
  return { value };
}

export function parseDrawDuration(raw: string): number {
  const seconds = Number(raw);
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : DEFAULT_DRAW_DURATION_MS;
}

/** Use case: turn the setup form into a validated game configuration. */
export function validateSetup(input: SetupInput): SetupResult {
  const errors: SetupErrors = {};
  const start = parseWholeNumber(input.start, 'Start');
  const end = parseWholeNumber(input.end, 'End');
  if (start.error) errors.start = start.error;
  if (end.error) errors.end = end.error;

  let range: NumberRange | null = null;
  if (start.value !== undefined && end.value !== undefined) {
    if (start.value > end.value) {
      errors.start = '';
      errors.end = 'End must be greater than or equal to Start';
    } else {
      range = createNumberRange(start.value, end.value);
      const available = rangeSize(range);
      if (input.prizes.length > available) {
        errors.prizes = `Number of prizes (${input.prizes.length}) exceeds the numbers available in the range (${available})`;
      }
    }
  }
  // An empty prize list is valid: it enables Free Draw Mode.

  if (!range || Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    config: {
      range,
      prizes: input.prizes.map((p) => ({ id: p.id, name: p.name.trim() })),
      drawDurationMs: parseDrawDuration(input.durationSeconds),
    },
  };
}

export const DURATION_STEP_SECONDS = 0.5;
export const MIN_DURATION_SECONDS = 0.5;

/** Steps the spin time by `deltaSeconds`, snapping to 0.5s and never below the minimum. */
export function stepDuration(raw: string, deltaSeconds: number): string {
  const current = Number(raw) > 0 ? Number(raw) : DEFAULT_DRAW_DURATION_MS / 1000;
  const next = Math.round((current + deltaSeconds) / DURATION_STEP_SECONDS) * DURATION_STEP_SECONDS;
  return String(Math.max(MIN_DURATION_SECONDS, next));
}
