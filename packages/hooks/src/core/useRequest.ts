import { ref, shallowRef, type Ref } from 'vue'

/** useRequest 配置选项 */
export interface UseRequestOptions<T> {
  immediate?: boolean
  defaultData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

/** useRequest 返回值 */
export interface UseRequestReturn<T, A extends unknown[] = []> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  run: (...args: A) => Promise<T>
  reset: () => void
}

/**
 * 通用请求 Hook
 * 封装 loading、error、data 状态管理
 */
export function useRequest<T = unknown, A extends unknown[] = []>(
  api: (...args: A) => Promise<T>,
  options: UseRequestOptions<T> = {}
): UseRequestReturn<T, A> {
  const { immediate = false, defaultData = null, onSuccess, onError } = options

  const data = shallowRef<T | null>(defaultData as T | null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const execute = async (...args: A): Promise<T> => {
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
    execute(...([] as unknown as A))
  }

  return {
    data,
    loading,
    error,
    run: execute,
    reset
  }
}
