export interface ForecastQuartilesVo {
  predict: number
  dealTime: string
}

export interface GetForecastIndexProParams {
  dealDate: string
}

export interface PredictItem {
  dealDate: number
  predict: number
  pupil: '多' | '空' | string
  szPro: number
}
