export interface UiSelectOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

export interface UiSelectProps {
  modelValue?: string | number | boolean | null
  options?: UiSelectOption[]
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  size?: 'large' | 'default' | 'small'
  /** default=常规表单；dashboard=大屏筛选条 */
  variant?: 'default' | 'dashboard'
  teleported?: boolean
  /** 自定义宽度，如 140px / 100% */
  width?: string
}
