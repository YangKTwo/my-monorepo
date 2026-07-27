<template>
  <div class="diverge">
    <header class="diverge__hd">
      <h3 class="diverge__title">背离信号</h3>

      <div class="diverge__filters">
        <UiDatePicker
          :model-value="dateRange"
          type="daterange"
          variant="dashboard"
          width="260px"
          @update:model-value="onRangeChange"
        />

        <UiSelect
          :model-value="exponentName"
          variant="dashboard"
          width="120px"
          :options="exponentOptions"
          @update:model-value="onExponentChange"
        />

        <UiSelect
          :model-value="period"
          variant="dashboard"
          width="100px"
          :options="periodOptions"
          @update:model-value="onPeriodChange"
        />
      </div>
    </header>

    <div class="diverge__body">
      <!-- 左：信号列表 -->
      <ul class="diverge__list">
        <li
          v-for="item in data.list"
          :key="item.signalId"
          class="diverge__item"
          :class="{ 'is-active': item.signalId === activeSignalId }"
          :style="{ '--sig-color': item.color }"
          @mouseenter="emit('update:activeSignalId', item.signalId)"
          @mouseleave="emit('update:activeSignalId', null)"
        >
          <div class="diverge__item-time">
            <strong>{{ item.timeText }}</strong>
            <span>{{ item.dateText }}</span>
          </div>
          <div class="diverge__item-name">
            {{ item.typeName }}
          </div>
        </li>
        <li v-if="!data.list.length" class="diverge__empty">暂无背离信号</li>
      </ul>

      <!-- 右：图 -->
      <div ref="chartWrapRef" class="diverge__chart">
        <div v-if="data.legend.length" class="diverge__legend">
          <span v-for="l in data.legend" :key="l.typeName" class="diverge__legend-item">
            <i :style="{ background: l.color }" />
            {{ l.typeName }}
          </span>
        </div>
        <Chart ref="chartRef" :option="chartOption" width="100%" height="100%" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Chart, UiDatePicker, UiSelect, type ChartOption, type UiSelectOption } from '@my-repo/ui'
import type { DivergencePeriod } from '@my-repo/apis'
import type { DivergenceSignalViewModel } from './types'
import { buildDivergenceChartOption } from './buildChartOption'

const props = defineProps<{
  data: DivergenceSignalViewModel
  dateRange: [string, string]
  exponentName: string
  period: DivergencePeriod | number
  exponentOptions: UiSelectOption[]
  activeSignalId: number | null
}>()

const emit = defineEmits<{
  'update:dateRange': [[string, string]]
  'update:exponentName': [string]
  'update:period': [DivergencePeriod]
  'update:activeSignalId': [number | null]
}>()

const periodOptions: UiSelectOption[] = [
  { label: '1分钟', value: 1 },
  { label: '5分钟', value: 5 },
  { label: '15分钟', value: 15 },
  { label: '30分钟', value: 30 },
  { label: '60分钟', value: 60 },
  { label: '日线', value: 240 }
]

const chartWrapRef = ref<HTMLElement>()
const chartRef = ref<{ resize: () => void } | null>(null)
let chartResizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (!chartWrapRef.value) return
  chartResizeObserver = new ResizeObserver(() => chartRef.value?.resize())
  chartResizeObserver.observe(chartWrapRef.value)
})

onBeforeUnmount(() => {
  chartResizeObserver?.disconnect()
})

const chartOption = computed<ChartOption>(() =>
  buildDivergenceChartOption(props.data.chart, props.activeSignalId)
)

function onRangeChange(v: string | [string, string] | null) {
  if (Array.isArray(v) && v[0] && v[1]) emit('update:dateRange', [v[0], v[1]])
}
function onExponentChange(v: string | number | boolean | null) {
  if (typeof v === 'string') emit('update:exponentName', v)
}
function onPeriodChange(v: string | number | boolean | null) {
  if (typeof v === 'number') emit('update:period', v as DivergencePeriod)
}
</script>

<style scoped lang="scss">
.diverge {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  color: #e5eaf0;
}

.diverge__hd {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.diverge__title {
  margin: 0;
  font-size: clamp(12px, 3.8cqw, 16px);
  font-weight: 500;
  color: var(--primary-color, #14cbf0);
}

.diverge__filters {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.diverge__body {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 10px;
}

.diverge__list {
  width: 24%;
  min-width: 140px;
  max-width: 220px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: auto;
  border-right: 1px solid rgba(20, 203, 240, 0.15);
}

.diverge__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: default;

  &.is-active,
  &:hover {
    border-color: var(--primary-color, #14cbf0);
    background: rgba(20, 203, 240, 0.12);
    box-shadow: inset 0 0 10px rgba(20, 203, 240, 0.25);
  }
}

.diverge__item-time {
  display: flex;
  flex-direction: column;
  strong {
    font-size: 14px;
  }
  span {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.45);
  }
}

.diverge__item-name {
  font-size: 15px;
  font-weight: 700;
  color: var(--sig-color);
}

.diverge__empty {
  padding: 16px 8px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
}

.diverge__chart {
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  /* Chart height:100% 依赖父级有实际高度 */
  height: 100%;

  :deep(.ui-chart) {
    height: 100% !important;
    min-height: 160px;
  }
}

.diverge__legend {
  position: absolute;
  top: 0;
  left: 8px;
  z-index: 2;
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.diverge__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }
}
</style>
