import { httpClient } from '../../cores'
import {
  GetSizingStyleListParams,
  SizingStyleHistoryData,
  SizingStyleItem,
  SizingStyleProb
} from './type'

export const sizingStyleApi = {
  /**实时数据 mode0 */
  getSizingStyleProb() {
    return httpClient.get<SizingStyleProb>('/intelligence/sizingStyle/getSizingStyleProb')
  },

  /**分时列表 mode1/mode2 */
  getSizingStyleList(params: GetSizingStyleListParams) {
    return httpClient.get<SizingStyleItem[]>('/intelligence/sizingStyle/getSizingStyleList', {
      params
    })
  },

  getIndexChangePercent() {
    return httpClient.get<SizingStyleHistoryData>('/intelligence/sizingStyle/getIndexChangePercent')
  }
}
