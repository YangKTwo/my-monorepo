<template>
  <aside class="screen-side-nav">
    <UiCard variant="dashboard" class="screen-side-nav__card" no-padding>
      <div v-if="$slots.badge" class="screen-side-nav__badge is-active">
        <slot name="badge" />
      </div>

      <nav class="screen-side-nav__list">
        <router-link
          v-for="item in items"
          :key="item.path"
          v-slot="{ navigate, isActive, isExactActive }"
          :to="item.path"
          custom
        >
          <button
            type="button"
            class="screen-side-nav__item"
            :class="{ 'is-active': isItemActive(item, isActive, isExactActive) }"
            @click="navigate"
          >
            <span class="screen-side-nav__label">
              <i v-for="(ch, idx) in item.label" :key="idx" class="screen-side-nav__char">{{
                ch
              }}</i>
            </span>
          </button>
        </router-link>
      </nav>
    </UiCard>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { UiCard } from '@my-repo/ui'
import type { ScreenSideNavItem } from './types'

defineProps<{
  items: ScreenSideNavItem[]
}>()

const route = useRoute()

function isItemActive(item: ScreenSideNavItem, isActive: boolean, isExactActive: boolean) {
  if (item.match) {
    return typeof item.match === 'string'
      ? route.path.startsWith(item.match)
      : item.match.test(route.path)
  }
  return isActive || isExactActive
}
</script>

<style scoped lang="scss">
.screen-side-nav {
  flex-shrink: 0;
  height: 100%;
  max-height: var(--side-nav-height, 100%);
}

.screen-side-nav__card {
  width: fit-content;
  min-width: var(--side-nav-item-min-width, 32px);
  height: 100%;

  :deep(.ui-card__body) {
    padding: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--side-nav-gap, 6px);
    min-height: 0;
  }
}

.screen-side-nav__badge {
  width: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;

  &.is-active :deep(button) {
    box-sizing: border-box;
    width: 100%;
    min-width: var(--side-nav-item-min-width, 32px);
    height: var(--side-nav-badge-size, 32px);
    padding: 0;
    border-radius: var(--side-nav-item-radius, 4px);
    border: 1px solid var(--side-nav-item-active-border);
    background: var(--side-nav-item-active-bg);
    box-shadow: var(--side-nav-item-active-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      width: var(--side-nav-icon-size, 22px);
      height: var(--side-nav-icon-size, 22px);
      display: block;
    }
  }
}

.screen-side-nav__list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--side-nav-gap, 6px);
  width: 100%;
  /* 文字按内容紧凑排布，不随侧栏高度均分拉开；侧栏卡片仍由外层 height:100% 对齐底边 */
  flex: 0 1 auto;
  min-height: 0;
  overflow-y: auto;
}

.screen-side-nav__item {
  box-sizing: border-box;
  width: fit-content;
  height: fit-content;
  flex: 0 0 auto;
  min-width: var(--side-nav-item-min-width, 32px);
  margin: 0;
  padding: var(--side-nav-item-padding, 8px);
  border: 1px solid transparent;
  border-radius: var(--side-nav-item-radius, 4px);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &.is-active {
    border-color: var(--side-nav-item-active-border);
    background: var(--side-nav-item-active-bg);
    box-shadow: var(--side-nav-item-active-shadow);
  }
}

.screen-side-nav__label {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: var(--side-nav-char-gap, 4px);
}

.screen-side-nav__char {
  font-style: normal;
  font-family: var(--font-family);
  font-size: var(--side-nav-char-size, 16px);
  font-weight: bold;
  line-height: 1;
  background: var(--side-nav-label-gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.screen-side-nav__item.is-active .screen-side-nav__char {
  background: var(--side-nav-label-gradient-active);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: var(--side-nav-label-glow);
}
</style>
