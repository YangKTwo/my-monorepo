<template>
  <div class="cap-style-gauge">
    <header class="hd">
      <h3 class="hd__title">大小盘风格</h3>
      <div class="hd__actions">
        <button type="button" class="hd__btn" @click="emit('toggle-mode')">切换形态</button>
        <button type="button" class="hd__btn" @click="emit('open-past5')">过去5日</button>
      </div>
    </header>

    <div class="body">
      <div v-if="mode === 0 && data" ref="bodyRef" class="chart-wrap">
        <Chart ref="chartRef" :option="chartOption" width="100%" height="100%" />
        <div class="center" :class="centerClass">
          <p class="center__verdict">
            {{ verdictLabel }}
          </p>
          <p class="center__pct">{{ data.dominantPct.toFixed(2) }}%</p>
          <div class="center__divider" aria-hidden="true" />
          <div class="center__legend">
            <span class="center__legend-item is-big"> <i class="center__bar" />大盘风格 </span>
            <span class="center__legend-item is-small"> <i class="center__bar" />小盘风格 </span>
          </div>
          <div class="center__pills">
            <span class="center__pill is-big">{{ data.big.toFixed(2) }}%</span>
            <span class="center__pill is-small">{{ data.small.toFixed(2) }}%</span>
          </div>
        </div>
      </div>
      <div v-else-if="mode === 1" class="phase-wrap">
        <CapPhaseGauge v-if="phaseData" :data="phaseData" />
      </div>
      <div v-else-if="mode === 2" ref="curveWrapRef" class="curve-wrap">
        <Chart
          v-if="curveBarData"
          ref="curveChartRef"
          :option="curveBarOption"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, ChartOption } from '@my-repo/ui'
import CapPhaseGauge from './CapPhaseViewModel.vue'
import type { CapCurveBarViewModel, CapPhaseViewModel, CapStyleViewModel } from './types'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { buildCapCurveBarOption } from './buildCapCurveBarOption.js'

const props = defineProps<{
  mode: 0 | 1 | 2
  data?: CapStyleViewModel | null
  phaseData?: CapPhaseViewModel | null
  curveBarData?: CapCurveBarViewModel | null
}>()

const emit = defineEmits<{
  'toggle-mode': []
  'open-past5': []
}>()

const bodyRef = ref<HTMLElement>()
const chartRef = ref<{ resize: () => void } | null>(null)
let resizeObserver: ResizeObserver | null = null

const centerClass = computed(() => {
  if (props.data?.dominant === 'small') return 'is-small'
  if (props.data?.dominant === 'balance') return 'is-balance'
  return 'is-big'
})

const verdictLabel = computed(() => {
  if (props.data?.dominant === 'small') return '小盘占优'
  if (props.data?.dominant === 'balance') return '风格均衡'
  return '大盘占优'
})

const curveWrapRef = ref<HTMLElement>()
const curveChartRef = ref<{ resize: () => void } | null>(null)
let ro: ResizeObserver | null = null

const curveBarOption = computed<ChartOption>(() =>
  props.curveBarData ? buildCapCurveBarOption(props.curveBarData) : { series: [] }
)

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

const chartOption = computed<ChartOption>(() => {
  const BIG = cssVar('--cap-style-big', '#ff5a7a')
  const SMALL = cssVar('--cap-style-small', '#19ebff')
  const TRACK = cssVar('--cap-style-track', 'rgba(255,255,255,0.08)')
  const width = 20
  const big = props.data?.big ?? 0
  const small = props.data?.small ?? 0
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        radius: '88%',
        center: ['50%', '50%'],
        pointer: { show: false },
        anchor: { show: false },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          width
        },
        axisLine: {
          lineStyle: { width, color: [[1, TRACK]] }
        },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false },
        title: { show: false },
        detail: { show: false },
        data: [
          { value: big, itemStyle: { color: BIG } },
          { value: small, itemStyle: { color: SMALL } }
        ]
      }
    ]
  }
})

onMounted(() => {
  if (!bodyRef.value) return
  resizeObserver = new ResizeObserver(() => chartRef.value?.resize())
  resizeObserver.observe(bodyRef.value)
  if (!curveWrapRef.value) return
  ro = new ResizeObserver(() => curveChartRef.value?.resize())
  ro.observe(curveWrapRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  ro?.disconnect()
})
</script>

<style scoped lang="scss">
.cap-style-gauge {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  color: var(--text-color, #e5eaf0);
  font-family: var(--font-family);
  container-type: inline-size;
}

/* —— 顶栏 —— */
.hd {
  display: flex;
  align-items: center;
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

.hd__actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
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
  transition:
    opacity 0.2s,
    background-color 0.2s;

  &:hover {
    opacity: 0.85;
    background: rgba(255, 255, 255, 0.12);
  }
}

/* —— 图表区：居中 —— */
.body {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-wrap {
  position: relative;
  width: min(88%, 320px);
  aspect-ratio: 1;
  max-height: 100%;
}

/* —— 圆心叠层 —— */
.center {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 1.2cqw, 8px);
  padding: 12%;
  box-sizing: border-box;
  pointer-events: none;
  text-align: center;

  &.is-big {
    .center__verdict,
    .center__pct {
      color: var(--cap-style-big, #ff5a7a);
    }
  }

  &.is-small {
    .center__verdict,
    .center__pct {
      color: var(--cap-style-small, #19ebff);
    }
  }

  &.is-balance {
    .center__verdict,
    .center__pct {
      color: #e5eaf0;
    }
  }
}

.center__verdict {
  margin: 0;
  font-size: clamp(14px, 4.5cqw, 18px);
  font-weight: 600;
  line-height: 1.2;
}

.center__pct {
  margin: 0;
  font-size: clamp(24px, 8.5cqw, 36px);
  font-weight: 700;
  line-height: 1;
}

.center__divider {
  width: 56%;
  height: 1px;
  margin: clamp(2px, 0.8cqw, 6px) 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 100%
  );
}

.center__legend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(10px, 3cqw, 16px);
  font-size: clamp(10px, 2.8cqw, 12px);
}

.center__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  &.is-big {
    color: var(--cap-style-big, #ff5a7a);
  }

  &.is-small {
    color: var(--cap-style-small, #19ebff);
  }
}

.center__bar {
  display: inline-block;
  width: 14px;
  height: 3px;
  border-radius: 1px;
  background: currentColor;
}

.center__pills {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 2cqw, 10px);
  margin-top: clamp(2px, 0.6cqw, 4px);
}

.center__pill {
  box-sizing: border-box;
  min-width: clamp(56px, 16cqw, 72px);
  padding: 2px clamp(6px, 2cqw, 10px);
  border-radius: 999px;
  border: 1px solid currentColor;
  font-size: clamp(11px, 3cqw, 13px);
  font-weight: 600;
  line-height: 1.4;
  white-space: nowrap;

  &.is-big {
    color: var(--cap-style-big, #ff5a7a);
  }

  &.is-small {
    color: var(--cap-style-small, #19ebff);
  }
}

.phase-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.45);
    font-size: 13px;
  }
}

.curve-wrap {
  flex: 1;
  min-height: 0;
  width: 100%;
  height: 100%;
}
</style>
