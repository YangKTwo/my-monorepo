<template>
  <div class="index-1">
    <!-- 第一行 -->
    <div class="index-1__row">
      <UiCard variant="dashboard" class="panel panel--gauge" no-padding>
        <div class="panel__body">
          <MarketLevelGauge :data="viewData" @toggle="toggle" />
        </div>
      </UiCard>

      <UiCard variant="dashboard" class="panel panel--v" no-padding>
        <div class="panel__body">
          <VReverseProbability
            v-if="vProb"
            :data="vProb"
            :mode="probMode"
            :deal-date="dealDate"
            @update:mode="setMode"
            @update:deal-date="onDealDateChange"
            @open-past5="openPast5"
          />
          <VBackPast5Dialog v-model="past5Visible" :data="past5Rows" />
        </div>
      </UiCard>

      <UiCard variant="dashboard" class="panel panel--cap" no-padding>
        <div class="panel__body">
          <CapStyleGauge
            :mode="capMode"
            :data="capData"
            :phase-data="phaseData"
            :curve-bar-data="curveBarData"
            @toggle-mode="toggleCapMode"
            @open-past5="openCapPast5"
          />
          <CapStylePast5Dialog v-model="capPast5Visible" :data="capPast5Rows" />
        </div>
      </UiCard>
    </div>

    <!-- 第二行：占位 -->
    <div class="index-1__row">
      <!-- 背离信号：类似 V 反，先占宽卡 -->
      <UiCard variant="dashboard" class="panel panel--diverge" no-padding>
        <div class="panel__body">
          <div class="panel-placeholder">
            <header class="panel-placeholder__hd">
              <h3 class="panel-placeholder__title">背离信号</h3>
            </header>
            <div class="panel-placeholder__chart">
              <span class="panel-placeholder__tip">图表占位（折线/类 V 反）</span>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- 个股指数差异：柱状图占位 -->
      <UiCard variant="dashboard" class="panel panel--diff" no-padding>
        <div class="panel__body">
          <div class="panel-placeholder">
            <header class="panel-placeholder__hd">
              <h3 class="panel-placeholder__title">个股指数差异</h3>
            </header>
            <div class="panel-placeholder__chart">
              <span class="panel-placeholder__tip">图表占位（柱状图）</span>
            </div>
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { UiCard } from '@my-repo/ui'
import {
  MarketLevelGauge,
  VReverseProbability,
  VBackPast5Dialog,
  CapStyleGauge,
  CapStylePast5Dialog
} from '@my-repo/business'
import { useMarketGauge, useSizingStyle, useVBackProb } from '@my-repo/hooks'
import { registerScreenRefreshKey } from '../../composables/screenRefresh'

function today() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const dealDate = ref(today())
const registerScreenRefresh = inject(registerScreenRefreshKey, null)

const { viewData, toggle, refresh: refreshGauge } = useMarketGauge(dealDate)
const {
  mode: capMode,
  data: capData,
  phaseData,
  curveBarData,
  past5Visible: capPast5Visible,
  past5Rows: capPast5Rows,
  toggleMode: toggleCapMode,
  openPast5: openCapPast5,
  refresh: refreshCap
} = useSizingStyle()
const {
  data: vProb,
  mode: probMode,
  past5Visible,
  past5Rows,
  setMode,
  openPast5,
  refresh: refreshVBack
} = useVBackProb(dealDate)

let refreshTimer: ReturnType<typeof setInterval> | null = null

async function fetchAll() {
  await Promise.all([refreshGauge(), refreshVBack(), refreshCap()])
}

function onDealDateChange(date: string) {
  dealDate.value = date
}

function startAutoRefresh() {
  stopAutoRefresh()
  refreshTimer = setInterval(() => {
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
  registerScreenRefresh?.(fetchAll)
  void fetchAll()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

watch(dealDate, (v) => {
  if (!v) return
  void fetchAll()
})
</script>

<style scoped lang="scss">
.index-1 {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 1.2vw, 16px);
  height: 100%;
  min-height: 0;
  padding: 0 clamp(12px, 1.2vw, 16px) 0 0;
  box-sizing: border-box;
  overflow: auto;
}

.index-1__row {
  display: flex;
  flex: 1 1 0;
  align-items: stretch;
  gap: clamp(12px, 1.2vw, 16px);
  min-height: 0;
}

.panel {
  border-radius: 4px;
  background: rgba(0, 52, 98, 0.6);
  border: 1px solid rgba(20, 203, 240, 0.2);
  box-shadow: inset 0 0 10px 0 rgba(20, 203, 240, 0.4);
  box-sizing: border-box;
  min-width: 0;
  min-height: 0;
  height: 100%;
}

.panel__body {
  height: 100%;
  padding: clamp(8px, 1vw, 14px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* —— 第一行 —— */
.panel--gauge {
  flex: 0 1 28%;
  max-width: 480px;
  min-width: 280px;
}

.panel--v {
  flex: 1 1 40%;
  min-width: 360px;
  max-width: 960px;
}

.panel--cap {
  flex: 0 1 28%;
  max-width: 480px;
  min-width: 280px;
}

/* —— 第二行占位 —— */
.panel--diverge,
.panel--diff {
  flex: 1 1 0;
  min-width: 0;
}

/* 占位内容 */
.panel-placeholder {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.panel-placeholder__hd {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.panel-placeholder__title {
  margin: 0;
  font-size: clamp(12px, 3.8cqw, 16px);
  font-weight: 500;
  color: var(--primary-color, #14cbf0);
}

.panel-placeholder__chart {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed rgba(20, 203, 240, 0.35);
  border-radius: 4px;
  background: rgba(0, 52, 98, 0.25);
}

.panel-placeholder__tip {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
}

@media (max-width: 1400px) {
  .index-1__row {
    flex-wrap: wrap;
    flex: 1 1 auto;
  }

  .panel--gauge,
  .panel--cap,
  .panel--diff {
    flex: 1 1 calc(50% - 8px);
    height: min(40vh, 400px);
  }

  .panel--v,
  .panel--diverge {
    flex: 1 1 100%;
    max-width: none;
    height: min(40vh, 400px);
  }
}
</style>
