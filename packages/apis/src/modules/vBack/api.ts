import { httpClient } from '../../cores'
import {
  BackVMonitorData,
  GetByDealDateParams,
  GetVBackPredictParams,
  NewVRightData,
  SseIndexMinData,
  VBackPredictData,
  VBackSuccessData
} from './type'

export const vBackApi = {
  getVBackPredict(params: GetVBackPredictParams) {
    return httpClient.get<VBackPredictData>('monitor/vBack/VBackPredict', { params })
  },

  /**反V */
  getBackVMonitor(params: GetVBackPredictParams) {
    return httpClient.get<BackVMonitorData>('monitor/vBack/backVMonitor', { params })
  },
  /**新V右 */
  getNewVRight(params: GetVBackPredictParams) {
    return httpClient.get<NewVRightData>('monitor/vBack/getNewVRight', { params })
  },
  /**上证指数 */
  getSseIndexMin(params: GetByDealDateParams) {
    return httpClient.get<SseIndexMinData>('share/exponent/listMinByPeriod', {
      params: {
        startDate: params.dealDate,
        endDate: params.dealDate,
        exponentName: '上证指数',
        period: 1
      }
    })
  },
  /**过去五日 */
  getVBackSuccessData(params: GetVBackPredictParams) {
    return httpClient.get<VBackSuccessData>('monitor/vBack/VBackSuccessData', { params })
  }
}
