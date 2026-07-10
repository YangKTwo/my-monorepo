import { ref, reactive, type Ref } from 'vue'
import { useRequest } from '../core/useRequest'

// ========== 类型定义 ==========

/** 分页参数 */
export interface PageParams {
  page: number
  pageSize: number
  [key: string]: unknown
}

/** 分页响应数据 */
export interface PageResult<T> {
  list: T[]
  total: number
}

/** useTable 配置选项 */
export interface UseTableOptions<T> {
  /** 获取数据的 API 函数 */
  fetchFn: (params: Record<string, unknown>) => Promise<PageResult<T>>
  /** 默认查询参数 */
  defaultParams?: Record<string, unknown>
  /** 默认分页大小 */
  defaultPageSize?: number
  /** 是否自动加载 */
  immediate?: boolean
  /** 数据成功加载后的回调 */
  onSuccess?: (data: PageResult<T>) => void
}

/** useTable 返回值 */
export interface UseTableReturn<T> {
  /** 表格数据 */
  data: Ref<T[]>
  /** 总数 */
  total: Ref<number>
  /** 加载状态 */
  loading: Ref<boolean>
  /** 查询参数 */
  params: Record<string, unknown>
  /** 分页信息 */
  pagination: {
    page: Ref<number>
    pageSize: Ref<number>
    total: Ref<number>
  }
  /** 刷新 */
  refresh: () => Promise<void>
  /** 重置 */
  reset: () => void
  /** 搜索 */
  search: () => Promise<void>
  /** 分页变化 */
  onPageChange: (page: number, pageSize: number) => Promise<void>
}

/**
 * 表格数据 Hook
 * 封装表格数据获取、分页、搜索逻辑
 */
export function useTable<T>(options: UseTableOptions<T>): UseTableReturn<T> {
  const { fetchFn, defaultParams = {}, defaultPageSize = 10, immediate = true, onSuccess } = options

  const page = ref(1)
  const pageSize = ref(defaultPageSize)
  const total = ref(0)

  const params = reactive<Record<string, unknown>>({
    ...defaultParams,
    page: page.value,
    pageSize: pageSize.value
  })

  // 构建请求参数
  const buildParams = (): Record<string, unknown> => {
    const result: Record<string, unknown> = { ...params }
    return result
  }

  const {
    data,
    loading,
    run,
    reset: resetRequest
  } = useRequest<PageResult<T>>(
    () => fetchFn({ ...buildParams(), page: page.value, pageSize: pageSize.value }),
    {
      immediate,
      onSuccess: (res) => {
        total.value = res.total
        onSuccess?.(res)
      }
    }
  )

  const refresh = async (): Promise<void> => {
    await run()
  }

  const reset = (): void => {
    page.value = 1
    pageSize.value = defaultPageSize
    Object.keys(defaultParams).forEach((key) => {
      params[key] = defaultParams[key]
    })
    params.page = page.value
    params.pageSize = pageSize.value
    resetRequest()
    refresh()
  }

  const search = async (): Promise<void> => {
    page.value = 1
    params.page = 1
    params.pageSize = pageSize.value
    await refresh()
  }

  const onPageChange = async (newPage: number, newPageSize: number): Promise<void> => {
    page.value = newPage
    pageSize.value = newPageSize
    params.page = newPage
    params.pageSize = newPageSize
    await refresh()
  }

  return {
    data: data as unknown as Ref<T[]>,
    total,
    loading,
    params,
    pagination: {
      page,
      pageSize,
      total
    },
    refresh,
    reset,
    search,
    onPageChange
  }
}
