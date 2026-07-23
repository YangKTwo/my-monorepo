/**实时概率 */
export interface SizingStyleProb {
  style: string
  bigStyleRatio: number
  smallStyleRatio: number
}

export interface SizingStyleItem {
  id: number
  dealDate: number
  dataValue: number
  styleType: number
}

export interface GetSizingStyleListParams {
  startDate: string
  endDate: string
  mixMode?: number | string
}

/**过去五日 */
export interface SizingStyleHistoryItem {
  date: string
  dealDate: number
  openExponentNameOne: string
  openExponentNameTwo: string
  openChangePercentOne: number
  openChangePercentTwo: number
  openStyle: string
  middleChangePercentOne: number
  middleChangePercentTwo: number
  middleStyle: string
  practicalStyle: string
}

export type SizingStyleHistoryData = SizingStyleHistoryItem[]

/** mode1：二维相空间路径点 */
export interface SizingStylePhasePoint {
  time: string
  hp1: number
  hp2: number
  mark?: 'open' | 'tick' | 'now'
}

export interface SizingStylePhasePath {
  points: SizingStylePhasePoint[]
  domain?: number
}
