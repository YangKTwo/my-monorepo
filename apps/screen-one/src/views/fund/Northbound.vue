<template>
  <div class="northbound">
    <UiCard variant="dashboard" class="panel panel--banner" no-padding>
      <div class="panel__body">北向 · 顶栏摘要（占位）</div>
    </UiCard>

    <UiCard variant="dashboard" class="panel panel--block" no-padding>
      <div class="panel__body">北向 · 主图（占位）</div>
    </UiCard>

    <div class="northbound__row">
      <UiCard variant="dashboard" class="panel panel--block" no-padding>
        <div class="panel__body">北向 · 左卡（占位）</div>
      </UiCard>
      <UiCard variant="dashboard" class="panel panel--block" no-padding>
        <div class="panel__body">北向 · 右卡（占位）</div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UiCard } from '@my-repo/ui'
</script>

<style scoped lang="scss">
.northbound {
  display: flex;
  flex-direction: column;
  gap: var(--card-gap, 12px);
  height: 100%;
  min-height: 0;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden; /* 不溢出，参考 screen-two 内容区 */
}

.northbound__row {
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
  display: flex;
  gap: var(--card-gap, 12px);
}

.panel {
  min-width: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: var(--card-border-radius, 4px);
  background: var(--card-bg-color);
  border: 1px solid var(--card-border-color);
  box-shadow: var(--card-inset-shadow, none);
}

/* 比例约 34 : 375 : 375（原 85%），用 flex 自适应主区高度 */
.panel--banner {
  flex: 0 0 auto;
  height: clamp(24px, 4.3%, 34px);
}

.panel--block {
  flex: 1 1 0;
  min-height: 0;
  height: auto; /* 关键：别再写死 375px */
}

.northbound__row .panel--block {
  flex: 1 1 0;
  height: 100%;
}

.panel__body {
  height: 100%;
  min-height: 0;
  padding: var(--card-padding, 10px);
  box-sizing: border-box;
  overflow: hidden;
  color: var(--text-secondary);
  font-size: 13px;
}
</style>
