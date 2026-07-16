<script setup lang="ts">
import { ScreenPrimaryNav, ScreenToolbar } from '@my-repo/business'
import { primaryNavItems } from '../constants/primaryNav'
import { toolbarItems } from '../constants/toolbar'

function onToolClick(key: string) {
  console.log(key)
}
</script>

<template>
  <header class="screen-header">
    <ScreenPrimaryNav :items="primaryNavItems" />
    <img class="screen-header__logo" src="../assets/logo_blue.png" alt="" />
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
}
/* 中间 logo：不占 flex 空间、不挡点击 */
.screen-header__logo {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 1060px;
  height: var(--screen-header-height, 70px);
  object-fit: contain;
  pointer-events: none;
  user-select: none;
  z-index: 1;
}
</style>
