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

export interface CapPhasePoint {
  time: string
  hp1: number
  hp2: number
  /** open=开盘 tick=时刻点 now=现在 */
  mark?: 'open' | 'tick' | 'now'
}

export interface CapPhaseViewModel {
  points: CapPhasePoint[]
  /** 坐标对称范围，默认 1.5 */
  domain?: number
}
