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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;

  // 普通卡片用另一套变量，避免和大屏抢同一套色
  background: var(--card-bg-color-default, #fff);
  border: 1px solid var(--card-border-color-default, #e5e7eb);
  border-radius: var(--card-border-radius, 4px);

  &.dashboard {
    background: var(--card-bg-color, rgba(0, 52, 98, 0.6));
    border: 1px solid var(--card-border-color, rgba(20, 203, 240, 0.2));
    border-radius: var(--card-border-radius, 4px);
    box-shadow: var(--card-inset-shadow, inset 0 0 10px 0 rgba(20, 203, 240, 0.4));
    // 不要 backdrop-filter，原型没有

    .ui-card__header {
      border-bottom-color: var(--card-header-border, rgba(20, 203, 240, 0.15));
      background: transparent;
    }

    .ui-card__title,
    .ui-card__body {
      color: var(--text-color, #e5eaf0);
    }

    .ui-card__footer {
      border-top-color: var(--card-header-border, rgba(20, 203, 240, 0.15));
      background: transparent; // 避免底部一块实色
    }
  }

  &.no-padding .ui-card__body {
    padding: 0;
  }
  &__header {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--card-header-border, #f0f2f5);
  }
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color, #303133);
  }
  &__extra {
    font-size: 13px;
    color: var(--text-secondary, #909399);
  }
  &__body {
    flex: 1;
    min-height: 0;
    padding: 20px;
    color: var(--text-color, #303133);
    display: flex;
    flex-direction: column;
  }
  &__footer {
    flex-shrink: 0;
    padding: 12px 20px;
    border-top: 1px solid var(--card-header-border, #f0f2f5);
  }
}
</style>
