<template>
  <div class="dashboard">
    <!-- 资金预估 -->
    <UiCard variant="dashboard" class="chart-card" style="overflow: hidden">
      <FundChart :data="fundData" />
    </UiCard>

    <!-- 后续卡片 -->
    <!-- <UiCard variant="dashboard" class="chart-card">
      <ProfitChart :data="profitData" />
    </UiCard> -->
  </div>
</template>

<script setup lang="ts">
import { UiCard } from '@my-repo/ui'
import { FundChart } from '@my-repo/business'

const fundData = {
  xAxis: ['09:31', '10:00', '10:30', '11:00', '11:30', '13:01', '13:30', '14:30', '15:00'],
  estimates: [11203.81, 12500, 13500, 11500, 14500, 12800, 15000, 13200, 11032.3],
  estimatesB: [11166.43, 11800, 13000, 14000, 12000, 13500, 11500, 14500, 12500],
  actual: [11000, 12000, 14000, 12500, 15000, 13000, 11800, 13500, 11500],
  average: [11500, 12000, 12500, 12800, 13000, 13200, 13500, 13800, 14000]
}
</script>

<style scoped lang="scss">
.dashboard {
  width: 50%;
  // height: 100vh;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: transparent;
  overflow: hidden;
}

.chart-card {
  width: 524px;
  height: 254px;
  box-sizing: border-box;
  overflow: hidden;
}

:deep(.ui-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.ui-card__body) {
  flex: 1;
  overflow: hidden;
  padding: 16px 20px;
}
</style>
