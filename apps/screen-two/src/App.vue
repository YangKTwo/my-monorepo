<template>
  <div class="app-layout" :style="bgStyle">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import bgImage from '@my-repo/ui/src/assets/src/images/bg_brown.png'
import { onMounted } from 'vue'
import { tokenStorage } from '@my-repo/hooks'
import { useUserStore } from '@my-repo/stores'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  if (!tokenStorage.get()) return
  try {
    await userStore.fetchUserInfo()
  } catch {
    router.replace({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
  }
})

const bgStyle = {
  backgroundImage: `url(${bgImage})`,
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
