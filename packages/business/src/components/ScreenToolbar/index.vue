<template>
  <div class="screen-toolbar-wrap">
    <div class="screen-toolbar">
      <button
        v-for="tool in tools"
        :key="tool.key"
        type="button"
        class="screen-toolbar__btn"
        :aria-label="tool.label || tool.key"
        @click="emit('click', tool.key)"
      >
        <img :src="tool.icon" alt="" />
      </button>
    </div>

    <p v-if="tip" class="screen-toolbar__tip">
      {{ tip }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { ScreenToolItem } from './types'

defineProps<{
  tools: ScreenToolItem[]
  tip?: string
}>()

const emit = defineEmits<{
  click: [key: string]
}>()
</script>

<style scoped lang="scss">
.screen-toolbar-wrap {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--screen-header-height, 70px);
  z-index: 2;
  flex-shrink: 0;
  overflow: visible;
}

.screen-toolbar {
  display: flex;
  align-items: center;
  gap: var(--toolbar-gap, 20px);
}

.screen-toolbar__btn {
  position: static;
  box-sizing: border-box;
  width: var(--toolbar-btn-size, 30px);
  height: var(--toolbar-btn-size, 30px);
  margin: 0;
  padding: 0;
  border: none;
  border-radius: var(--toolbar-btn-radius, 2px);
  background: transparent;
  cursor: pointer;
  opacity: 1;
  z-index: 0;
  flex-shrink: 0;
  transition:
    opacity 0.2s,
    background-color 0.2s;

  &:hover {
    opacity: 0.85;
  }

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
    pointer-events: none;
    border-radius: inherit;
  }
}

.screen-toolbar__tip {
  position: absolute;
  top: calc(50% + var(--toolbar-btn-size, 24px) / 2 + var(--toolbar-tip-offset, 12px));
  right: 0;
  margin: 0;
  width: max-content;
  height: auto;
  opacity: 1;
  font-family: var(--font-family);
  font-size: var(--toolbar-tip-font-size, 14px);
  font-weight: normal;
  line-height: var(--toolbar-tip-line-height, 20px);
  letter-spacing: 0;
  color: var(--toolbar-tip-color, var(--primary-color, #14cbf0));
  text-shadow: var(--toolbar-tip-shadow, 0 0 4px rgba(20, 203, 240, 0.8));
  white-space: nowrap;
  overflow: visible;
  user-select: none;
  pointer-events: none;
  z-index: 3;
}
</style>
