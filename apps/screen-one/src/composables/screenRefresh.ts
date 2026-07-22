import type { InjectionKey } from 'vue'

export type ScreenRefreshFn = () => void | Promise<void>

export const registerScreenRefreshKey: InjectionKey<(fn: ScreenRefreshFn) => void> =
  Symbol('registerScreenRefresh')
