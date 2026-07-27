<template>
  <UiFrameDialog
    :model-value="modelValue"
    :width="width"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="cap-past5">
      <UiTable
        :data="data"
        :columns="columns"
        size="small"
        empty-text="暂无数据"
        variant="dashboard"
      >
        <template #openChangePercentOne="{ row }">
          <span :class="pctClass(row.openChangePercentOne)">
            {{ fmtPct(row.openChangePercentOne) }}
          </span>
        </template>
        <template #openChangePercentTwo="{ row }">
          <span :class="pctClass(row.openChangePercentTwo)">
            {{ fmtPct(row.openChangePercentTwo) }}
          </span>
        </template>
        <template #openStyle="{ row }">
          {{ row.openStyle || '-' }}
        </template>
        <template #middleChangePercentOne="{ row }">
          <span :class="pctClass(row.middleChangePercentOne)">
            {{ fmtPct(row.middleChangePercentOne) }}
          </span>
        </template>
        <template #middleChangePercentTwo="{ row }">
          <span :class="pctClass(row.middleChangePercentTwo)">
            {{ fmtPct(row.middleChangePercentTwo) }}
          </span>
        </template>
        <template #middleStyle="{ row }">
          {{ row.middleStyle || '-' }}
        </template>
        <template #practicalStyle="{ row }">
          {{ row.practicalStyle || '-' }}
        </template>
      </UiTable>
    </div>
  </UiFrameDialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { UiFrameDialog, UiTable, type TableColumn } from '@my-repo/ui'
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

const columns = computed<TableColumn[]>(() => [
  { key: 'date', prop: 'date', label: '日期', minWidth: 72, align: 'center' },
  {
    key: 'openGroup',
    label: '开盘涨幅',
    children: [
      { key: 'openChangePercentOne', label: nameOne.value, minWidth: 64, align: 'center' },
      { key: 'openChangePercentTwo', label: nameTwo.value, minWidth: 72, align: 'center' }
    ]
  },
  { key: 'openStyle', label: '预测风格', minWidth: 64, align: 'center' },
  {
    key: 'middleGroup',
    label: '11:30涨幅',
    children: [
      { key: 'middleChangePercentOne', label: nameOne.value, minWidth: 64, align: 'center' },
      { key: 'middleChangePercentTwo', label: nameTwo.value, minWidth: 72, align: 'center' }
    ]
  },
  { key: 'middleStyle', label: '预测风格', minWidth: 64, align: 'center' },
  { key: 'practicalStyle', label: '收盘风格', minWidth: 64, align: 'center' }
])

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

/* 涨跌色仍留在业务层；表格皮肤交给 UiTable variant=dashboard */
.is-up {
  color: #ff5a7a;
}
.is-down {
  color: #19ebff;
}
</style>
