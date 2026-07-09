export interface FormOption {
  label: string
  value: any
}

export interface FormConfig {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'number'
  placeholder?: string
  required?: boolean
  options?: FormOption[]
  attrs?: Record<string, any>
}

export type FormData = Record<string, any>
