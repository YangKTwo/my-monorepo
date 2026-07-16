export interface ApiConfig {
  loginSource: string
  tokenKey?: string
  onUnauthorized?: () => void
}

let apiConfig: ApiConfig = {
  loginSource: 'dz-ai-sys',
  tokenKey: 'finance_token'
}

export function setupApiConfig(config: Partial<ApiConfig>) {
  apiConfig = { ...apiConfig, ...config }
}

export function getApiConfig() {
  return apiConfig
}

export const TOKEN_KEY = () => getApiConfig().tokenKey ?? 'finance_token'
