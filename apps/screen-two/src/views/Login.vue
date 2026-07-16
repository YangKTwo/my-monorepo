<template>
  <div class="login-page">
    <LoginForm variant="dashboard" title="系统登录" @success="onSuccess" @error="onError" />
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { LoginForm } from '@my-repo/business'
import type { UserInfo } from '@my-repo/apis'
import { UiMessage } from '@my-repo/ui'

const router = useRouter()
const route = useRoute()

const onSuccess = (_userInfo: UserInfo) => {
  UiMessage.success('登录成功')
  const redirect = (route.query.redirect as string) || '/'
  router.replace(redirect)
}

const onError = (err: Error) => {
  UiMessage.error(err.message || '登录失败')
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #0a1628;
}
</style>
