import type {
  GetSizingStyleListParams,
  SizingStyleHistoryData,
  SizingStyleItem,
  SizingStylePhasePath,
  SizingStylePhasePoint,
  SizingStyleProb
} from '../modules/sizingStyle/type'

const sizingStyleProbMock: SizingStyleProb = {
  style: '大盘风格',
  bigStyleRatio: 62.35,
  smallStyleRatio: 37.65
}

/** mode1 相空间假数据 */
export function createCapPhaseMock(): SizingStylePhasePath {
  const total = 180
  const points: SizingStylePhasePoint[] = []

  for (let i = 0; i < total; i++) {
    const t = (i / total) * 4 * Math.PI
    let hp1 = Math.sin(t) * 0.8 + (Math.random() - 0.5) * 0.12
    const hp2 = Math.cos(t) * 0.8 + (Math.random() - 0.5) * 0.15
    if (i < 24) hp1 = -0.25 + (i / 24) * 0.55
    if (i > total - 24) hp1 = 0.35 - ((i - (total - 24)) / 24) * 0.45

    const mins = 9 * 60 + 30 + i
    const hh = String(Math.floor(mins / 60)).padStart(2, '0')
    const mm = String(mins % 60).padStart(2, '0')

    points.push({
      time: `${hh}:${mm}`,
      hp1,
      hp2
    })
  }

  points[0].mark = 'open'
  points[points.length - 1].mark = 'now'
  ;[30, 60, 90].forEach((idx) => {
    if (points[idx]) points[idx].mark = 'tick'
  })

  return { points, domain: 1.5 }
}

/** 对齐 modules/sizingStyle/api.ts，仅返回本地假数据 */
export const sizingStyleMockApi = {
  getSizingStyleProb() {
    return Promise.resolve(sizingStyleProbMock)
  },

  getSizingStyleList(_params: GetSizingStyleListParams) {
    return Promise.resolve([] as SizingStyleItem[])
  },

  getIndexChangePercent() {
    return Promise.resolve([] as SizingStyleHistoryData)
  },

  getSizingStylePhasePath() {
    return Promise.resolve(createCapPhaseMock())
  }
}
