import { ref, onMounted, type Ref } from 'vue'
import { useRequest } from '../core/useRequest'

export interface StatisticsData {
  total: number
  growth: number
  active: number
  chartData: any[]
}

export interface UseStatisticsReturn {
  /** 原始数据 */
  data: Ref<StatisticsData | null>
  /** 图表数据（适配后） */
  chartData: Ref<any[]>
  /** 统计摘要 */
  summary: Ref<{
    total: number
    growth: number
    active: number
  }>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误信息 */
  error: Ref<Error | null>
  /** 加载数据 */
  fetchData: () => Promise<StatisticsData | null>
  /** 刷新 */
  refresh: () => Promise<StatisticsData | null>
}

/**
 * 统计数据 Hook
 * 封装统计数据获取逻辑
 */
export function useStatistics(
  fetchFn: () => Promise<StatisticsData>,
  autoFetch: boolean = true
): UseStatisticsReturn {
  const chartData = ref<any[]>([])
  const summary = ref({
    total: 0,
    growth: 0,
    active: 0
  })

  // 适配统计数据
  const adaptStatistics = (rawData: StatisticsData) => {
    summary.value = {
      total: rawData.total || 0,
      growth: rawData.growth || 0,
      active: rawData.active || 0
    }
    chartData.value = rawData.chartData || []
  }

  const { data, loading, error, run } = useRequest<StatisticsData>(fetchFn, {
    immediate: false
  })

  const fetchData = async () => {
    const result = await run()
    if (result) {
      adaptStatistics(result)
    }
    return result || null
  }

  // 组件挂载时自动加载
  if (autoFetch) {
    onMounted(() => {
      fetchData()
    })
  }

  return {
    data,
    chartData,
    summary,
    loading,
    error,
    fetchData,
    refresh: fetchData
  }
}
