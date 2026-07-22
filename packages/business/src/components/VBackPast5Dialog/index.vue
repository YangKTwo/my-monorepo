<template>
  <UiFrameDialog
    :model-value="modelValue"
    :width="width"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div ref="bodyRef" class="vback-past5">
      <el-table
        :data="data"
        size="small"
        height="100%"
        empty-text="暂无数据"
        class="vback-past5__table"
      >
        <el-table-column prop="dealDate" label="日期" min-width="120" align="center" />
        <el-table-column prop="vPointTime" label="V点时间" min-width="100" align="center" />
        <el-table-column label="V右概率" min-width="100" align="center">
          <template #default="{ row }">
            {{ fmtPro(row.rightPro) }}
          </template>
        </el-table-column>
        <el-table-column label="V左概率" min-width="100" align="center">
          <template #default="{ row }">
            {{ fmtPro(row.leftPro) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </UiFrameDialog>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue'
import { UiFrameDialog } from '@my-repo/ui'
import type { VBackPast5DialogProps } from './types'

const props = withDefaults(defineProps<VBackPast5DialogProps>(), {
  width: '640px',
  data: () => []
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const bodyRef = ref<HTMLElement | null>(null)
let wheelHandler: ((e: WheelEvent) => void) | null = null

function fmtPro(v: number | null | undefined) {
  if (v == null) return '--'
  return `${(v * 100).toFixed(2)}%`
}

function bindWheel() {
  unbindWheel()
  const root = bodyRef.value
  if (!root) return

  wheelHandler = (e: WheelEvent) => {
    if (!e.shiftKey) return
    const wrap =
      (root.querySelector('.el-scrollbar__wrap') as HTMLElement | null) ||
      (root.querySelector('.el-table__body-wrapper') as HTMLElement | null)
    if (!wrap) return
    e.preventDefault()
    wrap.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX
  }

  root.addEventListener('wheel', wheelHandler, { passive: false })
}

function unbindWheel() {
  if (!bodyRef.value || !wheelHandler) return
  bodyRef.value.removeEventListener('wheel', wheelHandler)
  wheelHandler = null
}

watch(
  () => props.modelValue,
  async (visible) => {
    if (!visible) {
      unbindWheel()
      return
    }
    await nextTick()
    bindWheel()
  }
)

onUnmounted(() => unbindWheel())
</script>

<style scoped lang="scss">
.vback-past5 {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.vback-past5__table {
  width: 100%;
  height: 100%;
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

  :deep(.el-table__inner-wrapper) {
    height: 100% !important;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none !important;
  }

  :deep(.el-table__header-wrapper th.el-table__cell) {
    background: transparent !important;
    border-bottom: 1px solid rgba(157, 255, 254, 0.35) !important;
    font-weight: 600;
    font-size: 13px;
  }

  :deep(.el-table__body-wrapper) {
    overflow: auto !important;
  }

  :deep(.el-table__body-wrapper td.el-table__cell) {
    background: transparent !important;
    border-bottom: 1px solid rgba(157, 255, 254, 0.12) !important;
    font-size: 13px;
  }

  :deep(.el-table__empty-text) {
    color: rgba(229, 234, 240, 0.55);
  }

  :deep(.el-scrollbar__bar) {
    opacity: 0.55;
  }
}
</style>
