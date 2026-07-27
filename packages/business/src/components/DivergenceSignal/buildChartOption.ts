import type { ChartOption } from '@my-repo/ui'
import type { DivergenceChartModel } from './types'

export function buildDivergenceChartOption(
  chart: DivergenceChartModel,
  activeSignalId: number | null
): ChartOption {
  const isLine = Number(chart.period) === 1

  const markPointData = chart.markPoints.map((p) => {
    const active = p.signalId === activeSignalId
    return {
      name: p.name,
      coord: [chart.categories[p.xIndex], p.yValue],
      value: p.name,
      symbol: 'circle',
      symbolSize: active ? 14 : 8,
      symbolOffset: [0, p.offsetY],
      itemStyle: {
        color: p.color,
        borderColor: active ? '#f5e74a' : 'transparent',
        borderWidth: active ? 2 : 0
      },
      label: {
        show: true,
        formatter: active ? `${p.name}\n${p.timeLabel}` : p.name,
        color: p.color,
        fontWeight: active ? 700 : 400,
        fontSize: active ? 12 : 10,
        position: p.isTop ? 'top' : 'bottom'
      }
    }
  })

  const series = isLine
    ? [
        {
          type: 'line' as const,
          name: '走势',
          data: chart.lineValues,
          showSymbol: false,
          smooth: true,
          lineStyle: { color: '#ff5b3f', width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255,91,63,0.35)' },
                { offset: 1, color: 'rgba(255,91,63,0.02)' }
              ]
            }
          },
          markPoint: { data: markPointData }
        }
      ]
    : [
        {
          type: 'candlestick' as const,
          name: 'K线',
          data: chart.candles,
          itemStyle: {
            color: '#ff5b3f',
            color0: '#3d7eff',
            borderColor: '#ff5b3f',
            borderColor0: '#3d7eff'
          },
          markPoint: { data: markPointData }
        }
      ]

  return {
    backgroundColor: 'transparent',
    grid: { left: 12, right: 48, top: 28, bottom: 28, containLabel: true },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: chart.categories,
      axisLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10 },
      axisLine: { lineStyle: { color: 'rgba(20,203,240,0.25)' } }
    },
    yAxis: {
      type: 'value',
      scale: true,
      position: 'right',
      splitLine: { lineStyle: { color: 'rgba(20,203,240,0.12)' } },
      axisLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 10 }
    },
    series
  }
}
