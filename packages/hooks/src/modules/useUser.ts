import { computed, ref, type Ref } from 'vue'
import { useRequest } from '../core/useRequest'
import { userApi, type UserInfo, type LoginParams } from '@my-repo/apis'
import { tokenStorage } from '../core/token'

export interface UseUserReturn {
  userInfo: Ref<UserInfo | null>
  isLoggedIn: Ref<boolean>
  loading: {
    login: Ref<boolean>
    auth: Ref<boolean>
  }
  /** 登录 */
  login: (params: LoginParams) => Promise<UserInfo>
  /**拉取鉴权信息 */
  fetchUserInfo: () => Promise<UserInfo>
  logout: () => void
}

export function useUser(): UseUserReturn {
  const userInfo = ref<UserInfo | null>(null)

  const { loading: loginLoading, run: doLogin } = useRequest(
    async (params: LoginParams) => {
      const resp = await userApi.login(params)
      tokenStorage.set(resp.token)
      return userApi.getAuthInfo()
    },
    {
      onSuccess: (data: UserInfo) => {
        userInfo.value = data
        if (data.token) tokenStorage.set(data.token)
      }
    }
  )

  const { loading: authLoading, run: fetchAuthInfo } = useRequest(() => userApi.getAuthInfo(), {
    immediate: !!tokenStorage.get(),
    onSuccess: (data: UserInfo) => {
      userInfo.value = data
      if (data.token) tokenStorage.set(data.token)
    },
    onError: () => {
      userInfo.value = null
      tokenStorage.clear()
    }
  })

  const login = (params: LoginParams) => doLogin(params) as Promise<UserInfo>

  const logout = () => {
    userInfo.value = null
    tokenStorage.clear()
  }

  const isLoggedIn = computed(() => {
    return !!tokenStorage.get() && userInfo.value?.loginStatus === true
  })

  return {
    userInfo,
    isLoggedIn,
    loading: { login: loginLoading, auth: authLoading },
    login,
    fetchUserInfo: fetchAuthInfo,
    logout
  }
}
