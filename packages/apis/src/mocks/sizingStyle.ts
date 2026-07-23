import type {
  GetSizingStyleListParams,
  SizingStyleHistoryData,
  SizingStyleItem,
  SizingStyleProb
} from '../modules/sizingStyle/type'
import { SizingStyleType } from '../modules/sizingStyle/type'

const sizingStyleProbMock: SizingStyleProb = {
  style: '大盘风格',
  bigStyleRatio: 62.35,
  smallStyleRatio: 37.65
}

/** 生成当日分时扁平列表（mode1/mode2 共用） */
export function createSizingStyleListMock(): SizingStyleItem[] {
  const total = 90
  const list: SizingStyleItem[] = []
  let hp = 0.005
  let id = 1

  for (let i = 0; i < total; i++) {
    const mins = 9 * 60 + 31 + i
    const dealDate = Math.floor(mins / 60) * 100 + (mins % 60) // 931, 932, ...

    // mode2 上图：强度 / 平滑（小量级）
    const rs = 0.008 * Math.sin(i / 8) + 0.004 * Math.sin(i / 3) + (Math.random() - 0.5) * 0.006
    hp = hp * 0.85 + rs * 0.15

    // mode1 相空间 + mode2 下图：HP1/HP2（螺旋轨迹，约 [-1,1]）
    const t = (i / total) * 4 * Math.PI
    let hp1 = Math.sin(t) * 0.8 + (Math.random() - 0.5) * 0.12
    const hp2 = Math.cos(t) * 0.8 + (Math.random() - 0.5) * 0.15
    if (i < 24) hp1 = -0.25 + (i / 24) * 0.55
    if (i > total - 24) hp1 = 0.35 - ((i - (total - 24)) / 24) * 0.45

    list.push(
      { id: id++, dealDate, dataValue: rs, styleType: SizingStyleType.RS },
      { id: id++, dealDate, dataValue: hp, styleType: SizingStyleType.HP },
      { id: id++, dealDate, dataValue: hp1, styleType: SizingStyleType.HP1 },
      { id: id++, dealDate, dataValue: hp2, styleType: SizingStyleType.HP2 }
    )
  }
  return list
}

export const sizingStyleMockApi = {
  getSizingStyleProb() {
    return Promise.resolve(sizingStyleProbMock)
  },

  getSizingStyleList(_params: GetSizingStyleListParams) {
    return Promise.resolve(createSizingStyleListMock())
  },

  getIndexChangePercent() {
    return Promise.resolve([] as SizingStyleHistoryData)
  }
}
