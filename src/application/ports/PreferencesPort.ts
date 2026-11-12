/** Small key/value store for per-device UI preferences (e.g. the chosen theme). */
export interface PreferencesPort {
  get(key: string): string | null;
  set(key: string, value: string): void;
}
