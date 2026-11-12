import type { FullscreenPort } from '../../application';

export class BrowserFullscreen implements FullscreenPort {
  isActive(): boolean {
    return !!document.fullscreenElement;
  }

  async toggle(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen can be refused (iframe, iOS Safari); the app works without it.
    }
  }

  onChange(listener: (active: boolean) => void): () => void {
    const handler = () => listener(this.isActive());
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }
}
