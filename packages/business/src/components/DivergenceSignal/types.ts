import type { DivergencePeriod } from '@my-repo/apis'

export interface DivergenceLegendItem {
  typeName: string
  color: string
}

/**左侧列表 */
export interface DivergenceListItem {
  signalId: number
  typeName: string
  color: string
  timeText: string // 11:42
  dateText: string // 25/03/27
  isTop: boolean
}

/**图上标点 */
export interface DivergenceMarkPoint {
  signalId: number
  name: string
  color: string
  xIndex: number //落在第几根行情
  yValue: number
  offsetY: number // 像素偏移，防重叠
  isTop: boolean // 	是否顶类信号
  timeLabel: string
}

export interface DivergenceChartModel {
  period: DivergencePeriod | number //决定折线还是 K 线
  categories: string[] // X 轴文案
  lineValues: (number | null)[] // 1 分钟收盘价序列
  candles: ([number, number, number, number] | null)[] //（ECharts K 线约定）
  markPoints: DivergenceMarkPoint[] //  要打的点
}

export interface DivergenceSignalViewModel {
  legend: DivergenceLegendItem[]
  list: DivergenceListItem[]
  chart: DivergenceChartModel
}
