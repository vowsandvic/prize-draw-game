/** Source of randomness. Implemented in the infrastructure layer, fakeable in tests. */
export interface RandomSource {
  /** Returns a uniformly distributed integer in [min, max] (both inclusive). */
  nextInt(min: number, max: number): number;
}
