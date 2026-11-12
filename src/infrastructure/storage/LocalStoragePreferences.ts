import type { PreferencesPort } from '../../application';

/** localStorage-backed preferences; silently no-ops when storage is blocked. */
export class LocalStoragePreferences implements PreferencesPort {
  constructor(private readonly prefix = 'prize-draw:') {}

  get(key: string): string | null {
    try {
      return window.localStorage.getItem(this.prefix + key);
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(this.prefix + key, value);
    } catch {
      // Private mode / blocked storage: preference just isn't remembered.
    }
  }
}
