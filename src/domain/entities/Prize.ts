/** A prize slot. Its position in the list is its order (index 0 = Prize #1, the grand prize). */
export interface Prize {
  readonly id: string;
  readonly name: string;
}
