<template>
  <div class="fund-chart">
    <!-- 标题 -->
    <div class="fund-chart__title">资金预估-两市</div>

    <!-- 统计行 -->
    <div class="fund-chart__stats">
      <span class="stat-item">
        预估值：<em>{{ data.estimates[data.estimates.length - 1] || '--' }}</em>
      </span>
      <span class="stat-item">
        预估值B：<em>{{ data.estimatesB[data.estimatesB.length - 1] || '--' }}</em>
      </span>
      <span class="stat-item">
        最大值：<em>{{ Math.max(...data.estimates) || '--' }}</em>
      </span>
      <span class="stat-item">
        最小值：<em>{{ Math.min(...data.estimates) || '--' }}</em>
      </span>
    </div>

    <!-- 图例 -->
    <div class="fund-chart__legend">
      <span v-for="item in legendData" class="legend-item" :key="item.name">
        <span class="dot" :style="{ background: item.color }" />
        {{ item.name }}
      </span>
    </div>

    <!-- 图表 -->
    <Chart :option="chartOption" height="100%" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Chart, type ChartOption } from '@my-repo/ui'

// ========== Props ==========
interface FundData {
  xAxis: string[]
  estimates: number[]
  estimatesB: number[]
  actual: number[]
  average: number[]
}

const props = defineProps<{
  data: FundData
}>()

// ========== 图例数据 ==========
const legendData = [
  { name: '预估资金', color: '#409EFF' },
  { name: '预估资金B', color: '#F56C6C' },
  { name: '实际资金', color: '#67C23A' },
  { name: '前五天预测平均值', color: '#E6A23C' }
]

// ========== ECharts 配置 ==========
const chartOption = computed<ChartOption>(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(10, 22, 40, 0.8)',
    borderColor: 'rgba(20, 203, 240, 0.2)',
    textStyle: { color: '#e5eaf0', fontSize: 12 }
  },
  legend: {
    data: legendData.map((i) => i.name),
    textStyle: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
    icon: 'roundRect',
    itemWidth: 16,
    itemHeight: 4,
    right: 0,
    top: 0
  },
  grid: {
    left: 50,
    right: 20,
    bottom: 30,
    top: 40,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: props.data.xAxis,
    boundaryGap: false,
    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
    axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11 },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 15000,
    splitNumber: 5,
    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,0.06)',
        type: 'dashed'
      }
    },
    axisLabel: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 11,
      formatter: (value: number) => {
        if (value >= 10000) return (value / 10000).toFixed(0) + '万'
        return String(value)
      }
    },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  series: [
    {
      name: '预估资金',
      type: 'line',
      data: props.data.estimates,
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { color: '#409EFF', width: 2 },
      itemStyle: { color: '#409EFF' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.15)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.01)' }
          ]
        }
      }
    },
    {
      name: '预估资金B',
      type: 'line',
      data: props.data.estimatesB,
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { color: '#F56C6C', width: 2 },
      itemStyle: { color: '#F56C6C' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(245, 108, 108, 0.12)' },
            { offset: 1, color: 'rgba(245, 108, 108, 0.01)' }
          ]
        }
      }
    },
    {
      name: '实际资金',
      type: 'line',
      data: props.data.actual,
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: { color: '#67C23A', width: 2 },
      itemStyle: { color: '#67C23A' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(103, 194, 58, 0.12)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.01)' }
          ]
        }
      }
    },
    {
      name: '前五天预测平均值',
      type: 'line',
      data: props.data.average,
      smooth: true,
      symbol: 'circle',
      symbolSize: 4,
      lineStyle: {
        color: '#E6A23C',
        width: 2,
        type: 'dashed'
      },
      itemStyle: { color: '#E6A23C' }
    }
  ]
}))
</script>

<style scoped lang="scss">
.fund-chart {
  padding: 4px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: var(--ui-text-color, #fff);
    margin-bottom: 10px;
  }

  &__stats {
    display: flex;
    gap: 24px;
    margin-bottom: 10px;
    flex-wrap: wrap;

    .stat-item {
      font-size: 13px;
      color: var(--ui-text-secondary, rgba(255, 255, 255, 0.5));

      em {
        font-style: normal;
        color: var(--ui-text-color, #fff);
        font-weight: 500;
        margin-left: 2px;
      }
    }
  }

  &__legend {
    display: flex;
    gap: 16px;
    margin-bottom: 10px;
    flex-wrap: wrap;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--ui-text-secondary, rgba(255, 255, 255, 0.5));

      .dot {
        width: 16px;
        height: 3px;
        border-radius: 2px;
        flex-shrink: 0;
      }
    }
  }
}
</style>
