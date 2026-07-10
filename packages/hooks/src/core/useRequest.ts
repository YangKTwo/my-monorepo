import { ref, type Ref } from 'vue'

// ========== 类型定义 ==========

/** useRequest 配置选项 */
export interface UseRequestOptions<T> {
  /** 是否自动执行 */
  immediate?: boolean
  /** 默认数据 */
  defaultData?: T
  /** 成功回调 */
  onSuccess?: (data: T) => void
  /** 失败回调 */
  onError?: (error: Error) => void
}

/** useRequest 返回值 */
export interface UseRequestReturn<T> {
  /** 数据 */
  data: Ref<T | null>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 错误信息 */
  error: Ref<Error | null>
  /** 执行请求 */
  run: (...args: unknown[]) => Promise<T>
  /** 重置状态 */
  reset: () => void
}

/**
 * 通用请求 Hook
 * 封装 loading、error、data 状态管理
 */
export function useRequest<T = unknown>(
  api: (...args: unknown[]) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T> {
  const { immediate = false, defaultData = null, onSuccess, onError } = options

  const data = ref<T | null>(defaultData as T | null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (...args: unknown[]): Promise<T> => {
    loading.value = true
    error.value = null
    try {
      const result = await api(...args)
      data.value = result
      onSuccess?.(result)
      return result
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      error.value = err
      onError?.(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = (): void => {
    data.value = defaultData as T | null
    loading.value = false
    error.value = null
  }

  if (immediate) {
    execute()
  }

  return {
    data,
    loading,
    error,
    run: execute,
    reset
  }
}
