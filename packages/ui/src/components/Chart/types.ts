import type { ECharts, EChartsOption } from 'echarts'

export type ChartOption = EChartsOption

export interface ChartProps {
  option: ChartOption
  width?: string
  height?: string
  loading?: boolean
  theme?: 'light' | 'dark' | string
  autoResize?: boolean
}

export interface ChartExpose {
  getInstance: () => ECharts | null
  resize: () => void
  setOption: (option: ChartOption, notMerge?: boolean) => void
  showLoading: () => void
  hideLoading: () => void
}
