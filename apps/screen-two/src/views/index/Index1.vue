<template>
  <div class="index-1">
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
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, watch } from 'vue'
import { UiCard } from '@my-repo/ui'
import { MarketLevelGauge, VReverseProbability, VBackPast5Dialog } from '@my-repo/business'
import { useMarketGauge, useVBackProb } from '@my-repo/hooks'
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
  await Promise.all([refreshGauge(), refreshVBack()])
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
