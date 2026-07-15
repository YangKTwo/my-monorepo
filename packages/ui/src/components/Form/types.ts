export interface FormOption {
  label: string
  value: string | number | boolean
}

export interface FormRuleItem {
  required?: boolean
  message?: string
  min?: number
  max?: number
  trigger?: 'blur' | 'change' | Array<'blur' | 'change'>
  pattern?: RegExp
  validator?: (rule: unknown, value: unknown, callback: (error?: Error) => void) => void
}

export type FormRules = Record<string, FormRuleItem | FormRuleItem[]>

export type FormItemType = 'input' | 'password' | 'select' | 'date' | 'number'

export interface FormConfig {
  prop: string
  label?: string
  type: FormItemType
  placeholder?: string
  required?: boolean
  options?: FormOption[]
  attrs?: Record<string, unknown>
  rules?: FormRuleItem[]
}

export type FormData = Record<string, unknown>

export interface FormActionText {
  submit?: string
  reset?: string
}

export interface FormExpose {
  validate: () => Promise<boolean>
  resetFields: () => void
  setFieldsValue: (data: FormData) => void
  getFieldsValue: () => FormData
}
