<template>
  <UiFrameDialog
    :model-value="modelValue"
    :width="width"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="cap-past5">
      <el-table :data="data" size="small" empty-text="暂无数据" class="cap-past5__table">
        <el-table-column prop="date" label="日期" min-width="72" align="center" />

        <el-table-column label="开盘涨幅" align="center">
          <el-table-column :label="nameOne" min-width="64" align="center">
            <template #default="{ row }">
              <span :class="pctClass(row.openChangePercentOne)">
                {{ fmtPct(row.openChangePercentOne) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="nameTwo" min-width="72" align="center">
            <template #default="{ row }">
              <span :class="pctClass(row.openChangePercentTwo)">
                {{ fmtPct(row.openChangePercentTwo) }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="预测风格" min-width="64" align="center">
          <template #default="{ row }">
            {{ row.openStyle || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="11:30涨幅" align="center">
          <el-table-column :label="nameOne" min-width="64" align="center">
            <template #default="{ row }">
              <span :class="pctClass(row.middleChangePercentOne)">
                {{ fmtPct(row.middleChangePercentOne) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="nameTwo" min-width="72" align="center">
            <template #default="{ row }">
              <span :class="pctClass(row.middleChangePercentTwo)">
                {{ fmtPct(row.middleChangePercentTwo) }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column label="预测风格" min-width="64" align="center">
          <template #default="{ row }">
            {{ row.middleStyle || '-' }}
          </template>
        </el-table-column>

        <el-table-column label="收盘风格" min-width="64" align="center">
          <template #default="{ row }">
            {{ row.practicalStyle || '-' }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </UiFrameDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UiFrameDialog } from '@my-repo/ui'
import type { CapStylePast5DialogProps } from './types'

const props = withDefaults(defineProps<CapStylePast5DialogProps>(), {
  width: '640px',
  data: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const nameOne = computed(() => props.data[0]?.openExponentNameOne || '上证50')
const nameTwo = computed(() => props.data[0]?.openExponentNameTwo || '中证1000')

function fmtPct(v: number | null | undefined) {
  if (v == null || Number.isNaN(v)) return '-'
  return Number(v).toFixed(2)
}

function pctClass(v: number | null | undefined) {
  if (v == null || Number.isNaN(v) || v === 0) return ''
  return v > 0 ? 'is-up' : 'is-down'
}
</script>

<style scoped lang="scss">
.cap-past5 {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 10%;
}

.cap-past5__table {
  width: 100%;
  flex: 0 0 auto;
  background: transparent !important;
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(157, 255, 254, 0.08);
  --el-table-border-color: rgba(157, 255, 254, 0.28);
  --el-table-text-color: rgba(229, 234, 240, 0.92);
  --el-table-header-text-color: #9dfffe;
  --el-fill-color-blank: transparent;

  &::before,
  &::after {
    display: none !important;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none !important;
  }

  :deep(.el-table__header-wrapper th.el-table__cell) {
    background: transparent !important;
    border-bottom: 1px solid rgba(157, 255, 254, 0.35) !important;
    font-weight: 600;
    font-size: 12px;
  }

  :deep(.el-table__body-wrapper td.el-table__cell) {
    background: transparent !important;
    border-bottom: 1px solid rgba(157, 255, 254, 0.12) !important;
    font-size: 12px;
  }

  :deep(.el-table__empty-text) {
    color: rgba(229, 234, 240, 0.55);
  }

  .is-up {
    color: #ff5a7a;
  }
  .is-down {
    color: #19ebff;
  }
}
</style>
