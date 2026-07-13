<template>
  <div class="ui-card" :class="[variant, { 'no-padding': noPadding }]">
    <!-- 头部 -->
    <div v-if="$slots.header || title" class="ui-card__header">
      <div class="ui-card__header-left">
        <slot name="header">
          <span class="ui-card__title">{{ title }}</span>
        </slot>
      </div>
      <div v-if="$slots.extra || extra" class="ui-card__header-right">
        <slot name="extra">
          <span class="ui-card__extra">{{ extra }}</span>
        </slot>
      </div>
    </div>

    <!-- 主体 -->
    <div class="ui-card__body">
      <slot />
    </div>

    <!-- 底部 -->
    <div v-if="$slots.footer" class="ui-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  extra?: string
  variant?: 'default' | 'shadow' | 'border' | 'glass' | 'dashboard'
  noPadding?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  noPadding: false
})
</script>

<style scoped lang="scss">
.ui-card {
  // ===== 核心：让 Card 能够撑满父容器 =====
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  // ===== 样式变量 =====
  background: var(--card-bg-color, rgba(0, 52, 98, 0.6));
  border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.2));
  border-radius: var(--card-border-radius, 4px);
  overflow: hidden;
  transition: box-shadow 0.3s ease;

  // ===== 变体 =====
  &.shadow {
    box-shadow: var(--ui-box-shadow, 0 2px 12px rgba(0, 0, 0, 0.08));
  }

  &.border {
    border: 1px solid var(--ui-border-color, #e8ecf1);
  }

  &.glass {
    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  &.no-padding .ui-card__body {
    padding: 0;
  }

  // ===== 头部 =====
  &__header {
    flex-shrink: 0; // 头部不压缩
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--ui-border-light, #f0f2f5);

    &-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--ui-text-color, #303133);
  }

  &__extra {
    font-size: 13px;
    color: var(--ui-text-secondary, #909399);
  }

  // ===== 主体（自动撑满剩余空间） =====
  &__body {
    flex: 1; // ← 关键：撑满剩余高度
    padding: 20px;
    color: var(--ui-text-color, #303133);
    display: flex;
    flex-direction: column;
  }

  // ===== 底部 =====
  &__footer {
    flex-shrink: 0; // 底部不压缩
    padding: 12px 20px;
    border-top: 1px solid var(--ui-border-light, #f0f2f5);
    background: var(--ui-background-page, #fafafa);
  }
}
</style>
