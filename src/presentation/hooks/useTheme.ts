import { useCallback, useEffect, useState } from 'react';
import { useDependencies } from '../di/Dependencies';
import { DEFAULT_THEME, isThemeId, THEMES, type ThemeId } from '../theme/themes';

const THEME_KEY = 'theme';

/** Current colour theme, remembered per device and mirrored onto <body>. */
export function useTheme() {
  const { preferences } = useDependencies();
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = preferences.get(THEME_KEY);
    return isThemeId(saved) ? saved : DEFAULT_THEME;
  });

  useEffect(() => {
    const vars = THEMES[theme];
    document.body.style.background = vars['--color-bg'];
    document.documentElement.style.colorScheme = theme === 'neon' || theme === 'galaxy' || theme === 'forest' ? 'dark' : 'light';
  }, [theme]);

  const setTheme = useCallback(
    (id: ThemeId) => {
      setThemeState(id);
      preferences.set(THEME_KEY, id);
    },
    [preferences],
  );

  return { theme, setTheme };
}
