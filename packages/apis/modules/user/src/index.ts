import { httpClient as request } from '@my-repo/apis/cores'

export interface UserInfo {
  id: string
  username: string
  email: string
  role: 'admin' | 'user' | 'guest'
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
}

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: UserInfo
}

export const userApi = {
  login: (params: LoginParams) => {
    return request.post<LoginResult>('/user/login', params)
  },
  getCurrentUser: () => {
    return request.get<UserInfo>('/user/current')
  },
  logout: () => {
    return request.post<void>('/user/logout')
  }
}
