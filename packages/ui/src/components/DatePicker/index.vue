<template>
  <el-date-picker
    class="ui-date-picker"
    :class="[`ui-date-picker--${variant}`]"
    :style="width ? { width } : undefined"
    :model-value="modelValue"
    :type="type"
    :format="format"
    :value-format="valueFormat"
    :placeholder="placeholder"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :range-separator="rangeSeparator"
    :disabled="disabled"
    :clearable="clearable"
    :size="size"
    :teleported="teleported"
    :popper-class="popperClass"
    @update:model-value="onUpdate"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UiDatePickerProps } from './types'

const props = withDefaults(defineProps<UiDatePickerProps>(), {
  modelValue: null,
  format: 'YYYY-MM-DD',
  valueFormat: 'YYYY-MM-DD',
  placeholder: '选择日期',
  startPlaceholder: '开始日期',
  endPlaceholder: '结束日期',
  rangeSeparator: '至',
  disabled: false,
  clearable: false,
  size: 'small',
  variant: 'default',
  teleported: true,
  width: '148px',
  type: 'date'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const popperClass = computed(() =>
  props.variant === 'dashboard'
    ? 'ui-date-picker-popper ui-date-picker-popper--dashboard'
    : 'ui-date-picker-popper'
)

function onUpdate(v: string | null) {
  emit('update:modelValue', v)
}
</script>

<style scoped lang="scss">
.ui-date-picker {
  font-family: var(--font-family);
}

.ui-date-picker--dashboard {
  :deep(.el-input__wrapper) {
    min-height: 28px;
    padding: 0 10px;
    border-radius: var(--card-border-radius, 4px);
    background: var(--card-bg-color, rgba(0, 52, 98, 0.6));
    box-shadow: none;
    border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.2));

    &:hover {
      border-color: var(--primary-color, #14cbf0);
    }

    &.is-focus {
      border-color: var(--primary-color, #14cbf0);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color, #14cbf0) 45%, transparent) inset;
    }
  }

  :deep(.el-input__inner),
  :deep(.el-input__prefix),
  :deep(.el-input__suffix),
  :deep(.el-range-separator),
  :deep(.el-range-input) {
    color: var(--text-color, #e5eaf0);
    font-family: var(--font-family);
    font-size: 12px;
  }

  :deep(.el-input__inner::placeholder) {
    color: var(--text-secondary, rgba(255, 255, 255, 0.6));
  }
}

.ui-date-picker--default {
  :deep(.el-input__wrapper) {
    &:hover,
    &.is-focus {
      box-shadow: 0 0 0 1px var(--primary-color, #14cbf0) inset;
    }
  }

  :deep(.el-input__inner) {
    font-family: var(--font-family);
  }
}
</style>

<!-- teleported 面板：非 scoped，主题变量取 :root -->
<style lang="scss">
.ui-date-picker-popper {
  font-family: var(--font-family);
}

.ui-date-picker-popper--dashboard.el-picker__popper,
.ui-date-picker-popper--dashboard {
  background: var(--card-bg-color, rgba(0, 52, 98, 0.96)) !important;
  border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.35)) !important;

  .el-picker-panel,
  .el-date-picker,
  .el-picker-panel__body,
  .el-date-table,
  .el-date-picker__header-label,
  .el-picker-panel__icon-btn {
    color: var(--text-color, #e5eaf0);
    background: transparent;
  }

  .el-date-table th {
    color: var(--text-secondary, rgba(255, 255, 255, 0.6));
    border-bottom-color: var(--card-border-color, rgba(20, 203, 240, 0.2));
  }

  .el-date-table td .el-date-table-cell__text {
    color: var(--text-color, #e5eaf0);
  }

  .el-date-table td.available:hover .el-date-table-cell__text {
    background: color-mix(in srgb, var(--primary-color, #14cbf0) 20%, transparent);
  }

  .el-date-table td.current:not(.disabled) .el-date-table-cell__text {
    background: var(--primary-color, #14cbf0);
    color: #041018;
  }

  .el-date-table td.today .el-date-table-cell__text {
    color: var(--primary-color, #14cbf0);
    font-weight: 600;
  }

  .el-popper__arrow::before {
    background: var(--card-bg-color, rgba(0, 52, 98, 0.96)) !important;
    border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.35)) !important;
  }
}
</style>
