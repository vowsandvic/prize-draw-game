export interface FullscreenPort {
  isActive(): boolean;
  toggle(): Promise<void>;
  /** Subscribes to fullscreen changes; returns an unsubscribe function. */
  onChange(listener: (active: boolean) => void): () => void;
}
