<template>
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
</template>

<script lang="ts" setup>
import { ScreenToolItem } from './types'

defineProps<{
  tools: ScreenToolItem[]
}>()

const emit = defineEmits<{
  click: [key: string]
}>()
</script>

<style scoped lang="scss">
.screen-toolbar {
  display: flex;
  align-items: center;
  gap: var(--toolbar-gap, 20px);
  height: var(--screen-header-height, 70px);
  z-index: 2;
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
</style>
