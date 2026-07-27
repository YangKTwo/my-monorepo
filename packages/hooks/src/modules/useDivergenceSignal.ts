import {
  divergenceApi,
  divergenceMockApi,
  DivergencePeriod,
  ExponentInfo,
  ExponentItem,
  IndexDeviateSignal
} from '@my-repo/apis'
import { DivergenceSignalViewModel, mapDivergenceToView } from '@my-repo/business'
import { computed, ref, watch } from 'vue'

export function useDivergenceSignal() {
  const dateRange = ref<[string, string]>(['2025-03-27', '2025-03-27'])
  const exponentName = ref('上证指数')
  const period = ref<DivergencePeriod>(1)

  const exponentOptions = ref<ExponentInfo[]>([])
  const quotes = ref<ExponentItem[]>([])
  const signals = ref<IndexDeviateSignal[]>([])
  const loading = ref(false)
  const activeSignalId = ref<number | null>(null)

  async function loadExponents() {
    exponentOptions.value = (await divergenceApi.allExponentLs()) ?? []
  }

  async function refresh() {
    loading.value = true
    try {
      const [startDate, endDate] = dateRange.value
      const params = {
        startDate,
        endDate,
        exponentName: exponentName.value,
        period: period.value
      }

      const [quoteRes, signalRes] = await Promise.all([
        divergenceApi.listMinByPeriod(params),
        divergenceMockApi.getIndexDeviateSignal(params)
        // divergenceApi.getIndexDeviateSignal(params)
      ])

      quotes.value = Array.isArray(quoteRes) ? quoteRes : []
      signals.value = Array.isArray(signalRes) ? signalRes : []
    } finally {
      loading.value = false
    }
  }

  const exponentSelectOptions = computed(() =>
    exponentOptions.value.map((e) => ({ label: e.name, value: e.name }))
  )

  const viewData = computed<DivergenceSignalViewModel | null>(() => {
    if (!quotes.value.length && !signals.value.length) return null
    return mapDivergenceToView(quotes.value, signals.value, period.value)
  })
  // 筛选项变化自动拉数
  watch([dateRange, exponentName, period], () => {
    void refresh()
  })

  return {
    dateRange,
    exponentName,
    period,
    exponentOptions,
    quotes,
    signals,
    loading,
    activeSignalId,
    exponentSelectOptions,
    viewData,
    loadExponents,
    refresh
  }
}
