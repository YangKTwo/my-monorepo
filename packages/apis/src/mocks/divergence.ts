import type { DivergenceQueryParams, IndexDeviateSignalList } from '../modules/divergence/type'

/** 对齐实测样例形态，方便左列表 + markPoint 联调 */
const DEVIATE_SIGNAL_MOCK: IndexDeviateSignalList = [
  {
    code: 'SH000001',
    dealDate: '2025-03-27 09:49:00',
    period: 1,
    signalId: 122336,
    type: 1,
    typeName: 'MACD底'
  },
  {
    code: 'SH000001',
    dealDate: '2025-03-27 10:15:00',
    period: 1,
    signalId: 122340,
    type: 2,
    typeName: 'MACD顶'
  },
  {
    code: 'SH000001',
    dealDate: '2025-03-27 11:05:00',
    period: 1,
    signalId: 122341,
    type: 3,
    typeName: 'KDJ顶'
  },
  {
    code: 'SH000001',
    dealDate: '2025-03-27 13:22:00',
    period: 1,
    signalId: 122342,
    type: 6,
    typeName: 'RSI顶'
  },
  {
    code: 'SH000001',
    dealDate: '2025-03-27 14:08:00',
    period: 1,
    signalId: 122343,
    type: 1,
    typeName: 'MACD底'
  }
]

/**
 * 与 divergenceApi 方法对齐；
 * 背离信号
 */
export const divergenceMockApi = {
  getIndexDeviateSignal(_params: DivergenceQueryParams) {
    return Promise.resolve(DEVIATE_SIGNAL_MOCK)
  }
}
