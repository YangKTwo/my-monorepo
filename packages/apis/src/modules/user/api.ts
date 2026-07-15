import { httpClient } from '../../cores/request'
import { encryptPassword } from './crypto'
import { LoginParams, UserInfo, UserRespVo } from './types'

export const userApi = {
  /**
   * 登录
   */
  login(params: LoginParams): Promise<UserRespVo> {
    return httpClient.post('user/login/auth', {
      userName: params.userName,
      userPwd: encryptPassword(params.userPwd)
    })
  },

  /**
   * 查询登录信息
   */
  getAuthInfo(): Promise<UserInfo> {
    return httpClient.get('/user/login/getAuthInfo')
  }
}
