export type ProbMode = 'merge' | 'curve' | 'anti' | 'newRight'

export interface VProbPoint {
  time: string
  value: number
}

export interface VBreakPoint {
  time: string
  position: 'left' | 'right' | 'single' | string
  type: string
}

export interface VReverseProbabilityViewModel {
  mode: ProbMode
  times: string[]
  left: VProbPoint[]
  right: VProbPoint[]
  single: VProbPoint[]
  merge: VProbPoint[] // Mode3=反V概率% ；Mode4=chance%
  sseIndex: VProbPoint[] // 上证价格
  sseChange?: VProbPoint[] // Mode3 专用：上证涨幅%
  breaks: VBreakPoint[]
  leftProbText: string
  midProbText: string
  rightProbText: string
}
