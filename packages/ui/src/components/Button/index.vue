<template>
  <button
    class="ui-button"
    :class="[
      `ui-button--${type}`,
      {
        'is-plain': plain,
        'is-round': round,
        'is-disabled': disabled,
        'is-loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="ui-button__loading">
      <svg viewBox="0 0 24 24" width="16" height="16">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-dasharray="31.4 31.4"
        />
      </svg>
    </span>
    <span class="ui-button__text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  plain?: boolean
  round?: boolean
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  plain: false,
  round: false,
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.25s ease;
  user-select: none;
  white-space: nowrap;
}

.ui-button:active {
  transform: scale(0.96);
}

.ui-button--primary {
  background: #4a9eff;
  color: #fff;
}

.ui-button--primary:hover:not(.is-disabled):not(.is-loading) {
  background: #3a8beb;
}

.ui-button--success {
  background: #67c23a;
  color: #fff;
}

.ui-button--success:hover:not(.is-disabled):not(.is-loading) {
  background: #5daf34;
}

.ui-button--warning {
  background: #e6a23c;
  color: #fff;
}

.ui-button--warning:hover:not(.is-disabled):not(.is-loading) {
  background: #cf9236;
}

.ui-button--danger {
  background: #f56c6c;
  color: #fff;
}

.ui-button--danger:hover:not(.is-disabled):not(.is-loading) {
  background: #dc5e5e;
}

.ui-button--info {
  background: #909399;
  color: #fff;
}

.ui-button--info:hover:not(.is-disabled):not(.is-loading) {
  background: #82848a;
}

.ui-button--text {
  background: transparent;
  color: #4a9eff;
  border-color: transparent;
}

.ui-button--text:hover:not(.is-disabled):not(.is-loading) {
  background: rgba(74, 158, 255, 0.1);
}

.ui-button.is-plain {
  background: transparent;
}

.ui-button.is-plain.ui-button--primary {
  color: #4a9eff;
  border-color: #4a9eff;
}

.ui-button.is-plain.ui-button--primary:hover:not(.is-disabled):not(.is-loading) {
  background: #4a9eff;
  color: #fff;
}

.ui-button.is-plain.ui-button--danger {
  color: #f56c6c;
  border-color: #f56c6c;
}

.ui-button.is-plain.ui-button--danger:hover:not(.is-disabled):not(.is-loading) {
  background: #f56c6c;
  color: #fff;
}

.ui-button.is-plain.ui-button--success {
  color: #67c23a;
  border-color: #67c23a;
}

.ui-button.is-plain.ui-button--success:hover:not(.is-disabled):not(.is-loading) {
  background: #67c23a;
  color: #fff;
}

.ui-button.is-plain.ui-button--warning {
  color: #e6a23c;
  border-color: #e6a23c;
}

.ui-button.is-plain.ui-button--warning:hover:not(.is-disabled):not(.is-loading) {
  background: #e6a23c;
  color: #fff;
}

.ui-button.is-round {
  border-radius: 20px;
}

.ui-button.is-disabled,
.ui-button.is-loading {
  opacity: 0.6;
  cursor: not-allowed;
}

.ui-button__loading svg {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ui-button__loading svg circle {
  stroke-dasharray: 31.4 31.4;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes dash {
  0% {
    stroke-dashoffset: 31.4;
  }
  50% {
    stroke-dashoffset: 15.7;
  }
  100% {
    stroke-dashoffset: 31.4;
  }
}
</style>
