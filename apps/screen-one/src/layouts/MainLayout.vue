<template>
  <div class="main-layout">
    <ScreenHeader @tool="onTool" />
    <main class="main-layout__content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import ScreenHeader from '../components/ScreenHeader.vue'
import { registerScreenRefreshKey, type ScreenRefreshFn } from '../composables/screenRefresh'

const refreshHandler = ref<ScreenRefreshFn | null>(null)

provide(registerScreenRefreshKey, (fn) => {
  refreshHandler.value = fn
})

function onTool(key: string) {
  if (key === 'refresh') {
    void refreshHandler.value?.()
  }
}
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
