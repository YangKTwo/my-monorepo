<template>
  <div ref="chartRef" class="ui-chart" :style="containerStyle">
    <div v-if="loading" class="ui-chart_loading">
      <slot name="loading"> 加载中...... </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'
import type { ECharts, EChartsOption } from 'echarts'
import type { ChartProps, ChartExpose } from './types'

const props = withDefaults(defineProps<ChartProps>(), {
  width: '100%',
  height: '400px',
  loading: false,
  theme: 'light',
  autoResize: true
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: ECharts | null = null

const containerStyle = computed(() => ({
  width: props.width,
  height: props.height,
  position: 'relative' as const
}))

const initChart = () => {
  if (!chartRef.value) return
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  chartInstance = echarts.init(chartRef.value, props.theme)
  chartInstance.setOption(props.option)
}

const updateChart = () => {
  if (!chartInstance) return
  chartInstance.setOption(props.option, true)
}

const showLoading = () => {
  chartInstance?.showLoading()
}

const hideLoading = () => {
  chartInstance?.hideLoading()
}

defineExpose<ChartExpose>({
  getInstance: () => chartInstance,
  resize: () => chartInstance?.resize(),
  setOption: (option: EChartsOption, notMerge = true) => {
    chartInstance?.setOption(option, notMerge)
  },
  showLoading,
  hideLoading
})

watch(
  () => props.option,
  () => {
    updateChart()
  },
  { deep: true }
)

watch(
  () => props.loading,
  (newVal) => {
    if (newVal) {
      showLoading()
    } else {
      hideLoading()
    }
  }
)

const handleResize = () => chartInstance?.resize()

onMounted(() => {
  initChart()
  if (props.autoResize) {
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  if (props.autoResize) {
    window.removeEventListener('resize', handleResize)
  }
  chartInstance?.dispose()
  chartInstance = null
})
</script>

<style scoped lang="scss">
.ui-chart {
  position: relative;

  &__loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.5);
    color: var(--ui-text-secondary, #909399);
    font-size: 14px;
    z-index: 10;
  }
}
</style>
