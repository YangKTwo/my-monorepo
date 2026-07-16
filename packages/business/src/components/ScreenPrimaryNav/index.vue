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
        @click="navigate"
      >
        <img
          class="screen-primary-nav__icon"
          :src="
            isItemActive(item, isActive, isExactActive) ? item.activeIcon || item.icon : item.icon
          "
          alt=""
        />
      </button>
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { ScreenNavItem } from './types'

defineProps<{
  items: ScreenNavItem[]
}>()

const route = useRoute()

function isItemActive(item: ScreenNavItem, isAction: boolean, isExactAction: boolean) {
  if (item.match) {
    return typeof item.match === 'string'
      ? route.path.startsWith(item.match)
      : item.match.test(route.path)
  }
  return isAction || isExactAction
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
  position: static;
  box-sizing: border-box;
  width: var(--nav-item-width, 72px);
  height: var(--nav-item-height, 40px);
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  opacity: var(--nav-item-opacity, 0.4);
  color: var(--text-secondary, rgba(255, 255, 255, 0.6));
  transition:
    opacity 0.2s,
    color 0.2s;
  flex-shrink: 0;
  &:hover {
    opacity: 0.75;
    color: var(--text-color, #e5eaf0);
  }
  &.is-active {
    opacity: 1;
    color: var(--nav-active-color, var(--primary-color, #14cbf0));
    .screen-primary-nav__icon {
      filter: drop-shadow(0 0 6px var(--nav-active-glow, rgba(20, 203, 240, 0.8)));
    }
    .screen-primary-nav__label {
      font-weight: 600;
    }
  }
}
.screen-primary-nav__icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
.screen-primary-nav__label {
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
}
</style>
