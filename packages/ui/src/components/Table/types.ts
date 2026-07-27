export interface TableColumn {
  key: string
  label: string
  prop?: string
  width?: number | string
  minWidth?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean | 'custom'
  children?: TableColumn[]
}

export interface SortBy {
  key: string
  order: 'asc' | 'desc'
}

export interface UiTableProps {
  data?: Record<string, any>[]
  columns?: TableColumn[]
  size?: 'large' | 'default' | 'small'
  height?: string | number
  emptyText?: string
  border?: boolean
  stripe?: boolean
  variant?: 'default' | 'dashboard'
  selected?: Record<string, any>[]
  rowKey?: string | ((row: Record<string, any>) => string)
}
