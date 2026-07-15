<template>
  <el-button
    class="ui-button"
    :type="epType"
    :plain="plain"
    :round="round"
    :disabled="disabled"
    :loading="loading"
    :size="size"
    @click="handleClick"
  >
    <slot />
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  plain?: boolean
  round?: boolean
  disabled?: boolean
  loading?: boolean
  size?: 'large' | 'default' | 'small'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  plain: false,
  round: false,
  disabled: false,
  loading: false,
  size: 'default'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

/** text 映射为 EP 的 text 按钮 */
const epType = computed(() => (props.type === 'text' ? 'primary' : props.type))

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.ui-button {
  /* 主题色可后续用 CSS 变量覆盖 */
}
</style>
