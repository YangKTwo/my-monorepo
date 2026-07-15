/**
 * 登录请求参数
 */
export interface LoginParams {
  userName: string
  userPwd: string
}

/**
 * 登录接口返回数据
 */
export interface UserRespVo {
  authorization: string
  employeeStatus: 0 | 1 // 0离职 1在职
  loginStatus: boolean
  nickName: string
  token: string
  tokenActiveTimeout: number // 活跃超时剩余秒数
  tokenTimeout: number // 总有效期剩余秒数
  userId: string
  userName: string
  userType: number
}

/**
 * getAuthInfo
 */
export interface UserInfo {
  autohrization: string
  employeeStatus: 0 | 1
  loginStatus: boolean
  nickName: string
  oldUserId: number
  rolePermission: string // 权限 key 列表（字符串，需自行 parse）
  roleRank: 0 | 1 | 2 // 0超管 1普管 2普通用户
  token: string // 续签后会更新
  tokenActiveTimeout: number
  tokenTimeout: number
  userId: number
  userName: string
  userType: -1 | 0 | 1 // -1未登录 0普通 1管理员
}

export interface LoginFormData {
  userName: string
  password: string
}
