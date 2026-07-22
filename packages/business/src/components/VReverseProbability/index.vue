<template>
  <div class="v-prob">
    <header class="v-prob__hd">
      <div class="v-prob__hd-left">
        <h3 class="v-prob__title">V反概率预估</h3>
        <p class="v-prob__hint">字体颜色区分V左V右、边框颜色区分V点类型</p>
      </div>

      <div class="v-prob__filters">
        <UiDatePicker
          :model-value="dealDate"
          variant="dashboard"
          @update:model-value="onDealDateChange"
        />

        <UiSelect v-model="pointType" variant="dashboard" :options="pointTypeOptions" />

        <!-- Mode 受控：父组件拉数 -->
        <UiSelect
          :model-value="mode"
          variant="dashboard"
          width="150px"
          :options="modeOptions"
          @update:model-value="onModeChange"
        />

        <button type="button" class="v-prob__chip" @click="emit('open-past5')">过去5日</button>
      </div>
    </header>

    <div ref="chartWrapRef" class="v-prob__chart">
      <Chart ref="chartRef" :option="chartOption" width="100%" height="100%" />
    </div>

    <div class="v-prob__stats">
      <div class="stat is-left">
        <span class="stat__label">V左概率</span>
        <strong class="stat__value">{{ data.leftProbText }}</strong>
      </div>
      <div class="stat is-mid">
        <strong class="stat__value">{{ data.midProbText }}</strong>
        <span class="stat__label">V综合概率</span>
      </div>
      <div class="stat is-right">
        <strong class="stat__value">{{ data.rightProbText }}</strong>
        <span class="stat__label">V右概率</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Chart, UiDatePicker, UiSelect, type ChartOption, type UiSelectOption } from '@my-repo/ui'
import type { ProbMode, VProbPoint, VReverseProbabilityViewModel } from './types'

const props = defineProps<{
  data: VReverseProbabilityViewModel
  mode: ProbMode
  /** 交易日 YYYY-MM-DD，由页面拉数 */
  dealDate: string
}>()

const chartWrapRef = ref<HTMLElement>()
const chartRef = ref<{ resize: () => void } | null>(null)
let chartResizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!chartWrapRef.value) return
  chartResizeObserver = new ResizeObserver(() => {
    chartRef.value?.resize()
  })
  chartResizeObserver.observe(chartWrapRef.value)
})

onBeforeUnmount(() => {
  chartResizeObserver?.disconnect()
  chartResizeObserver = null
})

const emit = defineEmits<{
  'update:mode': [ProbMode]
  'update:dealDate': [string]
  'open-past5': []
}>()

const pointType = ref<'突破点' | '启动点'>('突破点')

const pointTypeOptions: UiSelectOption[] = [
  { label: '突破点', value: '突破点' },
  { label: '启动点', value: '启动点' }
]

const modeOptions: UiSelectOption[] = [
  { label: 'V反概率预估综合', value: 'merge' },
  { label: 'V反概率预估曲线', value: 'curve' },
  { label: '反V概率预估', value: 'anti' },
  { label: '新V右概率', value: 'newRight' }
]

function onModeChange(v: string | number | boolean | null) {
  emit('update:mode', v as ProbMode)
}

function onDealDateChange(v: string | null) {
  if (!v) return
  emit('update:dealDate', v)
}

function align(times: string[], points: VProbPoint[]) {
  const map = new Map(points.map((p) => [p.time, p.value]))
  return times.map((t) => map.get(t) ?? null)
}

const chartOption = computed<ChartOption>(() => {
  const d = props.data
  const mode = props.mode

  if (mode === 'merge') return buildMode1Option(d, pointType.value)
  if (mode === 'curve') return buildMode2Option(d, pointType.value)
  if (mode === 'anti') return buildMode3Option(d, pointType.value)
  if (mode === 'newRight') return buildMode4Option(d)
  return {
    series: []
  }
})

