<script setup lang="ts">
import logoImg from '@my-repo/ui/src/assets/src/images/logo_brown.png'
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
    <img class="screen-header__logo" :src="logoImg" alt="" />
    <!-- 分析系统不展示 tip -->
    <ScreenToolbar :tools="toolbarItems" @click="onToolClick" />
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

.screen-header__logo {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 900px;
  height: 60px;
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  z-index: 1;
}
</style>
