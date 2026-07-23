import type { ChartOption } from '@my-repo/ui'
import type { CapCurveBarViewModel, CapStyleLabel } from './types'

function styleText(s: CapStyleLabel) {
  return s === 'big' ? '大盘' : '小盘'
}

export function buildCapCurveBarOption(vm: CapCurveBarViewModel): ChartOption {
  const times = vm.points.map((p) => p.time)
  const rs = vm.points.map((p) => p.rs)
  const hp = vm.points.map((p) => p.hp)
  const hp1 = vm.points.map((p) => p.hp1)

  const openIdx = vm.points.findIndex((p) => p.mark === 'open')
  const nowIdx = vm.points.findIndex((p) => p.mark === 'now')

  const BIG = '#ff5a7a'
  const SMALL = '#19ebff'
  const SMOOTH = '#4aa3ff'
  const MARK = '#ffba21'

  const markData = [
    openIdx >= 0 && {
      coord: [times[openIdx], hp[openIdx]],
      value: `开盘风格\n${styleText(vm.openStyle)}`,
      itemStyle: { color: MARK },
      label: {
        show: true,
        formatter: '{c}',
        color: MARK,
        fontSize: 11,
        position: 'top',
        lineHeight: 14
      }
    },
    nowIdx >= 0 && {
      coord: [times[nowIdx], hp[nowIdx]],
      value: `现在风格\n${styleText(vm.nowStyle)}`,
      itemStyle: { color: MARK },
      label: {
        show: true,
        formatter: '{c}',
        color: MARK,
        fontSize: 11,
        position: 'top',
        lineHeight: 14
      }
    }
  ].filter(Boolean)

  return {
    backgroundColor: 'transparent',
    legend: {
      top: 0,
      left: 0,
      itemWidth: 10,
      itemHeight: 8,
      textStyle: { color: 'rgba(255,255,255,0.55)', fontSize: 11 },
      data: [
        { name: '大小风格强度', itemStyle: { color: BIG } },
        { name: '平滑指标', itemStyle: { color: SMOOTH } },
        { name: '大小风格', itemStyle: { color: MARK } }
      ]
    },
    // 样式对齐 V 反；自定义 formatter 避免双 grid 默认把系列重复堆满溢出
    tooltip: {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      borderColor: 'rgba(20, 203, 240, 0.3)',
      textStyle: { color: '#e5eaf0', fontSize: 12 },
      formatter: (params: any) => {
        const list = (Array.isArray(params) ? params : [params]) as Array<{
          axisValue?: string
          seriesName?: string
          value?: number | string
        }>
        const t = list[0]?.axisValue ?? ''
        const pick = (name: string) => {
          const hit = list.find((p) => p.seriesName === name)
          if (!hit || hit.value == null || hit.value === '') return '--'
          const n = Number(hit.value)
          return Number.isFinite(n) ? n.toFixed(4) : '--'
        }
        return [
          `${t}`,
          `强度：${pick('大小风格强度')}`,
          `平滑：${pick('平滑指标')}`,
          `HP1：${pick('HP1')}`
        ].join('<br/>')
      }
    },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    grid: [
      { left: 48, right: 16, top: 36, height: '48%' },
      { left: 48, right: 16, top: '68%', height: '22%' }
    ],
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        data: times,
        boundaryGap: false,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.35)' } }
      },
      {
        type: 'category',
        gridIndex: 1,
        data: times,
        boundaryGap: true,
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.45)',
          fontSize: 10,
          interval: Math.max(0, Math.floor(times.length / 5))
        },
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.35)' } }
      }
    ],
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        scale: true,
        axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      {
        type: 'value',
        gridIndex: 1,
        scale: true,
        axisLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } },
        axisLine: { show: false },
        axisTick: { show: false }
      }
    ],
    series: [
      {
        name: '大小风格强度',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: rs,
        showSymbol: false,
        lineStyle: { width: 1.5, color: BIG },
        itemStyle: { color: BIG }
      },
      {
        name: '平滑指标',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: hp,
        showSymbol: false,
        lineStyle: { width: 2, color: SMOOTH },
        itemStyle: { color: SMOOTH },
        markPoint: { symbol: 'circle', symbolSize: 8, data: markData as any }
      },
      {
        name: '大小风格',
        type: 'scatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: [],
        itemStyle: { color: MARK },
        tooltip: { show: false }
      },
      {
        name: 'HP1',
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: hp1,
        barWidth: '60%',
        itemStyle: {
          color: (p: any) => ((p.value as number) >= 0 ? BIG : SMALL)
        }
      }
    ]
  }
}
