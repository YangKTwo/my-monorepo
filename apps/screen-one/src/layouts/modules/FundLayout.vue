<template>
  <div class="fund-layout">
    <div class="fund-layout__main">
      <ScreenSideNav :items="fundSideNavItems" class="fund-layout__side">
        <template #badge>
          <button type="button" class="fund-side-toggle" aria-label="侧栏">
            <img src="@my-repo/ui/src/assets/src/icons/submenu_button_default.svg" alt="" />
          </button>
        </template>
      </ScreenSideNav>

      <div class="fund-layout__content">
        <router-view />
      </div>
    </div>

    <!-- 通栏底：整屏宽，侧栏下方不重叠 -->
    <div class="fund-layout__footer">
      <UiCard variant="dashboard" class="fund-footer-card" no-padding>
        <div class="fund-footer-card__body">底栏占位</div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScreenSideNav } from '@my-repo/business'
import { UiCard } from '@my-repo/ui'
import { fundSideNavItems } from '../../constants/fundSideNav'
</script>

<style scoped lang="scss">
.fund-layout {
  display: flex;
  flex-direction: column;
  gap: 12px; /* 主区（侧栏+卡片）与通栏底拉开间距 */
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

/* 上移：减小顶 padding；主区吃满剩余高度 */
.fund-layout__main {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  align-items: stretch; /* 侧栏与内容同高 */
  gap: 12px;
  padding: 12px 16px 0;
  box-sizing: border-box;
}

.fund-layout__side {
  flex-shrink: 0;
  height: 100%;
  max-height: 100%;

  /* 覆盖组件内写死的 --side-nav-height，改为跟主区对齐 */
  :deep(.screen-side-nav) {
    height: 100%;
    max-height: 100%;
  }
}

.fund-layout__content {
  flex: 1;
  min-width: 0; /* 防止撑破，同 screen-two */
  min-height: 0;
  overflow: hidden;
}

.fund-layout__footer {
  flex: 0 0 auto;
  width: 100%;
  /* 原设计约 26，再略加高便于阅读；左右不留白以贴满背景 */
  height: 25px;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.fund-footer-card {
  width: 100%;
  height: 100%;
  margin: 0;
  border-radius: 0 !important;
  border-left: none !important;
  border-right: none !important;
  background: var(--card-bg-color);
  border-color: var(--card-border-color);
  box-shadow: var(--card-inset-shadow, none);
}

.fund-footer-card__body {
  height: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--text-secondary);
  box-sizing: border-box;
}

.fund-side-toggle {
  width: 18px;
  height: 18px;
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
