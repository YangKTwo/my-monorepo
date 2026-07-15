import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { userApi, type UserInfo, type LoginParams } from '@my-repo/apis'
import { tokenStorage } from '@my-repo/hooks'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)
  const loginLoading = ref(false)
  const authLoading = ref(false)

  const isLoggedIn = computed(() => !!tokenStorage.get() && userInfo.value?.loginStatus === true)

  async function login(params: LoginParams): Promise<UserInfo> {
    loginLoading.value = true
    try {
      const resp = await userApi.login(params)
      tokenStorage.set(resp.token)
      const info = await userApi.getAuthInfo()
      userInfo.value = info
      if (info.token) tokenStorage.set(info.token)
      return info
    } finally {
      loginLoading.value = false
    }
  }

  async function fetchUserInfo(): Promise<UserInfo> {
    authLoading.value = true
    try {
      const info = await userApi.getAuthInfo()
      userInfo.value = info
      if (info.token) tokenStorage.set(info.token)
      return info
    } catch (e) {
      userInfo.value = null
      tokenStorage.clear()
      throw e
    } finally {
      authLoading.value = false
    }
  }

  function logout() {
    userInfo.value = null
    tokenStorage.clear()
  }

  return {
    userInfo,
    isLoggedIn,
    loginLoading,
    authLoading,
    login,
    fetchUserInfo,
    logout
  }
})
