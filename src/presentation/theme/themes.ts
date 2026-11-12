import type { CSSProperties } from 'react';

/** Accent palette used for badges, ledger cells, confetti and the rolling tile. */
export const PALETTE = ['var(--c-pink)', 'var(--c-yellow)', 'var(--c-mint)', 'var(--c-lav)', 'var(--c-sky)'] as const;

export const paletteAt = (i: number) => PALETTE[((i % PALETTE.length) + PALETTE.length) % PALETTE.length];

type ThemeVars = Record<`--${string}`, string>;

function theme(
  bg: string, surface: string, text: string, accent: [string, string, string, string, string],
  pink: string, yellow: string, mint: string, lav: string, sky: string,
  pinkT: string, yellowT: string, skyT: string, ink: string,
): ThemeVars {
  const [a, a100, a300, a600, a700_800] = accent;
  const [a700, a800] = a700_800.split('|');
  return {
    '--color-bg': bg,
    '--color-surface': surface,
    '--color-text': text,
    '--color-divider': `color-mix(in srgb, ${text} 28%, transparent)`,
    '--color-accent': a,
    '--color-accent-100': a100,
    '--color-accent-300': a300,
    '--color-accent-600': a600,
    '--color-accent-700': a700,
    '--color-accent-800': a800,
    '--c-pink': pink,
    '--c-yellow': yellow,
    '--c-mint': mint,
    '--c-lav': lav,
    '--c-sky': sky,
    '--c-pink-t': pinkT,
    '--c-yellow-t': yellowT,
    '--c-sky-t': skyT,
    '--c-ink': ink,
  };
}