function buildMode1Option(d: VReverseProbabilityViewModel, pointType: string): ChartOption {
  const breaks = d.breaks.filter((b) => b.type === pointType)
  const priceMap = new Map(d.sseIndex.map((p) => [p.time, p.value]))

  // 信号点：横轴用 time，挂在上证价格上
  const markPoints = breaks.map((b) => ({
    name: b.type,
    coord: [b.time, priceMap.get(b.time) ?? 0] as [string, number],
    label: {
      show: true,
      formatter: b.position === 'left' ? '左' : b.position === 'right' ? '右' : '单',
      color: b.position === 'left' ? '#19ebff' : b.position === 'right' ? '#ff5b3f' : '#ffbd32',
      fontSize: 10
    },
    itemStyle: {
      color: 'transparent',
      borderColor: b.type === '突破点' ? '#ffbd32' : '#a78bfa',
      borderWidth: 2
    }
  }))

  // 同分钟查概率，给 tooltip 用
  const leftMap = new Map(d.left.map((p) => [p.time, p.value]))
  const rightMap = new Map(d.right.map((p) => [p.time, p.value]))
  const mergeMap = new Map(d.merge.map((p) => [p.time, p.value]))
  return {
    backgroundColor: 'transparent',
    legend: {
      data: ['上证指数'],
      textStyle: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },
      top: 0,
      right: 0
    },
    grid: { left: 56, right: 16, top: 36, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      borderColor: 'rgba(20, 203, 240, 0.3)',
      textStyle: { color: '#e5eaf0', fontSize: 12 },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params
        const t = p?.axisValue as string
        const price = p?.data
        const left = leftMap.get(t)
        const right = rightMap.get(t)
        const merge = mergeMap.get(t)
        return [
          `${t}`,
          `上证：${price == null ? '--' : Number(price).toFixed(2)}`,
          `V左：${left == null ? '--' : left.toFixed(2)}%`,
          `V右：${right == null ? '--' : right.toFixed(2)}%`,
          `综合：${merge == null ? '--' : merge.toFixed(2)}%`
        ].join('<br/>')
      }
    },
    xAxis: {
      type: 'category',
      data: d.times,
      boundaryGap: false,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 11, hideOverlap: true }
    },
    // Mode1：Y 轴是价格，不要写死 0~100
    yAxis: {
      type: 'value',
      scale: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
    },
    series: [
      {
        name: '上证指数',
        type: 'line',
        showSymbol: false,
        smooth: true,
        data: align(d.times, d.sseIndex), // 已有 align 函数可复用
        itemStyle: { color: '#14cbf0' },
        lineStyle: { width: 2, color: '#14cbf0' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(20, 203, 240, 0.35)' },
              { offset: 1, color: 'rgba(20, 203, 240, 0.02)' }
            ]
          }
        },
        markPoint: {
          symbolSize: 12,
          data: markPoints
        }
      }
    ]
  }
}

