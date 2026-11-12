import { useCallback, useEffect, useRef, useState } from 'react';
import type { NumberRange } from '../../domain';
import { useDependencies } from '../di/Dependencies';

const START_DELAY_MS = 40;
const DELAY_STEP_MS = 12;
const MAX_DELAY_MS = 220;

/**
 * Slot-machine animation: flashes random numbers on a decelerating tick for
 * `durationMs`, then lands on the final number that was decided up front.
 */
export function useRollingNumber(range: NumberRange, durationMs: number) {
  const { random } = useDependencies();
  const [display, setDisplay] = useState<string>('?');
  const [rolling, setRolling] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const rollingRef = useRef(false);

  useEffect(() => () => clearTimeout(timer.current), []);

  const roll = useCallback(
    (finalNumber: number, onDone: () => void) => {
      if (rollingRef.current) return;
      rollingRef.current = true;
      setRolling(true);
      let elapsed = 0;
      let delay = START_DELAY_MS;
      const step = () => {
        setDisplay(String(random.nextInt(range.start, range.end)));
        setTick((t) => t + 1);
        elapsed += delay;
        if (elapsed < durationMs) {
          delay = Math.min(delay + DELAY_STEP_MS, MAX_DELAY_MS);
          timer.current = setTimeout(step, delay);
        } else {
          rollingRef.current = false;
          setDisplay(String(finalNumber));
          setRolling(false);
          onDone();
        }
      };
      step();
    },
    [random, range.start, range.end, durationMs],
  );

  return { display, rolling, tick, roll, isRolling: () => rollingRef.current };
}
