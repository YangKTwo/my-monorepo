<template>
  <div class="market-level-gauge">
    <header class="hd">
      <div class="hd__left">
        <h3 class="hd__title">行情等级预估</h3>
        <ul class="legend">
          <li><i class="legend__dot is-empty" />空</li>
          <li><i class="legend__dot is-osc-empty" />震荡空</li>
          <li><i class="legend__dot is-osc-long" />震荡多</li>
          <li><i class="legend__dot is-long" />多</li>
        </ul>
      </div>
      <button type="button" class="hd__btn" @click="emit('toggle')">切换多空预估</button>
    </header>

    <div ref="bodyRef" class="body">
      <Chart ref="chartRef" :option="chartOption" width="100%" height="100%" />
      <div class="ft">
        <p v-if="data.probabilityText" class="ft__prob">概率：{{ data.probabilityText }}</p>
        <p class="ft__label" :class="data.label === '多' ? 'is-long' : 'is-empty'">
          {{ data.label }}
        </p>
        <p class="ft__sub">
          {{ data.subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Chart, type ChartOption } from '@my-repo/ui'
import type { MarketLevelViewModel } from './types'

const props = defineProps<{ data: MarketLevelViewModel }>()
const emit = defineEmits<{ toggle: [] }>()

const bodyRef = ref<HTMLElement>()
const chartRef = ref<{ resize: () => void } | null>(null)
let resizeObserver: ResizeObserver | null = null

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

const chartOption = computed<ChartOption>(() => {
  const empty = cssVar('--gauge-level-empty', '#25e391')
  const oscEmpty = cssVar('--gauge-level-osc-empty', '#00fff4')
  const oscLong = cssVar('--gauge-level-osc-long', '#ffba21')
  const long = cssVar('--gauge-level-long', '#ff5134')
  const width = parseFloat(cssVar('--gauge-axis-width', '11')) || 11

  return {
    series: [
      {
        type: 'gauge',
        startAngle: 225,
        endAngle: -45,
        center: ['50%', '50%'],
        radius: '88%',
        min: -100,
        max: 100,
        splitNumber: 8,
        axisLine: {
          lineStyle: {
            width,
            color: [
              [0.25, empty],
              [0.5, oscEmpty],
              [0.75, oscLong],
              [1, long]
            ]
          }
        },
        pointer: { length: '60%', width: 6 },
        axisTick: { show: true },
        splitLine: { length: 12 },
        axisLabel: {
          distance: 14,
          formatter: (v: number) => String(Math.abs(Math.round(v)))
        },
        title: { show: false },
        detail: { show: false },
        data: [{ value: props.data.gaugeValue }]
      }
    ]
  }
})

onMounted(() => {
  if (!bodyRef.value) return
  // 容器尺寸变化时重绘（Chart 默认只听 window.resize）
  resizeObserver = new ResizeObserver(() => {
    chartRef.value?.resize()
  })
  resizeObserver.observe(bodyRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  resizeObserver = null
})
</script>

<style scoped lang="scss">
.market-level-gauge {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  color: var(--text-color, #e5eaf0);
  font-family: var(--font-family);
}

/* —— 顶栏 —— */
.hd {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(8px, 2cqw, 12px);
  flex-shrink: 0;
  margin-bottom: clamp(4px, 1.5cqw, 8px);
}

.hd__title {
  margin: 0;
  font-size: clamp(12px, 3.8cqw, 16px);
  font-weight: 500;
  color: var(--primary-color, #14cbf0);
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(8px, 2.5cqw, 12px);
  margin: clamp(4px, 1.5cqw, 8px) 0 0;
  padding: 0;
  list-style: none;
  font-size: clamp(10px, 2.8cqw, 12px);
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
}

.legend li {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.legend__dot {
  width: clamp(6px, 1.8cqw, 8px);
  height: clamp(6px, 1.8cqw, 8px);
  border-radius: 50%;

  &.is-empty {
    background: var(--gauge-level-empty);
  }
  &.is-osc-empty {
    background: var(--gauge-level-osc-empty);
  }
  &.is-osc-long {
    background: var(--gauge-level-osc-long);
  }
  &.is-long {
    background: var(--gauge-level-long);
  }
}

.hd__btn {
  flex-shrink: 0;
  height: clamp(22px, 6cqw, 28px);
  padding: 0 clamp(6px, 2cqw, 10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: clamp(10px, 2.8cqw, 12px);
  cursor: pointer;
}

/* —— 图区：吃满剩余高度 —— */
.body {
  position: relative;
  flex: 1;
  min-height: 0;
}

.ft {
  position: absolute;
  left: 50%;
  bottom: 6%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.ft__prob {
  margin: 0;
  font-size: clamp(11px, 3.2cqw, 14px);
  color: var(--gauge-level-long);
}

.ft__label {
  margin: 2px 0;
  font-size: clamp(24px, 8.5cqw, 36px);
  font-weight: 600;
  line-height: 1.1;

  &.is-long {
    color: var(--gauge-level-long);
  }
  &.is-empty {
    color: var(--gauge-level-empty);
  }
}

.ft__sub {
  margin: 0;
  font-size: clamp(10px, 2.8cqw, 12px);
  color: rgba(255, 255, 255, 0.85);
}
</style>
