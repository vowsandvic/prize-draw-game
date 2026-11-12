import type { RandomSource } from '../../domain';

const UINT32_RANGE = 0x1_0000_0000;

/**
 * Unbiased integers from `crypto.getRandomValues` (rejection sampling avoids
 * modulo bias). Falls back to Math.random when Web Crypto is unavailable or the
 * span exceeds 2^32.
 */
export class CryptoRandomSource implements RandomSource {
  private readonly buffer = new Uint32Array(1);

  nextInt(min: number, max: number): number {
    const span = max - min + 1;
    if (span <= 1) return min;
    const cryptoApi = globalThis.crypto;
    if (!cryptoApi?.getRandomValues || span > UINT32_RANGE) {
      return min + Math.floor(Math.random() * span);
    }
    const limit = UINT32_RANGE - (UINT32_RANGE % span);
    let value: number;
    do {
      cryptoApi.getRandomValues(this.buffer);
      value = this.buffer[0];
    } while (value >= limit);
    return min + (value % span);
  }
}
