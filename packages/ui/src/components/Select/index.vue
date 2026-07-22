<template>
  <el-select
    class="ui-select"
    :class="[`ui-select--${variant}`]"
    :style="width ? { width } : undefined"
    :model-value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :size="size"
    :teleported="teleported"
    :popper-class="popperClass"
    @update:model-value="onUpdate"
  >
    <el-option
      v-for="opt in options"
      :key="String(opt.value)"
      :label="opt.label"
      :value="opt.value"
      :disabled="opt.disabled"
    />
    <slot />
  </el-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UiSelectProps } from './types'

const props = withDefaults(defineProps<UiSelectProps>(), {
  modelValue: undefined,
  options: () => [],
  placeholder: '请选择',
  disabled: false,
  clearable: false,
  filterable: false,
  size: 'small',
  variant: 'default',
  teleported: true,
  width: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | null]
}>()

const popperClass = computed(() =>
  props.variant === 'dashboard'
    ? 'ui-select-popper ui-select-popper--dashboard'
    : 'ui-select-popper'
)

function onUpdate(v: string | number | boolean | null) {
  emit('update:modelValue', v)
}
</script>

<style scoped lang="scss">
.ui-select {
  min-width: 120px;
  font-family: var(--font-family);
}

.ui-select--dashboard {
  :deep(.el-select__wrapper) {
    min-height: 28px;
    padding: 0 10px;
    border-radius: var(--card-border-radius, 4px);
    background: var(--card-bg-color, rgba(0, 52, 98, 0.6));
    box-shadow: none;
    border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.2));

    &:hover {
      border-color: var(--primary-color, #14cbf0);
    }

    &.is-focused {
      border-color: var(--primary-color, #14cbf0);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--primary-color, #14cbf0) 45%, transparent) inset;
    }
  }

  :deep(.el-select__selected-item),
  :deep(.el-select__caret) {
    color: var(--text-color, #e5eaf0);
    font-family: var(--font-family);
    font-size: 12px;
  }

  :deep(.el-select__placeholder) {
    color: var(--text-secondary, rgba(255, 255, 255, 0.6));
    font-family: var(--font-family);
    font-size: 12px;
  }
}

.ui-select--default {
  :deep(.el-select__wrapper) {
    &:hover,
    &.is-focused {
      box-shadow: 0 0 0 1px var(--primary-color, #14cbf0) inset;
    }
  }

  :deep(.el-select__selected-item),
  :deep(.el-select__caret),
  :deep(.el-select__placeholder) {
    font-family: var(--font-family);
  }
}
</style>

<!-- teleported 下拉层：非 scoped，变量仍取 :root 主题 -->
<style lang="scss">
.ui-select-popper {
  font-family: var(--font-family);
}

.ui-select-popper--dashboard.el-select__popper,
.ui-select-popper--dashboard {
  background: var(--card-bg-color, rgba(0, 52, 98, 0.95)) !important;
  border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.35)) !important;

  .el-select-dropdown__item {
    color: var(--text-color, #e5eaf0);
    font-family: var(--font-family);
    font-size: 12px;

    &.is-hovering,
    &:hover {
      background: color-mix(in srgb, var(--primary-color, #14cbf0) 16%, transparent);
      color: var(--text-color, #e5eaf0);
    }

    &.is-selected {
      color: var(--primary-color, #14cbf0);
      font-weight: 600;
    }
  }

  .el-popper__arrow::before {
    background: var(--card-bg-color, rgba(0, 52, 98, 0.95)) !important;
    border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.35)) !important;
  }
}
</style>
