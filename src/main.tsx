// Composition root: the only place that knows about concrete infrastructure.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserFullscreen } from './infrastructure/browser/BrowserFullscreen';
import { CryptoRandomSource } from './infrastructure/random/CryptoRandomSource';
import { LocalStoragePreferences } from './infrastructure/storage/LocalStoragePreferences';
import { App } from './presentation/App';
import { DependenciesProvider, type Dependencies } from './presentation/di/Dependencies';
import './presentation/styles/modernist.css';
import './presentation/styles/app.css';

const dependencies: Dependencies = {
  random: new CryptoRandomSource(),
  fullscreen: new BrowserFullscreen(),
  preferences: new LocalStoragePreferences(),
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DependenciesProvider value={dependencies}>
      <App />
    </DependenciesProvider>
  </StrictMode>,
);
