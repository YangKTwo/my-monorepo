/**
 * 用户模块类型定义
 */

// 用户信息
export interface UserInfo {
  id: string
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  role: string
  status: 'active' | 'inactive' | 'locked'
  createTime: string
  updateTime: string
}

// 登录参数
export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

// 登录响应
export interface LoginResponse {
  token: string
  refreshToken: string
  expiresIn: number
  userInfo: UserInfo
}

// 用户查询参数
export interface UserQueryParams {
  username?: string
  nickname?: string
  status?: string
  pageNum?: number
  pageSize?: number
}

// 更新用户参数
export interface UpdateUserParams {
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
}

// 重置密码参数
export interface ResetPasswordParams {
  oldPassword: string
  newPassword: string
}
