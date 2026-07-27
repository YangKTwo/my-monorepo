export type DivergencePeriod = 1 | 5 | 15 | 30 | 60 | 240

export interface DivergenceQueryParams {
  startDate: string
  endDate: string
  exponentName: string
  period: DivergencePeriod | number
}

export interface ExponentInfo {
  id: number
  code: string
  name: string
  sinaCode: string
}

export interface ExponentItem {
  id: number
  exponentId: number
  /** 毫秒时间戳 */
  dealDate: number
  open: number
  high: number
  low: number
  close: number
  preClose: number
  changePercent: number
  volume: number
  amount: number
  initVolume: number
  initAmount: number
}

export type ExponentDataByPeriod = ExponentItem[]

export interface IndexDeviateSignal {
  code: string
  /** 实测多为 "YYYY-MM-DD HH:mm:ss" */
  dealDate: string | number
  period: DivergencePeriod | number
  signalId: number
  type: number
  typeName: string // 如 "MACD底" / "RSI顶"
}

export type IndexDeviateSignalList = IndexDeviateSignal[]
