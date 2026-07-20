import { httpClient } from '../../cores/request'
import { PredictItem, type ForecastQuartilesVo, type GetForecastIndexProParams } from './type'

export const forecastApi = {
  getForecastIndexProb(params: GetForecastIndexProParams) {
    return httpClient.get<ForecastQuartilesVo[]>('/intelligence/v2/index/getForecastIndexProb', {
      params
    })
  },
  getLastPredict() {
    return httpClient.get<PredictItem[]>('/intelligence/sZPredict/lastPredict')
  }
}
