import { useCallback, useEffect, useState } from 'react';
import { useDependencies } from '../di/Dependencies';

export function useFullscreen() {
  const { fullscreen } = useDependencies();
  const [active, setActive] = useState(() => fullscreen.isActive());
  useEffect(() => fullscreen.onChange(setActive), [fullscreen]);
  const toggle = useCallback(() => void fullscreen.toggle(), [fullscreen]);
  return { active, toggle };
}
