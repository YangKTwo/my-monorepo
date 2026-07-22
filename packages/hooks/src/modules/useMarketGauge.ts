import { computed, ref, type Ref } from 'vue'
import { forecastApi, type PredictItem } from '@my-repo/apis'
import {
  mapForecastToGauge,
  mapLongShortToGauge,
  pickLatestForecast,
  pickLatestPredict,
  type ForecastQuartilesVo,
  type MarketLevelViewModel
} from '@my-repo/business'

type GaugeMode = 'level' | 'longShort'

export function useMarketGauge(dealDate: Ref<string>) {
  const gaugeMode = ref<GaugeMode>('level')
  const levelList = ref<ForecastQuartilesVo[]>([])
  const longShortList = ref<PredictItem[]>([])
  const loading = ref(false)

  const viewData = computed<MarketLevelViewModel>(() => {
    if (gaugeMode.value === 'level') {
      const vo = pickLatestForecast(levelList.value)
      return vo
        ? mapForecastToGauge(vo, '开盘预估')
        : mapForecastToGauge({ predict: 1, dealTime: '' }, '开盘预估')
    }
    const item = pickLatestPredict(longShortList.value)
    return item
      ? mapLongShortToGauge(item, '多空预估')
      : mapLongShortToGauge({ dealDate: 0, predict: 0, pupil: '多', szPro: 0 }, '多空预估')
  })

  async function refresh() {
    loading.value = true
    try {
      const [a, b] = await Promise.all([
        forecastApi.getForecastIndexProb({ dealDate: dealDate.value }),
        forecastApi.getLastPredict()
      ])
      levelList.value = a ?? []
      longShortList.value = b ?? []
    } catch (e) {
      console.error(e)
      levelList.value = []
      longShortList.value = []
    } finally {
      loading.value = false
    }
  }

  function toggle() {
    gaugeMode.value = gaugeMode.value === 'level' ? 'longShort' : 'level'
  }

  return {
    viewData,
    loading,
    toggle,
    refresh
  }
}
