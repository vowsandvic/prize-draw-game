import { useRef, useState } from 'react';
import { validateSetup, type GameConfig, type SetupErrors } from '../application';
import { useTheme } from './hooks/useTheme';
import { DrawPage } from './pages/DrawPage';
import { SetupPage, type SetupForm } from './pages/SetupPage';
import { themeStyle } from './theme/themes';

type Page = { name: 'setup' } | { name: 'draw'; config: GameConfig; gameId: number };

export function App() {
  const { theme, setTheme } = useTheme();
  const nextId = useRef(1);
  const newPrize = () => ({ id: `p${nextId.current++}`, name: '' });

  const [form, setForm] = useState<SetupForm>(() => ({
    start: '',
    end: '',
    durationSeconds: '3',
    prizes: [newPrize()],
  }));
  const [errors, setErrors] = useState<SetupErrors>({});
  const [page, setPage] = useState<Page>({ name: 'setup' });

  const startGame = () => {
    const result = validateSetup(form);
    if (!result.ok) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    setPage({ name: 'draw', config: result.config, gameId: nextId.current++ });
    window.scrollTo(0, 0);
  };

  return (
    <div className="app-root" style={themeStyle(theme)}>
      {page.name === 'setup' ? (
        <SetupPage
          form={form}
          errors={errors}
          theme={theme}
          onThemeChange={setTheme}
          onFormChange={(patch) => setForm((f) => ({ ...f, ...patch }))}
          onAddPrize={() => setForm((f) => ({ ...f, prizes: [...f.prizes, newPrize()] }))}
          onStart={startGame}
        />
      ) : (
        <DrawPage
          key={page.gameId}
          config={page.config}
          onBack={() => setPage({ name: 'setup' })}
          onNewGame={() => setPage({ name: 'setup' })}
        />
      )}
    </div>
  );
}
