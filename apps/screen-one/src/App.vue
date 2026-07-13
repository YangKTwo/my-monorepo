<template>
  <div class="app-layout" :style="bgStyle">
    <router-view />
  </div>
</template>

<script setup lang="ts">
const bgStyle = {
  // backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#0a1628'
}
</script>

<style scoped lang="scss">
.app-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
