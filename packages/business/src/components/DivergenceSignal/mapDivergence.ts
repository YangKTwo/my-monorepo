import type { ExponentItem, IndexDeviateSignal, DivergencePeriod } from '@my-repo/apis'
import type { DivergenceSignalViewModel } from './types'

/**信号类型配色盘 */
const PALETTE = ['#14cbf0', '#ff5b3f', '#ff8a3d', '#f0c14a', '#5b8cff', '#19ebff']

/**数字补零 9-‘09’ 格式化时间/日期 */
function pad(n: number) {
  return String(n).padStart(2, '0')
}

/**把信号时间统一成毫秒 */
function toMs(v: string | number): number {
  if (typeof v === 'number') return v
  return new Date(v.replace(/-/g, '/')).getTime()
}

/** 生成 X 轴 文案 */
function formatCat(ms: number, period: number): string {
  const d = new Date(ms)
  if (period === 240) {
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 生成左侧列表两行时间 年份取后两位数 */
function formatListTime(ms: number) {
  const d = new Date(ms)
  return {
    timeText: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    dateText: `${pad(d.getFullYear() % 100)}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`
  }
}

function isTopSignal(typeName: string) {
  return typeName.includes('顶')
}

function colorOf(typeName: string, cache: Map<string, string>) {
  if (!cache.has(typeName)) {
    cache.set(typeName, PALETTE[cache.size % PALETTE.length])
  }
  return cache.get(typeName)!
}

/** 找最接近的行情下标 */
function nearestIndex(times: number[], target: number): number {
  let best = 0
  let bestDiff = Infinity
  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(times[i] - target)
    if (diff < bestDiff) {
      bestDiff = diff
      best = i
    }
  }
  return best
}

export function mapDivergenceToView(
  quotes: ExponentItem[],
  signals: IndexDeviateSignal[],
  period: DivergencePeriod | number
): DivergenceSignalViewModel {
  const sorted = [...quotes].sort((a, b) => a.dealDate - b.dealDate)
  const times = sorted.map((q) => q.dealDate)
  const categories = times.map((t) => formatCat(t, Number(period)))

  const lineValues = sorted.map((q) => q.close)
  const candles = sorted.map(
    (q) => [q.open, q.close, q.low, q.high] as [number, number, number, number]
  )

  const colorCache = new Map<string, string>()
  const offsetCounter = new Map<number, number>() // xIndex → 已堆叠个数

  const list = signals.map((s) => {
    const ms = toMs(s.dealDate)
    const { timeText, dateText } = formatListTime(ms)
    const color = colorOf(s.typeName, colorCache)
    return {
      signalId: s.signalId,
      typeName: s.typeName,
      color,
      timeText,
      dateText,
      isTop: isTopSignal(s.typeName)
    }
  })

  const markPoints = signals.map((s) => {
    const ms = toMs(s.dealDate)
    const xIndex = times.length ? nearestIndex(times, ms) : 0
    const bar = sorted[xIndex]
    const top = isTopSignal(s.typeName)
    const stack = offsetCounter.get(xIndex) ?? 0
    offsetCounter.set(xIndex, stack + 1)
    const color = colorOf(s.typeName, colorCache)

    return {
      signalId: s.signalId,
      name: s.typeName,
      color,
      xIndex,
      yValue: top ? (bar?.high ?? 0) : (bar?.low ?? 0),
      offsetY: (top ? -1 : 1) * (14 + stack * 16),
      isTop: top,
      timeLabel: formatCat(ms, Number(period))
    }
  })

  const legend = [...colorCache.entries()].map(([typeName, color]) => ({ typeName, color }))

  return {
    legend,
    list,
    chart: {
      period,
      categories,
      lineValues,
      candles,
      markPoints
    }
  }
}
