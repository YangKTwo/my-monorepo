<template>
  <div class="index-1">
    <UiCard variant="dashboard" class="panel panel--gauge" no-padding>
      <div class="panel__body">
        <MarketLevelGauge :data="viewData" @toggle="onToggle" />
      </div>
    </UiCard>

    <UiCard variant="dashboard" class="panel panel--v" no-padding>
      <div class="panel__body">
        <VReverseProbability
          v-if="vProb"
          :data="vProb"
          :mode="probMode"
          :deal-date="dealDate"
          @update:mode="onProbModeChange"
          @update:deal-date="onDealDateChange"
          @open-past5="onOpenPast5"
        />

        <VBackPast5Dialog v-model="past5Visible" :data="past5Rows" />
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { UiCard } from '@my-repo/ui'
import {
  MarketLevelGauge,
  VReverseProbability,
  VBackPast5Dialog,
  mapForecastToGauge,
  mapLongShortToGauge,
  mapVBackToView,
  mapAntiVToView,
  mapNewVRightToView,
  pickLatestForecast,
  pickLatestPredict,
  type ProbMode,
  type ForecastQuartilesVo,
  type VReverseProbabilityViewModel
} from '@my-repo/business'
import {
  forecastApi,
  vBackApi,
  type PredictItem,
  type VBackSuccessData,
  type VBackSuccessRow
} from '@my-repo/apis'
import { registerScreenRefreshKey } from '../../composables/screenRefresh'

/** 接口超时/失败兜底 */
const PAST5_MOCK: VBackSuccessRow[] = [
  { dealDate: '2026-07-20', vPointTime: '10:39', rightPro: 0.6617, leftPro: 0.4997 },
  { dealDate: '2026-07-20', vPointTime: '14:02', rightPro: 0.51, leftPro: 0.1998 },
  { dealDate: '2026-07-20', vPointTime: '14:26', rightPro: 0.3308, leftPro: 0.5607 },
  { dealDate: '2026-07-20', vPointTime: '14:40', rightPro: 0.1813, leftPro: 0.4657 },
  { dealDate: '2026-07-17', vPointTime: '09:50', rightPro: 0.412, leftPro: 0.3694 },
  { dealDate: '2026-07-17', vPointTime: '10:03', rightPro: 0.4999, leftPro: 0.3205 },
  { dealDate: '2026-07-16', vPointTime: '10:00', rightPro: 0.4997, leftPro: 0.4997 },
  { dealDate: '2026-07-15', vPointTime: '10:06', rightPro: 0.4997, leftPro: 0.3301 },
  { dealDate: '2026-07-14', vPointTime: '13:05', rightPro: 0.4997, leftPro: 0.4997 },
  { dealDate: '2026-07-14', vPointTime: '13:22', rightPro: 0.4211, leftPro: 0.3888 },
  { dealDate: '2026-07-14', vPointTime: '14:05', rightPro: 0.3555, leftPro: 0.4122 },
  { dealDate: '2026-07-13', vPointTime: '09:45', rightPro: 0.2801, leftPro: 0.5012 },
  { dealDate: '2026-07-13', vPointTime: '10:18', rightPro: 0.3333, leftPro: 0.4444 },
  { dealDate: '2026-07-13', vPointTime: '13:40', rightPro: 0.5123, leftPro: 0.2987 },
  { dealDate: '2026-07-13', vPointTime: '14:55', rightPro: 0.6001, leftPro: 0.2505 }
]

type GaugeMode = 'level' | 'longShort'

const gaugeMode = ref<GaugeMode>('level')
const levelList = ref<ForecastQuartilesVo[]>([])
const longShortList = ref<PredictItem[]>([])
const loading = ref(false)

/** 字符串日期，与接口 dealDate、UiDatePicker value-format 对齐 */
const dealDate = ref(today())
const probMode = ref<ProbMode>('merge')
const vProb = ref<VReverseProbabilityViewModel | null>(null)

const past5Visible = ref(false)
const past5Rows = ref<VBackSuccessData>([])

let refreshTimer: ReturnType<typeof setInterval> | null = null

const registerScreenRefresh = inject(registerScreenRefreshKey, null)

