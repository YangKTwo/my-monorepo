/**
 * 核心类型定义
 */

// 基础响应结构
export interface BaseResponse<T = any> {
  code: number
  msg: string
  data: T
  timestamp?: string
}

// 分页响应结构
export interface PageResponse<T = any> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
  totalPages: number
}

// 分页请求参数
export interface PageParams {
  pageNum?: number
  pageSize?: number
  [key: string]: any
}

// 请求配置扩展
export interface RequestConfig {
  showLoading?: boolean
  showError?: boolean
  retry?: number
  retryDelay?: number
  cache?: boolean
  cacheTime?: number
}

// 业务错误类型
export interface BusinessError {
  code: number
  message: string
  data?: any
}
