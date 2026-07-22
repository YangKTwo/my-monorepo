import type { InjectionKey } from 'vue'

/** 页面注册的刷新函数（顶栏 refresh 会调用） */
export type ScreenRefreshFn = () => void | Promise<void>

/**
 * MainLayout provide，页面 inject 后注册自身 fetchAll。
 * 用 Symbol + InjectionKey，避免字符串 key 冲突、也有类型提示。
 */
export const registerScreenRefreshKey: InjectionKey<(fn: ScreenRefreshFn) => void> =
  Symbol('registerScreenRefresh')
