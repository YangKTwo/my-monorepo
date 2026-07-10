/**
 * 用户 API
 */

import { httpClient } from '../../cores/request'
import type {
  UserInfo,
  LoginParams,
  LoginResponse,
  UserQueryParams,
  UpdateUserParams,
  ResetPasswordParams
} from './types'
import type { PageResponse } from '../../cores/types'

export const userApi = {
  /**
   * 用户登录
   */
  login(params: LoginParams): Promise<LoginResponse> {
    return httpClient.post('/auth/login', params)
  },

  /**
   * 用户登出
   */
  logout(): Promise<void> {
    return httpClient.post('/auth/logout')
  },

  /**
   * 刷新 Token
   */
  refreshToken(): Promise<{ token: string }> {
    return httpClient.post('/auth/refresh')
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser(): Promise<UserInfo> {
    return httpClient.get('/user/current')
  },

  /**
   * 获取用户列表（分页）
   */
  getUserList(params: UserQueryParams): Promise<PageResponse<UserInfo>> {
    return httpClient.get('/user/list', { params })
  },

  /**
   * 获取用户详情
   */
  getUserDetail(id: string): Promise<UserInfo> {
    return httpClient.get(`/user/${id}`)
  },

  /**
   * 更新用户信息
   */
  updateUser(id: string, data: UpdateUserParams): Promise<UserInfo> {
    return httpClient.put(`/user/${id}`, data)
  },

  /**
   * 删除用户
   */
  deleteUser(id: string): Promise<void> {
    return httpClient.delete(`/user/${id}`)
  },

  /**
   * 重置密码（管理员）
   */
  resetPassword(id: string, newPassword: string): Promise<void> {
    return httpClient.post(`/user/${id}/reset-password`, { newPassword })
  },

  /**
   * 修改密码（用户自己）
   */
  changePassword(params: ResetPasswordParams): Promise<void> {
    return httpClient.post('/user/change-password', params)
  },

  /**
   * 更新用户状态
   */
  updateUserStatus(id: string, status: 'active' | 'inactive' | 'locked'): Promise<void> {
    return httpClient.patch(`/user/${id}/status`, { status })
  },

  /**
   * 上传头像
   */
  uploadAvatar(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient.post('/user/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
