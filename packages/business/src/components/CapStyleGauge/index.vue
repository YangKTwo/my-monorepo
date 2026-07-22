<template>
  <div class="cap-style-gauge">
    <div ref="bodyRef" class="body">
      <Chart ref="chartRef" :option="chartOption" width="100%" height="100%" />
      <div class="center" :class="centerClass">
        <p class="center__pct">{{ data.dominantPct.toFixed(2) }}%</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, ChartOption } from '@my-repo/ui'
import { CapStyleViewModel } from './types'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  data: CapStyleViewModel
}>()

const bodyRef = ref<HTMLElement>()
const chartRef = ref<{ resize: () => void } | null>(null)
let resizeObserver: ResizeObserver | null = null

const centerClass = computed(() => {
  if (props.data.dominant === 'small') return 'is-small'
  if (props.data.dominant === 'balance') return 'is-balance'
  return 'is-big'
})

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

const chartOption = computed<ChartOption>(() => {
  const BIG = cssVar('--cap-style-big', '#ff5a7a')
  const SMALL = cssVar('--cap-style-small', '#19ebff')
  const TRACK = cssVar('--cap-style-track', 'rgba(255,255,255,0.08)')
  const width = 14
  return {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        radius: '88%',
        center: ['50%', '52%'],
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
          { value: props.data.big, itemStyle: { color: BIG } },
          { value: props.data.small, itemStyle: { color: SMALL } }
        ]
      }
    ]
  }
})

onMounted(() => {
  if (!bodyRef.value) return
  resizeObserver = new ResizeObserver(() => chartRef.value?.resize())
  resizeObserver.observe(bodyRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped lang="scss">
.cap-style-gauge {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  color: var(--text-color, #e5eaf0);
  container-type: inline-size;
}
.body {
  position: relative;
  flex: 1;
  min-height: 0;
}
.center {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  &.is-big {
    color: var(--cap-style-big, #ff5a7a);
  }
  &.is-small {
    color: var(--cap-style-small, #19ebff);
  }
  //   &.is-balance {
  //     color: #e5eaf0;
  //   }
}
.center__pct {
  margin: 0;
  font-size: clamp(28px, 8cqw, 42px);
  font-weight: 700;
  line-height: 1;
}
</style>
