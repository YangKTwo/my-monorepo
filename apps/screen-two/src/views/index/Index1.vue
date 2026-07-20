<template>
  <div class="index-1">
    <UiCard variant="dashboard" class="panel" no-padding>
      <div class="panel__body">
        <MarketLevelGauge :data="viewData" @toggle="onToggle" />
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { UiCard } from '@my-repo/ui'
import {
  MarketLevelGauge,
  mapForecastToGauge,
  mapLongShortToGauge,
  pickLatestForecast,
  pickLatestPredict,
  type ForecastQuartilesVo
} from '@my-repo/business'
import { forecastApi, type PredictItem } from '@my-repo/apis'

type Mode = 'level' | 'longShort'

const mode = ref<Mode>('level')
const levelList = ref<ForecastQuartilesVo[]>([])
const longShortList = ref<PredictItem[]>([])
const loading = ref(false)

function today() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

async function fetchAll() {
  loading.value = true
  try {
    const [a, b] = await Promise.all([
      forecastApi.getForecastIndexProb({ dealDate: today() }),
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

const viewData = computed(() => {
  if (mode.value === 'level') {
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

function onToggle() {
  mode.value = mode.value === 'level' ? 'longShort' : 'level'
}
onMounted(() => fetchAll())
</script>

<style scoped lang="scss">
.index-1 {
  height: 100%;
  padding: 0 16px 16px 0;
  box-sizing: border-box;
}

.panel {
  /* 宽随视口，上限约原 85% 尺寸 */
  width: clamp(300px, 22vw, 425px);
  /* 高随宽等比，约 442/425 */
  aspect-ratio: 425 / 442;
  height: auto;
  border-radius: 4px;
  background: rgba(0, 52, 98, 0.6);
  border: 1px solid rgba(20, 203, 240, 0.2);
  box-shadow: inset 0 0 10px 0 rgba(20, 203, 240, 0.4);
  backdrop-filter: blur(6px);
  container-type: inline-size; /* 给内部 cqw 用 */
}

.panel__body {
  height: 100%;
  padding: clamp(8px, 3cqw, 14px);
  box-sizing: border-box;
}
</style>
