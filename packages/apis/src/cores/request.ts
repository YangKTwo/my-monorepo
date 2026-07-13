/**
 * 请求核心封装
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import type { BaseResponse, RequestConfig, BusinessError } from './types'
import { errorHandler } from './error-handler'

class HttpClient {
  private instance: AxiosInstance
  private readonly BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

  constructor() {
    this.instance = axios.create({
      baseURL: this.BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 添加 Token
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // 添加租户ID
        const tenantId = localStorage.getItem('tenant_id')
        if (tenantId) {
          config.headers['X-Tenant-Id'] = tenantId
        }

        // 开发环境打印请求日志
        if (import.meta.env.DEV) {
          console.log('[API Request]', {
            url: config.url,
            method: config.method,
            params: config.params,
            data: config.data
          })
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<BaseResponse>) => {
        // 开发环境打印响应日志
        if (import.meta.env.DEV) {
          console.log('[API Response]', {
            url: response.config.url,
            data: response.data
          })
        }

        const { code, msg, data } = response.data

        // 处理业务状态码
        if (code !== 0 && code !== 200) {
          // Token 过期
          if (code === 401) {
            window.location.href = '/login'
          }
          // 权限不足
          if (code === 403) {
            console.warn('权限不足')
          }

          return Promise.reject({
            code,
            message: msg || '请求失败',
            data
          } as BusinessError)
        }

        return data
      },
      (error: AxiosError) => {
        return Promise.reject(errorHandler(error))
      }
    )
  }

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<T>(config)
      return response.data
    } catch (error) {
      throw errorHandler(error as AxiosError)
    }
  }

  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  post<T = unknown>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  put<T = unknown>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  patch<T = unknown>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }
}

export const httpClient = new HttpClient()
