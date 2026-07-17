<template>
  <div class="index-layout">
    <ScreenSideNav :items="indexSideNavItems" class="index-layout__side">
      <template #badge>
        <button type="button" class="index-side-toggle" aria-label="侧栏">
          <img src="@my-repo/ui/src/assets/src/icons/submenu_button_default.svg" alt="" />
        </button>
      </template>
    </ScreenSideNav>

    <div class="index-layout__content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScreenSideNav } from '@my-repo/business'
import { indexSideNavItems } from '../../constants/indexSideNav'
</script>

<style scoped lang="scss">
.index-layout {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 26px 0 0 16px;
  box-sizing: border-box;
  gap: 16px;
  overflow: hidden;
}

.index-layout__side {
  flex-shrink: 0;
}

.index-layout__content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  align-self: stretch;
}

.index-side-toggle {
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
