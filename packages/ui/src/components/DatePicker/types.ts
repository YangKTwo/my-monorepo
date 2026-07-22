export interface UiDatePickerProps {
  modelValue?: string | null
  /** 展示格式，默认 YYYY-MM-DD */
  format?: string
  /** 绑定值格式，默认 YYYY-MM-DD（接口 dealDate 用） */
  valueFormat?: string
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  size?: 'large' | 'default' | 'small'
  /** default=常规；dashboard=大屏主题 */
  variant?: 'default' | 'dashboard'
  teleported?: boolean
  width?: string
  type?: 'date' | 'datetime' | 'daterange' | 'datetimerange'
}