function buildMode2Option(d: VReverseProbabilityViewModel, pointType: string): ChartOption {
  const breaks = d.breaks.filter((b) => b.type === pointType)

  const mergeMap = new Map(d.merge.map((p) => [p.time, p.value]))
  const markPoints = breaks.map((b) => {
    const y =
      b.position === 'left'
        ? (d.left.find((p) => p.time === b.time)?.value ?? mergeMap.get(b.time) ?? 0)
        : b.position === 'right'
          ? (d.right.find((p) => p.time === b.time)?.value ?? mergeMap.get(b.time) ?? 0)
          : (mergeMap.get(b.time) ?? 0)

    return {
      name: b.type,
      coord: [b.time, y] as [string, number],
      label: {
        show: true,
        formatter: b.position === 'left' ? '左' : b.position === 'right' ? '右' : '单',
        color: b.position === 'left' ? '#19ebff' : b.position === 'right' ? '#ff5b3f' : '#ffbd32',
        fontSize: 10
      },
      itemStyle: {
        color: 'transparent',
        borderColor: b.type === '突破点' ? '#ffbd32' : '#a78bfa',
        borderWidth: 2
      }
    }
  })

  const line = (name: string, points: VProbPoint[], color: string, withMarks = false) => ({
    name,
    type: 'line' as const,
    showSymbol: false,
    smooth: true,
    data: align(d.times, points),
    itemStyle: { color },
    lineStyle: { width: 2, color },
    ...(withMarks ? { markPoint: { symbolSize: 12, data: markPoints } } : {})
  })

  return {
    backgroundColor: 'transparent',
    legend: {
      data: ['V左', 'V右', '单边', '综合'],
      textStyle: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },
      top: 0,
      right: 0
    },
    grid: { left: 48, right: 16, top: 36, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      borderColor: 'rgba(20, 203, 240, 0.3)',
      textStyle: { color: '#e5eaf0', fontSize: 12 },
      valueFormatter: (v: unknown) => (v == null || v === '-' ? '--' : `${Number(v).toFixed(2)}%`)
    },
    xAxis: {
      type: 'category',
      data: d.times,
      boundaryGap: false,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 11,
        hideOverlap: true
      }
    },
    // Mode2：概率轴 0~100
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 11,
        formatter: '{value}%'
      },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
    },
    series: [
      line('V左', d.left, '#19ebff'),
      line('V右', d.right, '#ff5b3f'),
      line('单边', d.single, '#a78bfa'),
      // 中线 + 信号点挂在综合线上
      {
        ...line('综合', d.merge, '#ffbd32', true),
        markLine: {
          symbol: 'none',
          label: {
            show: true,
            formatter: '{c}%',
            color: 'rgba(255,255,255,0.55)',
            fontSize: 10
          },
          lineStyle: { type: 'dashed', width: 1 },
          data: [
            {
              yAxis: 50,
              lineStyle: { color: 'rgba(255,255,255,0.35)' },
              label: { formatter: '50%' }
            },
            {
              yAxis: 55,
              lineStyle: { color: 'rgba(255,189,50,0.55)' },
              label: { formatter: '55%' }
            }
          ]
        }
      }
    ]
  }
}

function dualAxisBase(times: string[]) {
  return {
    backgroundColor: 'transparent',
    legend: {
      textStyle: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },
      top: 0,
      right: 0
    },
    // 双 Y 轴：左右留白要够，避免刻度挤在一起
    grid: { left: 52, right: 48, top: 36, bottom: 28 },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: 'rgba(10, 22, 40, 0.9)',
      borderColor: 'rgba(20, 203, 240, 0.3)',
      textStyle: { color: '#e5eaf0', fontSize: 12 }
    },
    xAxis: {
      type: 'category' as const,
      data: times,
      boundaryGap: false,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.2)' } },
      axisLabel: {
        color: 'rgba(255,255,255,0.55)',
        fontSize: 11,
        hideOverlap: true
      }
    }
  }
}

