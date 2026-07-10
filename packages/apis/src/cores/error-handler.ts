/**
 * 错误处理
 */

import type { AxiosError } from 'axios'
import type { BusinessError } from './types'
import axios from 'axios'

const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '权限不足',
  404: '请求资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时'
}

export function errorHandler(error: AxiosError): BusinessError {
  // 请求被取消
  if (axios.isCancel(error)) {
    return {
      code: 499,
      message: '请求已取消'
    }
  }

  // 网络错误
  if (!error.response) {
    return {
      code: 500,
      message: '网络连接失败，请检查网络'
    }
  }

  const status = error.response.status
  const message = ERROR_MESSAGES[status] || `请求失败 (${status})`

  return {
    code: status,
    message,
    data: error.response.data
  }
}

export function showErrorMessage(error: BusinessError): void {
  console.error(`[API Error] ${error.code}: ${error.message}`)
}
