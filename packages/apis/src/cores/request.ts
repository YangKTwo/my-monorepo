/**
 * 请求核心封装
 */

import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import type { BaseResponse, RequestConfig, BusinessError } from './types'
import { errorHandler } from './error-handler'
import { getApiConfig, TOKEN_KEY } from './config'

const NO_TOKEN_URLS = ['/user/login/auth']

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
    this.instance.interceptors.request.use((config) => {
      const { loginSource } = getApiConfig()

      //所有请求都带 Login-Source
      config.headers['Login-Source'] = loginSource

      // 非登录接口带 Finance-Token
      const url = config.url ?? ''
      const needToken = !NO_TOKEN_URLS.some((path) => url.includes(path))
      if (needToken) {
        const token = localStorage.getItem(TOKEN_KEY())
        if (token) {
          config.headers['Finance-Token'] = token
        }
      }
      return config
    })

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<BaseResponse>) => {
        const { code, msg, data } = response.data

        // 处理业务状态码
        if (code !== 0 && code !== 200) {
          // Token 过期
          if (code === 401) {
            localStorage.removeItem(TOKEN_KEY())
            getApiConfig().onUnauthorized?.()
          }
          return Promise.reject({ code, message: msg || '请求失败', data } as BusinessError)
        }

        //拦截器直接解包data
        return data as unknown as AxiosResponse
      },
      (error: AxiosError) => Promise.reject(errorHandler(error))
    )
  }

  async request<T = unknown>(config: RequestConfig): Promise<T> {
    return this.instance.request<T, T>(config)
  }

  get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }
}

export const httpClient = new HttpClient()
