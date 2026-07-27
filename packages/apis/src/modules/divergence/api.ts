import { httpClient } from '../../cores'
import {
  DivergenceQueryParams,
  ExponentDataByPeriod,
  ExponentInfo,
  IndexDeviateSignalList
} from './type'

/**背离信号图表：指数下拉 + 行情 + 背离信号 */
export const divergenceApi = {
  allExponentLs() {
    return httpClient.get<ExponentInfo[]>('share/exponent/allexponent/exceptLS')
  },

  /**按周期查指数行情 */
  listMinByPeriod(params: DivergenceQueryParams) {
    return httpClient.get<ExponentDataByPeriod>('share/exponent/listMinByPeriod', {
      params
    })
  },

  /**指数背离信号 */
  getIndexDeviateSignal(params: DivergenceQueryParams) {
    return httpClient.get<IndexDeviateSignalList>(
      'intelligence/indexSignal/getIndexDeviateSignal',
      {
        params
      }
    )
  }
}
