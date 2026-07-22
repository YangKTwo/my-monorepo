import type {
  VBackPredictData,
  VBackPro,
  SseIndexMinData,
  BackVMonitorData,
  NewVRightData,
  BackVSzItem
} from '@my-repo/apis'
import type { ProbMode, VProbPoint, VReverseProbabilityViewModel } from './types'

function toMs(dealDate: number | string) {
  return typeof dealDate === 'number' ? dealDate : Number(dealDate)
}

function formatTime(dealDate: number | string) {
  const d = new Date(toMs(dealDate))
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}

function toProbPoints(list: { dealDate: number | string; vBackPro: number }[] = []): VProbPoint[] {
  return [...list]
    .sort((a, b) => toMs(a.dealDate) - toMs(b.dealDate))
    .map((i) => ({
      time: formatTime(i.dealDate),
      value: i.vBackPro * 100
    }))
}

function toPricePoints(list: { dealDate: number | string; close: number }[] = []): VProbPoint[] {
  return [...list]
    .sort((a, b) => toMs(a.dealDate) - toMs(b.dealDate))
    .map((i) => ({
      time: formatTime(i.dealDate),
      value: i.close
    }))
}

function latestText(list: VBackPro[] = []) {
  if (!list.length) return '--'
  const sorted = [...list].sort((a, b) => toMs(a.dealDate) - toMs(b.dealDate))
  const item = sorted[sorted.length - 1]
  return `${(item.vBackPro * 100).toFixed(2)}%`
}

function buildTimes(...series: VProbPoint[][]) {
  const set = new Set<string>()
  series.flat().forEach((p) => set.add(p.time))
  return [...set].sort()
}

function emptyVm(mode: ProbMode): VReverseProbabilityViewModel {
  return {
    mode,
    times: [],
    left: [],
    right: [],
    single: [],
    merge: [],
    sseIndex: [],
    breaks: [],
    leftProbText: '--',
    midProbText: '--',
    rightProbText: '--'
  }
}

/** Mode1/2 */ /**在index1接受到json数据后进行数据格式转换 */
export function mapVBackToView(
  data: VBackPredictData,
  opts: { mode: 'merge' | 'curve'; sse?: SseIndexMinData }
): VReverseProbabilityViewModel {
  const left = toProbPoints(data.left)
  const right = toProbPoints(data.right)
  const single = toProbPoints(data.single)
  const merge = toProbPoints(data.merge)
  const sseIndex = toPricePoints(opts.sse ?? [])

  return {
    mode: opts.mode,
    times: buildTimes(left, right, single, merge, sseIndex),
    left,
    right,
    single,
    merge,
    sseIndex,
    breaks: data.vpoint.map((p) => ({
      time: formatTime(p.dealDate),
      position: p.position,
      type: p.type
    })),
    leftProbText: latestText(data.left),
    midProbText: latestText(data.merge),
    rightProbText: latestText(data.right)
  }
}

export function mapAntiVToView(data: BackVMonitorData): VReverseProbabilityViewModel {
  const merge = toProbPoints(data.backV) // 0~1 → %
  const sseIndex = toPricePoints(data.szData) // close
  const sseChange = toChangePoints(data.szData)

  return {
    mode: 'anti',
    times: buildTimes(merge, sseChange),
    left: [],
    right: [],
    single: [],
    merge, // 反V概率曲线
    sseIndex,
    sseChange, // 涨幅曲线
    breaks: data.vpoint.map((p) => ({
      time: formatTime(p.dealDate),
      position: p.position,
      type: p.type
    })),
    leftProbText: '--',
    midProbText: latestText(data.backV),
    rightProbText: '--'
  }
}

/**mode3 */
function toChangePoints(list: BackVSzItem[] = []): VProbPoint[] {
  const sorted = [...list].sort((a, b) => toMs(a.dealDate) - toMs(b.dealDate))
  if (!sorted.length) return []
  const base = sorted[0].close

  return sorted.map((i) => {
    let pct: number | null = null
    if (typeof i.changePercent === 'number') pct = i.changePercent
    else if (typeof i.changePercent === 'string' && i.changePercent !== '') {
      const n = Number(i.changePercent)
      if (!Number.isNaN(n)) pct = n
    }
    if (pct == null) {
      pct = base ? ((i.close - base) / base) * 100 : 0
    }
    return { time: formatTime(i.dealDate), value: pct }
  })
}

/** Mode4 */
export function mapNewVRightToView(data: NewVRightData): VReverseProbabilityViewModel {
  // data 本身就是数组
  const merge = data.map((i) => ({ time: i.time, value: i.chance })) // 已是%
  const sseIndex = data.map((i) => ({ time: i.time, value: i.close }))
  const last = data[data.length - 1]

  return {
    ...emptyVm('newRight'),
    times: data.map((i) => i.time),
    merge,
    sseIndex,
    midProbText: last == null ? '--' : `${last.chance.toFixed(2)}%`,
    rightProbText: last == null ? '--' : `${last.chance.toFixed(2)}%`
  }
}
