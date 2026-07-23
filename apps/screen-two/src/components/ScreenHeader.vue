<script setup lang="ts">
import { ScreenPrimaryNav, ScreenToolbar } from '@my-repo/business'
import { primaryNavItems } from '../constants/primaryNav'
import { toolbarItems } from '../constants/toolbar'

const emit = defineEmits<{
  tool: [key: string]
}>()

function onToolClick(key: string) {
  emit('tool', key)
}
</script>

<template>
  <header class="screen-header">
    <ScreenPrimaryNav :items="primaryNavItems" />
    <img class="screen-header__logo" src="../assets/logo_blue.png" alt="" />
    <ScreenToolbar
      :tools="toolbarItems"
      tip="Tips：按下F11可全屏，再次按下F11取消全屏"
      @click="onToolClick"
    />
  </header>
</template>

<style scoped lang="scss">
.screen-header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: var(--screen-header-height, 70px);
  padding: 0 var(--screen-header-padding-x, 20px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  z-index: 10;
  overflow: visible;
}
/* 中间 logo */
.screen-header__logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: clamp(480px, 46.875vw, 900px); /* 1920 下约 900px */
  height: clamp(36px, 3.125vw, 60px);
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  z-index: 1;
}
</style>
