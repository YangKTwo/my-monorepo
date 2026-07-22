export interface VBackPro {
  dealDate: number
  vBackPro: number
}

export interface VPointDto {
  dealDate: number
  type: string
  position: 'left' | 'right' | 'single' | string
}

export interface GetByDealDateParams {
  dealDate: string
}

export interface GetVBackPredictParams {
  dealDate: string
}

export interface VBackPredictData {
  right: VBackPro[]
  left: VBackPro[]
  single: VBackPro[]
  merge: VBackPro[]
  vpoint: VPointDto[]
}

/** Mode3：与 backVMonitor 解包后一致 */
export interface BackVSzItem {
  dealDate: number
  close: number
  open: number
  high: number
  low: number
  preClose: number | string // 可能是 ""
  changePercent: number | string // 可能是 ""
  amount: number
  volume: number
  exponentId: number
  id: number
  initAmount: number
  initVolume: number
}

/**mode3 */
export interface BackVMonitorData {
  backV: VBackPro[] // 反V概率 0~1
  szData: BackVSzItem[] // 上证分时（用来画涨幅）
  vpoint: VPointDto[] // position 常见 "backV"
}

/** Mode4：解包后直接是数组 */
export interface NewVRightItem {
  time: string // "09:31"
  chance: number // 已是百分数，如 76.78
  close: number // 上证价
}
export type NewVRightData = NewVRightItem[]

export interface SseIndexMinItem {
  dealDate: number
  close: number
  open: number
  high: number
  low: number
  preClose: number
  changePercent: number
  amount: number
  volume: number
  exponentId: number
  id: number
  initAmount: number
  initVolume: number
}
export type SseIndexMinData = SseIndexMinItem[]

export interface VBackSuccessRow {
  dealDate: string
  vPointTime: string
  rightPro: number
  leftPro: number
}
export type VBackSuccessData = VBackSuccessRow[]
