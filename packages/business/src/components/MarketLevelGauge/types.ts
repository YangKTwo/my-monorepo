/** 接口 predict：-2空，-1震荡空，1多，2震荡多 */
export type ForecastPredict = -2 | -1 | 1 | 2

export type MarketLevel = '空' | '震荡空' | '震荡多' | '多'

export interface MarketLevelViewModel {
  predict: ForecastPredict
  level: MarketLevel
  /** 中心大字：空 / 多 */
  label: '空' | '多'
  /** 指针轴值 -100~100 */
  gaugeValue: number
  subtitle?: string
  /** 本接口无概率时可先不传 */
  probabilityText?: string
}

export interface ForecastQuartilesVo {
  predict: number
  dealTime: string
}
