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
  align-items: stretch; /* 侧栏与内容同高，底边对齐第二行卡片 */
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 26px 0 clamp(12px, 1.2vw, 16px) 16px;
  box-sizing: border-box;
  gap: clamp(12px, 1.2vw, 16px);
  overflow: hidden;
}

.index-layout__side {
  flex-shrink: 0;
  height: 100%;
  max-height: 100%;
}

.index-layout__content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
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
