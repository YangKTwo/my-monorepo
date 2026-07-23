import { SizingStyleItem, SizingStyleProb, SizingStyleType } from '@my-repo/apis'
import {
  CapCurveBarPoint,
  CapCurveBarViewModel,
  CapDominant,
  CapPhasePoint,
  CapPhaseViewModel,
  CapStyleLabel,
  CapStyleViewModel
} from './types'

function resolveDominant(style: string, big: number, small: number): CapDominant {
  const s = style || ''
  if (s.includes('大盘')) return 'big'
  if (s.includes('小盘')) return 'small'
  if (s.includes('均衡')) return 'balance'
  if (Math.abs(big - small) < 0.01) return 'balance'
  return big >= small ? 'big' : 'small'
}

export function mapSizingStyleProbToView(raw: SizingStyleProb): CapStyleViewModel {
  const big = Number((raw.bigStyleRatio ?? 0).toFixed(2))
  const small = Number((raw.smallStyleRatio ?? 0).toFixed(2))
  const dominant = resolveDominant(raw.style ?? '', big, small)

  const dominantPct =
    dominant === 'small' ? small : dominant === 'big' ? big : Number(((big + small) / 2).toFixed(2))

  return {
    big,
    small,
    dominant,
    dominantPct,
    verdictText: raw.style || ''
  }
}

/** 时间处理 */
function formatDealDate(dealDate: number): string {
  const n = Math.abs(dealDate)
  const hh = String(Math.floor(n / 100)).padStart(2, '0')
  const mm = String(n % 100).padStart(2, '0')
  return `${hh}:${mm}`
}

/** 数据格式处理 */
type Bucket = { dealDate: number; rs?: number; hp?: number; hp1?: number; hp2?: number }

function pivotByDealDate(list: SizingStyleItem[]): Bucket[] {
  const map = new Map<number, Bucket>()
  for (const row of list) {
    let b = map.get(row.dealDate)
    if (!b) {
      b = { dealDate: row.dealDate }
      map.set(row.dealDate, b)
    }
    if (row.styleType === SizingStyleType.RS) b.rs = row.dataValue
    else if (row.styleType === SizingStyleType.HP) b.hp = row.dataValue
    else if (row.styleType === SizingStyleType.HP1) b.hp1 = row.dataValue
    else if (row.styleType === SizingStyleType.HP2) b.hp2 = row.dataValue
  }
  return [...map.values()].sort((a, b) => a.dealDate - b.dealDate)
}

function styleFormHp1(hp1: number): CapStyleLabel {
  return hp1 >= 0 ? 'big' : 'small'
}

/**mode1 HP1 * HP2 相空间 */
export function mapSizingStyleListToPhase(list: SizingStyleItem[]): CapPhaseViewModel {
  const buckets = pivotByDealDate(list)
  const points: CapPhasePoint[] = buckets
    .filter((b) => b.hp1 != null && b.hp2 != null)
    .map((b) => ({
      time: formatDealDate(b.dealDate),
      hp1: b.hp1 as number,
      hp2: b.hp2 as number
    }))

  if (points.length) {
    points[0].mark = 'open'
    points[points.length - 1].mark = 'now'
    ;[30, 60, 90].forEach((idx) => {
      if (points[idx] && !points[idx].mark) points[idx].mark = 'tick'
    })
  }

  // 按数据自适应坐标范围，避免写死 1.5 导致点挤在原点
  let maxAbs = 0
  for (const p of points) {
    maxAbs = Math.max(maxAbs, Math.abs(p.hp1), Math.abs(p.hp2))
  }
  const domain = maxAbs > 0 ? Number((maxAbs * 1.15).toFixed(4)) : 1.5

  return { points, domain }
}

/**mode2  rs \ hp线 + hp1柱子 */
export function mapSizingStyleListToCurveBar(list: SizingStyleItem[]): CapCurveBarViewModel {
  const buckets = pivotByDealDate(list)
  const points: CapCurveBarPoint[] = buckets
    .filter((b) => b.rs != null && b.hp != null && b.hp1 != null)
    .map((b) => ({
      time: formatDealDate(b.dealDate),
      rs: b.rs as number,
      hp: b.hp as number,
      hp1: b.hp1 as number
    }))

  if (points.length) {
    points[0].mark = 'open'
    points[points.length - 1].mark = 'now'
  }

  const openStyle = points.length ? styleFormHp1(points[0].hp1) : 'big'
  const nowStyle = points.length ? styleFormHp1(points[points.length - 1].hp1) : 'big'

  return { points, openStyle, nowStyle }
}
