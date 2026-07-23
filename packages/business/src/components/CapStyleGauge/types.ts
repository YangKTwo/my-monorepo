export type SizingStyleMode = 0 | 1 | 2
export type CapDominant = 'big' | 'small' | 'balance'
export type CapStyleLabel = 'big' | 'small'

/** mode0 */
export interface CapStyleViewModel {
  big: number
  small: number
  dominant: CapDominant
  dominantPct: number
  verdictText: string
}

/** mode1：相空间 */
export interface CapPhasePoint {
  time: string
  hp1: number
  hp2: number
  mark?: 'open' | 'tick' | 'now'
}

export interface CapPhaseViewModel {
  points: CapPhasePoint[]
  domain?: number
}

/** mode2：曲线 + 柱 */
export interface CapCurveBarPoint {
  time: string
  rs: number
  hp: number
  hp1: number
  mark?: 'open' | 'now'
}

export interface CapCurveBarViewModel {
  points: CapCurveBarPoint[]
  openStyle: CapStyleLabel
  nowStyle: CapStyleLabel
}
