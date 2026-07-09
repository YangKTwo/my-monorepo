export interface TableColumn {
  key: string
  label: string
  width?: string | number
  minWidth?: string | number
  fixed?: 'left' | 'right' | boolean
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

export interface SortBy {
  key: string
  order: 'asc' | 'desc'
}