function buildMode3Option(d: VReverseProbabilityViewModel, pointType: string): ChartOption {
  const breaks = d.breaks.filter((b) => b.type === pointType)
  const probMap = new Map(d.merge.map((p) => [p.time, p.value]))
  const markPoints = breaks.map((b) => ({
    name: b.type,
    coord: [b.time, probMap.get(b.time) ?? 0] as [string, number],
    label: {
      show: true,
      formatter: b.position === 'left' ? '左' : b.position === 'right' ? '右' : '单',
      color: b.position === 'left' ? '#19ebff' : b.position === 'right' ? '#ff5b3f' : '#ffbd32',
      fontSize: 10
    },
    itemStyle: {
      color: 'transparent',
      borderColor: b.type === '突破点' ? '#ffbd32' : '#a78bfa',
      borderWidth: 2
    }
  }))

  const base = dualAxisBase(d.times)

  return {
    ...base,
    legend: { ...base.legend, data: ['反V概率', '上证涨幅'] },
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.55)',
          fontSize: 11,
          formatter: '{value}%'
        },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
      },
      {
        type: 'value',
        scale: true,
        splitNumber: 4,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.55)',
          fontSize: 11,
          formatter: '{value}%'
        },
        // 右轴不画网格，避免和左轴叠成密条
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '反V概率',
        type: 'line',
        yAxisIndex: 0,
        showSymbol: false,
        smooth: true,
        data: align(d.times, d.merge),
        itemStyle: { color: '#19ebff' },
        lineStyle: { width: 2, color: '#19ebff' },
        markPoint: { symbolSize: 12, data: markPoints },
        markLine: {
          symbol: 'none',
          label: {
            show: true,
            color: 'rgba(255,255,255,0.55)',
            fontSize: 10
          },
          lineStyle: { type: 'dashed', width: 1 },
          data: [
            {
              yAxis: 50,
              lineStyle: { color: 'rgba(255,255,255,0.35)' },
              label: { formatter: '50%' }
            },
            {
              yAxis: 55,
              lineStyle: { color: 'rgba(255,189,50,0.55)' },
              label: { formatter: '55%' }
            }
          ]
        }
      },
      {
        name: '上证涨幅',
        type: 'line',
        yAxisIndex: 1,
        showSymbol: false,
        smooth: true,
        data: align(d.times, d.sseChange ?? []),
        itemStyle: { color: '#ffbd32' },
        lineStyle: { width: 2, color: '#ffbd32' }
      }
    ]
  }
}

function buildMode4Option(d: VReverseProbabilityViewModel): ChartOption {
  const base = dualAxisBase(d.times)

  return {
    ...base,
    legend: { ...base.legend, data: ['上证指数', '新V右'] },
    yAxis: [
      {
        type: 'value',
        scale: true,
        // 控制左轴刻度密度，避免 3760/3770/... 挤成一片
        splitNumber: 4,
        minInterval: 20,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.55)',
          fontSize: 11,
          hideOverlap: true
        },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)' } }
      },
      {
        type: 'value',
        min: 0,
        max: 100,
        splitNumber: 5,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(255,255,255,0.55)',
          fontSize: 11,
          formatter: '{value}%'
        },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '上证指数',
        type: 'line',
        yAxisIndex: 0,
        showSymbol: false,
        smooth: true,
        data: align(d.times, d.sseIndex),
        itemStyle: { color: '#14cbf0' },
        lineStyle: { width: 2, color: '#14cbf0' }
      },
      {
        name: '新V右',
        type: 'line',
        yAxisIndex: 1,
        showSymbol: false,
        smooth: true,
        data: align(d.times, d.merge),
        itemStyle: { color: '#c8e86c' },
        lineStyle: { width: 2, color: '#c8e86c' }
      }
    ]
  }
}
</script>

<style scoped lang="scss">
/* 保持你现有样式即可 */
.v-prob {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  color: var(--text-color, #e5eaf0);
}
.v-prob__hd {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.v-prob__title {
  margin: 0;
  font-size: 16px;
  color: var(--primary-color, #14cbf0);
}
.v-prob__hint {
  margin: 6px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
.v-prob__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.v-prob__chip {
  height: 28px;
  padding: 0 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}
.v-prob__chart {
  flex: 1;
  min-height: 0; /* 避免小高度撑破 */
  position: relative;
}
.v-prob__stats {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-top: 10px;
}
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 72px;
  padding: 10px 8px;
  border: 1px dashed rgba(20, 203, 240, 0.45);
  border-radius: 4px;
  background: rgba(0, 52, 98, 0.25);
}
.stat__label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
.stat__value {
  font-size: 28px;
  font-weight: 600;
}
.stat.is-left .stat__value {
  color: #19ebff;
}
.stat.is-mid .stat__value {
  color: #ffbd32;
}
.stat.is-right .stat__value {
  color: #ff5b3f;
}
</style>
