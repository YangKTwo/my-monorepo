// import { computed, ref, type Ref } from 'vue'
// import { useRequest } from '../core/useRequest'
// import { userApi, type UserInfo, type LoginParams } from '@my-repo/api-user'

// // ========== 类型定义 ==========

// export interface UseUserReturn {
//   /** 用户信息 */
//   userInfo: Ref<UserInfo | null>
//   /** 是否已登录 */
//   isLoggedIn: Ref<boolean>
//   /** 加载状态 */
//   loading: {
//     user: Ref<boolean>
//     login: Ref<boolean>
//   }
//   /** 错误信息 */
//   errors: {
//     user: Ref<Error | null>
//     login: Ref<Error | null>
//   }
//   /** 登录 */
//   login: (params: LoginParams) => Promise<UserInfo>
//   /** 登出 */
//   logout: () => Promise<void>
//   /** 获取当前用户信息 */
//   fetchUserInfo: () => Promise<UserInfo>
// }

// // ========== Token 管理 ==========

// const TOKEN_KEY = 'access_token'

// const getToken = (): string | null => {
//   return localStorage.getItem(TOKEN_KEY)
// }

// const setToken = (token: string): void => {
//   localStorage.setItem(TOKEN_KEY, token)
// }

// const removeToken = (): void => {
//   localStorage.removeItem(TOKEN_KEY)
// }

// /**
//  * 用户 Hook
//  * 封装用户相关的数据逻辑
//  */
// export function useUser(): UseUserReturn {
//   const userInfo = ref<UserInfo | null>(null)

//   // ========== 获取用户信息 ==========
//   const {
//     loading: userLoading,
//     error: userError,
//     run: fetchUserInfo
//   } = useRequest<UserInfo>(() => userApi.getCurrentUser(), {
//     immediate: false,
//     onSuccess: (data) => {
//       userInfo.value = data
//     }
//   })

//   // ========== 登录 ==========
//   const {
//     loading: loginLoading,
//     error: loginError,
//     run: loginRequest
//   } = useRequest<UserInfo>(
//     (params: LoginParams) =>
//       userApi.login(params).then((res) => {
//         setToken(res.token)
//         return res.userInfo
//       }),
//     {
//       onSuccess: (data) => {
//         userInfo.value = data
//       }
//     }
//   )

//   // ========== 登录方法 ==========
//   const login = async (params: LoginParams): Promise<UserInfo> => {
//     return loginRequest(params)
//   }

//   // ========== 登出方法 ==========
//   const logout = async (): Promise<void> => {
//     try {
//       await userApi.logout()
//     } catch {
//       // 即使接口失败也清除本地状态
//     } finally {
//       userInfo.value = null
//       removeToken()
//     }
//   }

//   // ========== 是否已登录 ==========
//   const isLoggedIn = computed(() => {
//     return !!getToken() && !!userInfo.value
//   })

//   // ========== 自动获取用户信息 ==========
//   // 如果已有 token 且没有用户信息，自动获取
//   if (getToken() && !userInfo.value) {
//     fetchUserInfo()
//   }

//   return {
//     userInfo,
//     isLoggedIn,
//     loading: {
//       user: userLoading,
//       login: loginLoading
//     },
//     errors: {
//       user: userError,
//       login: loginError
//     },
//     login,
//     logout,
//     fetchUserInfo
//   }
// }