function today() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function logApi(name: string, data: unknown) {
  console.group(`[VBack] ${name}`)
  console.log(data)
  console.groupEnd()
}

async function fetchGauge() {
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
  }
}

async function loadByMode(mode: ProbMode) {
  try {
    if (mode === 'merge') {
      const [vBackResult, sseResult] = await Promise.allSettled([
        vBackApi.getVBackPredict({ dealDate: dealDate.value }),
        vBackApi.getSseIndexMin({ dealDate: dealDate.value })
      ])

      if (vBackResult.status !== 'fulfilled') {
        throw vBackResult.reason
      }

      const vBack = vBackResult.value
      const sse =
        sseResult.status === 'fulfilled' && Array.isArray(sseResult.value) ? sseResult.value : []

      logApi('VBackPredict', vBack)
      if (sseResult.status === 'fulfilled') logApi('SseIndexMin', sse)
      else console.warn('[VBack] SseIndexMin failed', sseResult.reason)

      vProb.value = mapVBackToView(vBack, { mode: 'merge', sse })
      return
    }

    if (mode === 'curve') {
      const vBack = await vBackApi.getVBackPredict({ dealDate: dealDate.value })
      vProb.value = mapVBackToView(vBack, { mode: 'curve', sse: [] })
      return
    }

    if (mode === 'anti') {
      const raw = await vBackApi.getBackVMonitor({ dealDate: dealDate.value })
      logApi('backVMonitor', raw)
      vProb.value = mapAntiVToView(raw)
      return
    }

    const raw = await vBackApi.getNewVRight({ dealDate: dealDate.value })
    logApi('getNewVRight', raw)
    vProb.value = mapNewVRightToView(raw)
  } catch (e) {
    console.error(`[VBack] loadByMode(${mode}) failed`, e)
    vProb.value = null
  }
}

async function onOpenPast5() {
  past5Visible.value = true
  try {
    const rows = await vBackApi.getVBackSuccessData({ dealDate: dealDate.value })
    logApi('VBackSuccessData', rows)
    past5Rows.value = Array.isArray(rows) && rows.length ? rows : PAST5_MOCK
  } catch (e) {
    console.error('[VBack] past5 failed, use mock', e)
    past5Rows.value = PAST5_MOCK
  }
}

async function onProbModeChange(mode: ProbMode) {
  probMode.value = mode
  await loadByMode(mode)
}

function onDealDateChange(date: string) {
  dealDate.value = date
}

async function fetchAll() {
  loading.value = true
  try {
    await Promise.all([fetchGauge(), loadByMode(probMode.value)])
  } finally {
    loading.value = false
  }
}

const viewData = computed(() => {
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

function onToggle() {
  gaugeMode.value = gaugeMode.value === 'level' ? 'longShort' : 'level'
}

function startAutoRefresh() {
  stopAutoRefresh()
  refreshTimer = setInterval(() => {
    // 弹窗打开时跳过，避免表格数据被刷掉打断阅读
    if (past5Visible.value) return
    void fetchAll()
  }, 30_000)
}

function stopAutoRefresh() {
  if (!refreshTimer) return
  clearInterval(refreshTimer)
  refreshTimer = null
}

onMounted(() => {
  // 顶栏 refresh → 调本页 fetchAll（各页自己注册，Layout 不绑死接口）
  registerScreenRefresh?.(fetchAll)
  void fetchAll()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

// 换日重拉；UiDatePicker 已是 YYYY-MM-DD 字符串
watch(dealDate, (v) => {
  if (!v) return
  void fetchAll()
})
</script>

<style scoped lang="scss">
.index-1 {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  height: 100%;
  padding: 0 16px 16px 0;
  box-sizing: border-box;
}

.panel {
  border-radius: 4px;
  background: rgba(0, 52, 98, 0.6);
  border: 1px solid rgba(20, 203, 240, 0.2);
  box-shadow: inset 0 0 10px 0 rgba(20, 203, 240, 0.4);
  box-sizing: border-box;
}

.panel__body {
  height: 100%;
  padding: 12px 14px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel--gauge {
  width: 425px;
  height: 442px;
  flex-shrink: 0;
}

.panel--v {
  flex: 1;
  min-width: 0;
  max-width: 900px;
  height: 442px;
}
</style>
