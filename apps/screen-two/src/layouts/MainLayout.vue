<template>
  <div class="main-layout">
    <ScreenHeader />
    <main class="main-layout__content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import ScreenHeader from '../components/ScreenHeader.vue'
</script>

<style scoped lang="scss">
.main-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-layout__content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
