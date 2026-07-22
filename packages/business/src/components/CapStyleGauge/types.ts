export type SizingStyleMode = 0 | 1 | 2

export type CapDominant = 'big' | 'small' | 'balance'

/** mode0 */
export interface CapStyleViewModel {
  big: number
  small: number
  dominant: CapDominant
  dominantPct: number
  verdictText: string
}
