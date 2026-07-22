<template>
  <nav class="screen-primary-nav">
    <router-link
      v-for="item in items"
      :key="item.path"
      v-slot="{ navigate, isActive, isExactActive }"
      :to="item.path"
      custom
    >
      <button
        type="button"
        class="screen-primary-nav__item"
        :class="{ 'is-active': isItemActive(item, isActive, isExactActive) }"
        :aria-label="item.label"
        :title="item.label"
        @mouseenter="hoveredPath = item.path"
        @mouseleave="hoveredPath = null"
        @click="navigate"
      >
        <img
          class="screen-primary-nav__icon"
          :src="resolveIcon(item, isActive, isExactActive)"
          alt=""
        />
      </button>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import type { ScreenNavItem } from './types'

defineProps<{
  items: ScreenNavItem[]
}>()

const route = useRoute()
const hoveredPath = ref<string | null>(null)

function isItemActive(item: ScreenNavItem, isAction: boolean, isExactAction: boolean) {
  if (item.match) {
    return typeof item.match === 'string'
      ? route.path.startsWith(item.match)
      : item.match.test(route.path)
  }
  return isAction || isExactAction
}

function resolveIcon(item: ScreenNavItem, isAction: boolean, isExactAction: boolean) {
  const active = isItemActive(item, isAction, isExactAction)
  if (active) return item.activeIcon || item.icon
  if (hoveredPath.value === item.path) return item.hoverIcon || item.icon
  return item.icon
}
</script>

<style scoped lang="scss">
.screen-primary-nav {
  display: flex;
  align-items: center;
  gap: var(--nav-item-gap, 20px);
  height: var(--nav-item-height, 40px);
  z-index: 2;
}

.screen-primary-nav__item {
  box-sizing: border-box;
  width: var(--nav-item-width, 72px);
  height: var(--nav-item-height, 40px);
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.screen-primary-nav__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
</style>
