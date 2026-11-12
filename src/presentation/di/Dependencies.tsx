import { createContext, useContext, type ReactNode } from 'react';
import type { FullscreenPort, PreferencesPort } from '../../application';
import type { RandomSource } from '../../domain';

/** Everything the UI needs from the outside world, injected at the composition root (main.tsx). */
export interface Dependencies {
  readonly random: RandomSource;
  readonly fullscreen: FullscreenPort;
  readonly preferences: PreferencesPort;
}

const DependenciesContext = createContext<Dependencies | null>(null);

export function DependenciesProvider({ value, children }: { value: Dependencies; children: ReactNode }) {
  return <DependenciesContext.Provider value={value}>{children}</DependenciesContext.Provider>;
}

export function useDependencies(): Dependencies {
  const deps = useContext(DependenciesContext);
  if (!deps) throw new Error('useDependencies must be used inside <DependenciesProvider>');
  return deps;
}