export const THEMES = {
  candy: theme('oklch(0.97 0.025 85)', '#ffffff', 'oklch(0.28 0.06 295)',
    ['oklch(0.68 0.18 20)', 'oklch(0.94 0.04 20)', 'oklch(0.84 0.1 20)', 'oklch(0.62 0.19 20)', 'oklch(0.52 0.18 20)|oklch(0.42 0.14 20)'],
    'oklch(0.82 0.11 355)', 'oklch(0.9 0.14 95)', 'oklch(0.86 0.1 165)', 'oklch(0.8 0.1 295)', 'oklch(0.84 0.09 235)',
    'oklch(0.94 0.04 355)', 'oklch(0.96 0.05 95)', 'oklch(0.95 0.03 235)', 'oklch(0.28 0.06 295)'),
  ocean: theme('oklch(0.97 0.02 220)', '#ffffff', 'oklch(0.27 0.06 250)',
    ['oklch(0.6 0.15 250)', 'oklch(0.94 0.03 250)', 'oklch(0.82 0.08 250)', 'oklch(0.54 0.16 250)', 'oklch(0.46 0.15 250)|oklch(0.38 0.12 250)'],
    'oklch(0.84 0.09 235)', 'oklch(0.86 0.09 195)', 'oklch(0.87 0.1 165)', 'oklch(0.82 0.08 280)', 'oklch(0.92 0.12 100)',
    'oklch(0.95 0.03 235)', 'oklch(0.96 0.04 100)', 'oklch(0.95 0.03 180)', 'oklch(0.27 0.06 250)'),
  sunset: theme('oklch(0.97 0.025 60)', '#ffffff', 'oklch(0.3 0.06 30)',
    ['oklch(0.64 0.19 40)', 'oklch(0.94 0.04 40)', 'oklch(0.83 0.1 40)', 'oklch(0.58 0.19 40)', 'oklch(0.5 0.17 40)|oklch(0.4 0.13 40)'],
    'oklch(0.84 0.1 50)', 'oklch(0.86 0.14 75)', 'oklch(0.8 0.12 10)', 'oklch(0.8 0.09 320)', 'oklch(0.92 0.11 95)',
    'oklch(0.95 0.035 50)', 'oklch(0.96 0.05 85)', 'oklch(0.95 0.03 340)', 'oklch(0.3 0.06 30)'),
  pop: theme('oklch(0.985 0.005 90)', '#ffffff', 'oklch(0.22 0.02 270)',
    ['oklch(0.62 0.22 25)', 'oklch(0.94 0.04 25)', 'oklch(0.83 0.1 25)', 'oklch(0.58 0.2 25)', 'oklch(0.5 0.18 25)|oklch(0.4 0.14 25)'],
    'oklch(0.86 0.17 92)', 'oklch(0.7 0.15 250)', 'oklch(0.68 0.21 28)', 'oklch(0.74 0.17 150)', 'oklch(0.72 0.19 350)',
    'oklch(0.96 0.05 92)', 'oklch(0.96 0.05 92)', 'oklch(0.95 0.03 250)', 'oklch(0.22 0.02 270)'),
  citrus: theme('oklch(0.985 0.012 110)', '#ffffff', 'oklch(0.25 0.05 150)',
    ['oklch(0.66 0.19 50)', 'oklch(0.94 0.04 50)', 'oklch(0.83 0.1 50)', 'oklch(0.58 0.2 50)', 'oklch(0.5 0.18 50)|oklch(0.4 0.14 50)'],
    'oklch(0.88 0.18 125)', 'oklch(0.76 0.17 55)', 'oklch(0.9 0.17 100)', 'oklch(0.77 0.16 150)', 'oklch(0.81 0.14 75)',
    'oklch(0.96 0.05 125)', 'oklch(0.96 0.05 100)', 'oklch(0.96 0.04 60)', 'oklch(0.25 0.05 150)'),
  berry: theme('oklch(0.98 0.012 340)', '#ffffff', 'oklch(0.25 0.07 330)',
    ['oklch(0.58 0.22 350)', 'oklch(0.94 0.04 350)', 'oklch(0.83 0.1 350)', 'oklch(0.58 0.2 350)', 'oklch(0.5 0.18 350)|oklch(0.4 0.14 350)'],
    'oklch(0.73 0.18 350)', 'oklch(0.7 0.16 300)', 'oklch(0.8 0.12 20)', 'oklch(0.76 0.14 320)', 'oklch(0.86 0.09 280)',
    'oklch(0.95 0.03 350)', 'oklch(0.95 0.03 20)', 'oklch(0.95 0.03 300)', 'oklch(0.25 0.07 330)'),
  neon: theme('oklch(0.2 0.04 270)', 'oklch(0.26 0.05 270)', 'oklch(0.97 0.01 270)',
    ['oklch(0.78 0.18 350)', 'oklch(0.32 0.08 350)', 'oklch(0.5 0.14 350)', 'oklch(0.85 0.14 350)', 'oklch(0.88 0.12 350)|oklch(0.92 0.08 350)'],
    'oklch(0.78 0.18 350)', 'oklch(0.9 0.2 130)', 'oklch(0.85 0.14 200)', 'oklch(0.75 0.16 300)', 'oklch(0.92 0.16 100)',
    'oklch(0.3 0.07 350)', 'oklch(0.3 0.06 130)', 'oklch(0.3 0.06 200)', 'oklch(0.2 0.04 270)'),
  galaxy: theme('oklch(0.18 0.05 290)', 'oklch(0.24 0.06 290)', 'oklch(0.96 0.02 290)',
    ['oklch(0.74 0.16 300)', 'oklch(0.32 0.08 300)', 'oklch(0.5 0.14 300)', 'oklch(0.85 0.14 300)', 'oklch(0.88 0.12 300)|oklch(0.92 0.08 300)'],
    'oklch(0.76 0.15 300)', 'oklch(0.88 0.1 80)', 'oklch(0.85 0.1 220)', 'oklch(0.8 0.14 340)', 'oklch(0.76 0.13 260)',
    'oklch(0.28 0.07 300)', 'oklch(0.28 0.06 80)', 'oklch(0.28 0.06 260)', 'oklch(0.18 0.05 290)'),
  forest: theme('oklch(0.2 0.03 170)', 'oklch(0.26 0.04 170)', 'oklch(0.96 0.02 120)',
    ['oklch(0.84 0.15 85)', 'oklch(0.32 0.08 85)', 'oklch(0.5 0.14 85)', 'oklch(0.85 0.14 85)', 'oklch(0.88 0.12 85)|oklch(0.92 0.08 85)'],
    'oklch(0.8 0.13 155)', 'oklch(0.86 0.15 90)', 'oklch(0.82 0.12 185)', 'oklch(0.78 0.12 60)', 'oklch(0.87 0.13 130)',
    'oklch(0.3 0.05 155)', 'oklch(0.3 0.05 90)', 'oklch(0.3 0.05 185)', 'oklch(0.2 0.03 170)'),
} satisfies Record<string, ThemeVars>;

export type ThemeId = keyof typeof THEMES;
export const DEFAULT_THEME: ThemeId = 'candy';

export const isThemeId = (value: unknown): value is ThemeId =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(THEMES, value);

export const THEME_GROUPS: ReadonlyArray<{ name: string; desc: string; items: ReadonlyArray<[ThemeId, string]> }> = [
  { name: 'Pastel', desc: 'soft & sweet', items: [['candy', 'Candy'], ['ocean', 'Ocean'], ['sunset', 'Sunset']] },
  { name: 'Bold pop', desc: 'bright & loud', items: [['pop', 'Pop'], ['citrus', 'Citrus'], ['berry', 'Berry']] },
  { name: 'Night glow', desc: 'dark & glowy, great on a big screen', items: [['neon', 'Neon'], ['galaxy', 'Galaxy'], ['forest', 'Forest']] },
];

export const themeStyle = (id: ThemeId): CSSProperties => THEMES[id] as CSSProperties;
